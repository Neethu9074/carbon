import {setField, removeField, containsField, getFieldTerms} from 'in-stores/search/manipulation';
import {mutateQuery} from 'in-stores/search/query';

export function setKeyword(keyword, value, negate = false) {
  mutateQuery(query => {
    query = removeField(query, keyword);
    query = removeField(query, `-${keyword}`);
    query = setField(query, negate ? `-${keyword}` : keyword, value);
    return query;
  });
}

export function removeKeyword(keyword) {
  mutateQuery(query => {
    query = removeField(query, keyword);
    query = removeField(query, `-${keyword}`);
    return query;
  });
}

export function containsKeyword(query, keyword, value, negate = false) {
  return containsField(query, negate ? `-${keyword}` : keyword, value);
}

export function getValues(query, keyword) {
  return getFieldTerms(query, keyword);
}
