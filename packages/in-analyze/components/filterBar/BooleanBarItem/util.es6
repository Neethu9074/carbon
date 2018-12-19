import { find } from 'lodash';

export function getBooleanTagFilters({ tagFilters, tag }) {
  const isTrue = find(tagFilters, f => f.name === tag && f.operator === 'EQUALS' && f.value === 'true');
  return { isTrue };
}
