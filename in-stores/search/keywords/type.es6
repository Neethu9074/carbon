import {setField, removeField, containsField, getFieldTerms} from 'in-stores/search/manipulation';
import {mutateQuery} from 'in-stores/search/query';

export function setTypeFilter(type, negate = false) {
  mutateQuery(query => {
    query = removeField(query, 'type');
    query = removeField(query, '-type');
    query = setField(query, negate ? '-type' : 'type', type);
    return query;
  });
}

export function removeTypeFilter() {
  mutateQuery(query => {
    query = removeField(query, 'type');
    query = removeField(query, '-type');
    return query;
  });
}

export function containsTypeFilter(query, type, negate = false) {
  return containsField(query, negate ? '-type' : 'type', type);
}

export function getTypes(query) {
  return getFieldTerms(query, 'type');
}
