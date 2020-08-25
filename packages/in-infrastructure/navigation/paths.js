import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { emptyArray } from 'in-services/fixedObjects';

export const infraExplorePath = '/explore';

export const tagFilterExpressionMatrixParameter = {
  path: infraExplorePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupByMatrixParameter = {
  path: infraExplorePath,
  name: 'groupBy',
  initialState: ''
};

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}
