import { createApp } from 'vue';
import App from './App.vue';

// Vant styles (auto-imported by unplugin-vue-components)
import 'vant/lib/index.css';
import './styles/global.css';

const app = createApp(App);
app.mount('#app');
