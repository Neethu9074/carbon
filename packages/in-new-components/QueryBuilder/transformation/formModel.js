import { type as TAG_FILTER_TYPE, toNewTagFilterFormat } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { and } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';

export const OPEN_BRACKET = 'OPEN_BRACKET';
export const CLOSE_BRACKET = 'CLOSE_BRACKET';
export const TAG = TAG_FILTER_TYPE;
export const CONJUNCTION = 'CONJUNCTION';

// This function can be used to transform between the old tag filters model
// we introduced with App 2.0 / websites 2.0 / mobile apps 1.0 in the new
// query builder model. tagFilters in this case is just an array with
// tag filters without any conjunctions.
export function fromTagFiltersArray(tagFilters, tagCatalog) {
  const doesRequireConversion = tagFilters.some(
    t => t.type == null || t.stringValue != null || t.numberValue != null || t.booleanValue != null
  );
  if (!doesRequireConversion) {
    return tagFilters;
  }

  const formModel = [];
  for (const tagFilter of tagFilters) {
    if (formModel.length > 0) {
      formModel.push({
        type: CONJUNCTION,
        logicalOperator: and
      });
    }
    formModel.push(toNewTagFilterFormat(tagFilter, tagCatalog));
  }
  return formModel;
}
