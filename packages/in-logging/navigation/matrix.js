import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { analyzePath } from 'in-logging/navigation/paths';

export const dataSource = 'dataSource';

export const tagFilterExpressionMatrixParameter = {
  path: analyzePath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupByMatrixParameter = {
  path: analyzePath,
  name: 'groupBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
};

export const orderByMatrixParameter = {
  path: analyzePath,
  name: 'orderBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { by: 'timestamp', direction: 'DESC' }
};

export const logIdMatrixParameter = {
  path: analyzePath,
  name: 'logId',
  serializer: v => v,
  parser: v => v,
  initialState: ''
};
