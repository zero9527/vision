import { createApp } from 'vue';
// 可以用 babel-plugin-import 在引入组件的时候自动引入样式，这里就可以去掉
import 'ant-design-vue/dist/antd.css';
import App from './App.vue';

const app = createApp(App);
// app.config.productionTip = false;
// app.config.globalProperties

app.mount('#app');
