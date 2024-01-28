import { createApp } from 'vue';
// global css
import 'uno.css';
import '@/assets/styles/index.scss';
import 'element-plus/theme-chalk/dark/css-vars.css';

// App、router、store
import App from './App.vue';
import store from './store';
import router from './router';

// 自定义指令
import directive from './directive';

// 注册插件
import plugins from './plugins/index'; // plugins
import { download } from '@/utils/request';

// 预设动画
import animate from './animate';

// svg图标
import 'virtual:svg-icons-register';
import ElementIcons from '@/plugins/svgicon';

//引入vue3-pro-table
import TableForm from '@/components/TableSearchComponent';
// permission control
import './permission';

//没有添加被动事件监听器来阻止'touchstart'事件，请考虑添加事件管理者'passive'，以使页面更加流畅。原因是 Chrome51 版本以后，Chrome 增加了新的事件捕获机制－Passive Event Listeners；
import 'default-passive-events';
import './styles/tailwind.css';

import { useDict } from '@/utils/dict';
import { getConfigKey, updateConfigByKey } from '@/api/system/config';
import { parseTime, addDateRange, handleTree, selectDictLabel, selectDictLabels } from '@/utils/ruoyi';
import ElementPlus from 'element-plus';

// 国际化
import i18n from '@/lang/index';

import moment from 'moment';

const app = createApp(App);
// 全局方法挂载
app.config.globalProperties.useDict = useDict;
app.config.globalProperties.getConfigKey = getConfigKey;
app.config.globalProperties.updateConfigByKey = updateConfigByKey;
app.config.globalProperties.download = download;
app.config.globalProperties.parseTime = parseTime;
app.config.globalProperties.handleTree = handleTree;
app.config.globalProperties.addDateRange = addDateRange;
app.config.globalProperties.selectDictLabel = selectDictLabel;
app.config.globalProperties.selectDictLabels = selectDictLabels;
app.config.globalProperties.animate = animate;
app.config.globalProperties.$moment = moment;

app.use(ElementPlus);
app.use(ElementIcons);
app.use(router);
app.use(store);
app.use(i18n);
app.use(plugins);
app.use(TableForm);
// 自定义指令
directive(app);

app.mount('#app');
