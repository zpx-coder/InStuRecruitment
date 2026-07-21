import { Request, Response, NextFunction } from 'express';
import { applicationSchema } from '../validators/application.schema';
import { AppError } from '../middleware/error-handler';
import * as appService from '../services/application.service';

export async function create(req: Request, res: Response, next: NextFunction) {
  try {
    const data = applicationSchema.parse(req.body);
    const result = await appService.createApplication(data);
    res.status(201).json({
      success: true,
      message: 'Submitted successfully!',
      id: result.id,
    });
  } catch (err) {
    next(err);
  }
}

export async function list(req: Request, res: Response, next: NextFunction) {
  try {
    const query = {
      page: req.query.page ? parseInt(req.query.page as string, 10) : undefined,
      per_page: req.query.per_page ? parseInt(req.query.per_page as string, 10) : undefined,
      nationality: req.query.nationality as string | undefined,
      highest_degree: req.query.highest_degree as string | undefined,
      hsk_level: req.query.hsk_level as string | undefined,
      intended_city: req.query.intended_city as string | undefined,
      name: req.query.name as string | undefined,
      university: req.query.university as string | undefined,
      proficient_languages: req.query.proficient_languages as string | undefined,
      english_proficiency: req.query.english_proficiency as string | undefined,
      post_graduation_plan: req.query.post_graduation_plan as string | undefined,
    };

    const result = await appService.listApplications(query);
    res.json({ success: true, data: result });
  } catch (err) {
    next(err);
  }
}

export async function detail(req: Request, res: Response, next: NextFunction) {
  try {
    const item = await appService.getApplication(req.params.id);
    if (!item) {
      throw new AppError('Application not found', 404);
    }
    res.json({ success: true, data: item });
  } catch (err) {
    next(err);
  }
}

export async function exportExcel(req: Request, res: Response, next: NextFunction) {
  try {
    const query = {
      nationality: req.query.nationality as string | undefined,
      highest_degree: req.query.highest_degree as string | undefined,
      hsk_level: req.query.hsk_level as string | undefined,
      intended_city: req.query.intended_city as string | undefined,
      name: req.query.name as string | undefined,
      university: req.query.university as string | undefined,
      proficient_languages: req.query.proficient_languages as string | undefined,
      english_proficiency: req.query.english_proficiency as string | undefined,
      post_graduation_plan: req.query.post_graduation_plan as string | undefined,
    };

    const buffer = await appService.exportApplications(query);
    const dateStr = new Date().toISOString().split('T')[0];

    res.setHeader('Content-Type', 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet');
    res.setHeader(
      'Content-Disposition',
      `attachment; filename*=UTF-8''${encodeURIComponent(`留学生报名数据_${dateStr}.xlsx`)}`,
    );
    res.send(buffer);
  } catch (err) {
    next(err);
  }
}
