import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { analyzePath } from 'in-logging/navigation/paths';

export const dataSource = 'logs';

export const tagFilterExpressionMatrixParameter = {
  path: analyzePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyArray
};

export const groupByMatrixParameter = {
  path: analyzePath,
  name: 'groupBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyObject
};

export const orderByMatrixParameter = {
  path: analyzePath,
  name: 'orderByGroups',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { by: 'timestamp', direction: 'DESC' }
};
