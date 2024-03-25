import copyText from './common/copyText';
import throttle from './common/throttle'
import elSelectLoadmore from './common/elSelectLoadmore';
import { hasPermi, hasRoles } from './permission';
import { App } from 'vue';
import elTableInfiniteScroll from 'el-table-infinite-scroll';

export default (app: App) => {
  app.directive('copyText', copyText);
  app.directive('hasPermi', hasPermi);
  app.directive('hasRoles', hasRoles);
  app.directive('elTableInfiniteScroll', elTableInfiniteScroll);
  app.directive('throttle', throttle);
  app.directive('elSelectLoadmore', elSelectLoadmore)
}
