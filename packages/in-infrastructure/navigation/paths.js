import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { navigationParameters$ } from 'in-stores/navigation/navigation';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';

export const infraExplorePath = '/explore';

export const tagFilterExpressionMatrixParameter = {
  path: infraExplorePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupMatrixParameter = {
  path: infraExplorePath,
  name: 'group',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
};

export const chartsMatrixParameter = {
  path: infraExplorePath,
  name: 'charts',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyObject
};

export const typeMatrixParameter = {
  path: infraExplorePath,
  name: 'type',
  initialState: 'host'
};

export function isInfraExploreView() {
  return navigationParameters$.map(location => location.pathname.indexOf(infraExplorePath) === 0);
}
