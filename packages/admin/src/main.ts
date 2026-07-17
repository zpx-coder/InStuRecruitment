import { createApp } from 'vue';
import App from './App.vue';
import router from './router';

// Element Plus styles (auto-imported)
import 'element-plus/dist/index.css';
import './styles/global.css';

const app = createApp(App);
app.use(router);
app.mount('#app');
