import SearchComponent from '@/components/TableSearchComponent/SearchForm';
import TableComponent from '@/components/TableSearchComponent/ProTable';

function install(app, options = {}) {
  if (install.installed) return;
  install.installed = true;
  app.component('SearchForm', SearchComponent);
  app.component('ProTable', TableComponent);
}

export default { install };
