import { migrate as migrateTagFilterArray } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { addTagFilterExpressionField } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/tagFilterUtils/form';
import { getTagCatalog } from 'in-applications/analyze/components/workspace/CallQueryBuilder';

export function createForm(form, savedState) {
  return addTagFilterExpressionField(form, savedState);
}

export function migrate(savedState) {
  return migrateTagFilterArray({
    savedState,
    getTagCatalog
  });
}
