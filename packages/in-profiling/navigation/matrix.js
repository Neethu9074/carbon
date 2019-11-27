import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';

// analyze
export const group = 'group';
export const processId = 'processId';
export const tagFilters = 'tagFilters';
export const dataSource = 'dataSource';

export const serializeGroup = buildJsonSerializer();
export const deserializeGroup = buildJsonParser({ groupbyTag: 'runtime' });
export const serializeTagFilters = buildJsonSerializer();
export const deserializeTagFilters = buildJsonParser([]);
