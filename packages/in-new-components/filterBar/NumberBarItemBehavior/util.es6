import { find } from 'lodash';

export function getNumberTagFilters({ tagFilters, tag, showRange, showEquality }) {
  const eq = showEquality && find(tagFilters, f => f.name === tag && f.operator === 'EQUALS');
  const neq = showEquality && find(tagFilters, f => f.name === tag && f.operator === 'NOT_EQUAL');
  const lt = showRange && find(tagFilters, f => f.name === tag && f.operator === 'LESS_THAN');
  const gt = showRange && find(tagFilters, f => f.name === tag && f.operator === 'GREATER_THAN');
  return { eq, neq, lt, gt };
}
