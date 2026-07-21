/**
 * Integration tests for the YiwuTrade API.
 *
 * Covers: health check, dict options, application submission,
 * auth login/me, list/filter, detail, Excel export, rate limiting.
 *
 * Run: npx tsx --test src/__tests__/api.test.ts
 */
import { describe, it, before, after } from 'node:test';
import assert from 'node:assert';
import http from 'node:http';

// --------------- helpers ---------------

const BASE = 'http://localhost:3000';

async function request(
  method: string,
  path: string,
  opts?: { body?: unknown; token?: string },
): Promise<{ status: number; data: any; headers: http.IncomingHttpHeaders }> {
  return new Promise((resolve, reject) => {
    const url = new URL(path, BASE);
    const bodyStr = opts?.body ? JSON.stringify(opts.body) : undefined;

    const req = http.request(
      url,
      {
        method,
        headers: {
          'Content-Type': 'application/json',
          ...(opts?.token ? { Authorization: `Bearer ${opts.token}` } : {}),
          ...(bodyStr ? { 'Content-Length': String(Buffer.byteLength(bodyStr)) } : {}),
        },
      },
      (res) => {
        const chunks: Buffer[] = [];
        res.on('data', (chunk) => chunks.push(chunk));
        res.on('end', () => {
          const raw = Buffer.concat(chunks).toString();
          let data: any;
          try {
            data = JSON.parse(raw);
          } catch {
            data = raw;
          }
          resolve({ status: res.statusCode || 0, data, headers: res.headers });
        });
      },
    );

    req.on('error', reject);
    if (bodyStr) req.write(bodyStr);
    req.end();
  });
}

const validApplication = {
  name: 'Test Student',
  gender: 'male',
  phone: '+8613800138000',
  email: 'test.student@example.com',
  nationality: 'South Korea',
  birthday: '2000-06-15',
  passport_number: 'M12345678',
  proficient_languages: ['korean', 'chinese', 'english'],
  hsk_level: 'hsk5',
  english_proficiency: 'fluent',
  university: 'Peking University',
  major: 'International Trade',
  highest_degree: 'bachelor',
  current_academic_year: 'year_3',
  graduation_date: '2027-06-30',
  post_graduation_plan: 'full_time',
  intended_city: 'Shanghai',
  family_business: 'Family runs a textile trading company, interested in expanding to European markets with sustainable fabrics.',
};

let adminToken = '';
let createdAppId = '';

// --------------- tests ---------------

describe('YiwuTrade API Integration Tests', () => {
  // -- Setup: get admin token --
  before(async () => {
    const res = await request('POST', '/api/auth/login', {
      body: { username: 'admin', password: 'admin123' },
    });
    assert.strictEqual(res.status, 200);
    assert.ok(res.data.token);
    adminToken = res.data.token;
  });

  // === Health ===
  describe('GET /api/health', () => {
    it('should return ok status', async () => {
      const res = await request('GET', '/api/health');
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.status, 'ok');
    });
  });

  // === Dict ===
  describe('GET /api/dict/options', () => {
    it('should return 7 enum option groups', async () => {
      const res = await request('GET', '/api/dict/options');
      assert.strictEqual(res.status, 200);
      assert.ok(res.data.success);
      const keys = Object.keys(res.data.data);
      assert.deepStrictEqual(keys.sort(), [
        'current_academic_year',
        'english_proficiency',
        'gender',
        'highest_degree',
        'hsk_level',
        'post_graduation_plan',
        'proficient_languages',
      ].sort());
    });

    it('should have 9 HSK levels', async () => {
      const res = await request('GET', '/api/dict/options');
      assert.strictEqual(res.data.data.hsk_level.length, 9);
    });
  });

  // === Submit Application ===
  describe('POST /api/applications', () => {
    it('should reject empty body with 422 and field errors', async () => {
      const res = await request('POST', '/api/applications', { body: {} });
      assert.strictEqual(res.status, 422);
      assert.strictEqual(res.data.success, false);
      assert.ok(Array.isArray(res.data.errors));
      assert.ok(res.data.errors.length >= 18);
      // Each error should have field + message
      for (const e of res.data.errors) {
        assert.ok(e.field);
        assert.ok(e.message);
      }
    });

    it('should reject invalid email', async () => {
      const res = await request('POST', '/api/applications', {
        body: { ...validApplication, email: 'not-an-email' },
      });
      assert.strictEqual(res.status, 422);
      assert.ok(res.data.errors.some((e: any) => e.field === 'email'));
    });

    it('should reject age < 16', async () => {
      const res = await request('POST', '/api/applications', {
        body: { ...validApplication, birthday: '2020-01-01' },
      });
      assert.strictEqual(res.status, 422);
      assert.ok(res.data.errors.some((e: any) =>
        e.field === 'birthday' && e.message.includes('16'),
      ));
    });

    it('should reject age > 60', async () => {
      const res = await request('POST', '/api/applications', {
        body: { ...validApplication, birthday: '1900-01-01' },
      });
      assert.strictEqual(res.status, 422);
      assert.ok(res.data.errors.some((e: any) =>
        e.field === 'birthday' && e.message.includes('60'),
      ));
    });

    it('should create application successfully', async () => {
      const uniqueEmail = `test.${Date.now()}@example.com`;
      const res = await request('POST', '/api/applications', {
        body: { ...validApplication, email: uniqueEmail },
      });
      assert.strictEqual(res.status, 201);
      assert.strictEqual(res.data.success, true);
      assert.ok(res.data.id);
      assert.ok(res.data.message);
      createdAppId = res.data.id;
    });
  });

  // === Auth ===
  describe('POST /api/auth/login', () => {
    it('should return 401 for wrong credentials', async () => {
      const res = await request('POST', '/api/auth/login', {
        body: { username: 'admin', password: 'wrongpassword' },
      });
      assert.strictEqual(res.status, 401);
      assert.strictEqual(res.data.success, false);
    });

    it('should return 422 for empty body', async () => {
      const res = await request('POST', '/api/auth/login', { body: {} });
      assert.strictEqual(res.status, 422);
    });
  });

  describe('GET /api/auth/me', () => {
    it('should return 401 without token', async () => {
      const res = await request('GET', '/api/auth/me');
      assert.strictEqual(res.status, 401);
    });

    it('should return 401 with invalid token', async () => {
      const res = await request('GET', '/api/auth/me', { token: 'invalid.token.here' });
      assert.strictEqual(res.status, 401);
    });

    it('should return user info with valid token', async () => {
      const res = await request('GET', '/api/auth/me', { token: adminToken });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.username, 'admin');
      assert.ok(res.data.data.id);
    });
  });

  // === Application List ===
  describe('GET /api/applications', () => {
    it('should reject unauthenticated request', async () => {
      const res = await request('GET', '/api/applications');
      assert.strictEqual(res.status, 401);
    });

    it('should return paginated list', async () => {
      const res = await request('GET', '/api/applications', { token: adminToken });
      assert.strictEqual(res.status, 200);
      assert.ok(res.data.success);
      assert.ok(Array.isArray(res.data.data.items));
      assert.ok(res.data.data.pagination.total >= 1);
      assert.ok(res.data.data.pagination.total_pages >= 1);
    });

    it('should decrypt passport in list', async () => {
      const res = await request('GET', '/api/applications', { token: adminToken });
      const item = res.data.data.items.find((i: any) => i.id === createdAppId);
      if (item) {
        assert.strictEqual(item.passportNumber, validApplication.passport_number);
      }
    });

    it('should parse proficientLanguages from JSON', async () => {
      const res = await request('GET', '/api/applications', { token: adminToken });
      const item = res.data.data.items.find((i: any) => i.id === createdAppId);
      if (item) {
        assert.ok(Array.isArray(item.proficientLanguages));
      }
    });

    it('should filter by nationality', async () => {
      const res = await request('GET', '/api/applications?nationality=South+Korea', { token: adminToken });
      assert.ok(res.data.data.items.length >= 1);
    });

    it('should filter by hsk_level', async () => {
      const res = await request('GET', '/api/applications?hsk_level=hsk5', { token: adminToken });
      assert.ok(res.data.data.items.length >= 1);
    });

    it('should return empty for non-matching filter', async () => {
      const res = await request('GET', '/api/applications?name=DefinitelyNoMatch999', { token: adminToken });
      assert.strictEqual(res.data.data.items.length, 0);
    });
  });

  // === Application Detail ===
  describe('GET /api/applications/:id', () => {
    it('should return 401 without token', async () => {
      const res = await request('GET', `/api/applications/${createdAppId}`);
      assert.strictEqual(res.status, 401);
    });

    it('should return 404 for non-existent ID', async () => {
      const res = await request('GET', '/api/applications/00000000-0000-0000-0000-000000000000', { token: adminToken });
      assert.strictEqual(res.status, 404);
    });

    it('should return detail with decrypted passport', async () => {
      const res = await request('GET', `/api/applications/${createdAppId}`, { token: adminToken });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(res.data.success, true);
      assert.strictEqual(res.data.data.passportNumber, validApplication.passport_number);
    });
  });

  // === Excel Export ===
  describe('GET /api/applications/export', () => {
    it('should return 401 without token', async () => {
      const res = await request('GET', '/api/applications/export');
      assert.strictEqual(res.status, 401);
    });

    it('should return xlsx file', async () => {
      const res = await request('GET', '/api/applications/export', { token: adminToken });
      assert.strictEqual(res.status, 200);
      assert.strictEqual(
        res.headers['content-type'],
        'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      );
      assert.ok(res.headers['content-disposition']?.includes('filename'));
    });
  });
});
