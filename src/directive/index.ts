import copyText from './common/copyText';
import { hasPermi, hasRoles } from './permission';
import { App } from 'vue';
import elTableInfiniteScroll from 'el-table-infinite-scroll';

export default (app: App) => {
  app.directive('copyText', copyText);
  app.directive('hasPermi', hasPermi);
  app.directive('hasRoles', hasRoles);
  app.directive('elTableInfiniteScroll', elTableInfiniteScroll);
};
