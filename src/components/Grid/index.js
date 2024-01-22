import GridItem from "@/components/Grid/components/GridItem.vue";
import SearchFormItem from "@/components/TableSearchComponent/SearchForm/components/SearchFormItem.vue";

function install(app, options = {}) {
  if (install.installed) return;
  install.installed = true;

  app.component('GridItem', GridItem);
  app.component('SearchFormItem', SearchFormItem);
}

export default { install };
