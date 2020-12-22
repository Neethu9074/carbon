import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { logsPath, rawLogsPath } from 'in-logging/navigation/paths';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';
import { allAvailableTags } from 'in-logging/navigation/tags';

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
  name: 'logId'
};

export const selectedTags = {
  path: logsPath,
  name: 'tags',
  parser: buildJsonParser(emptyArray),
  serializer: buildJsonSerializer(),
  initialState: allAvailableTags
};

export const selectedTagsRawLogs = {
  path: rawLogsPath,
  name: 'tags',
  parser: buildJsonParser(emptyArray),
  serializer: buildJsonSerializer(),
  initialState: allAvailableTags
};
