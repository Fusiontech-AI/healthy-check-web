import SearchComponent from '@/components/TableSearchComponent/SearchForm';
import TableComponent from '@/components/TableSearchComponent/ProTable';
import FormGuid from '@/components/TableSearchComponent/FormGuid';

function install(app, options = {}) {
  if (install.installed) return;
  install.installed = true;

  app.component('SearchForm', SearchComponent);
  app.component('ProTable', TableComponent);
  app.component('FormGuid', TableComponent);
}

export default { install };
