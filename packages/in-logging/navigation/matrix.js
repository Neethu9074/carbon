import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { logsPath } from 'in-logging/navigation/paths';

export const dataSource = 'dataSource';

export const tagFilterExpressionMatrixParameter = {
  path: logsPath,
  name: 'tagFilterExpression',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyArray),
  initialState: emptyArray
};

export const groupByMatrixParameter = {
  path: logsPath,
  name: 'groupBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: emptyObject
};

export const orderByMatrixParameter = {
  path: logsPath,
  name: 'orderBy',
  serializer: buildJsonSerializer(),
  parser: buildJsonParser(emptyObject),
  initialState: { by: 'timestamp', direction: 'DESC' }
};

export const logIdMatrixParameter = {
  path: logsPath,
  name: 'logId',
  serializer: v => v,
  parser: v => v,
  initialState: ''
};
