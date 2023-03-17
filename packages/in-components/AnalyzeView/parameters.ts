/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { buildJsonParser, buildJsonSerializer } from 'in-stores/navigation/matrix';
import { emptyObject } from 'in-services/fixedObjects';

export function createParameters(path: string) {
  return {
    tagFilterExpression: {
      path,
      name: 'tagFilterExpression',
      as: 'formModel',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser([]),
      initialState: []
    },
    facetedSearchMatrixParameter: {
      path,
      name: 'facets',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(emptyObject),
      initialState: emptyObject
    },

    groupBy: {
      path,
      name: 'groupBy',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(emptyObject),
      initialState: emptyObject
    },

    orderBy: {
      path,
      name: 'orderBy',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(emptyObject)
    },

    orderByGroups: {
      path,
      name: 'orderByGroups',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(emptyObject)
    },

    detailId: {
      path,
      name: 'detailId',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null)
    },

    selectedId: {
      path,
      name: 'selectedId',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null)
    },

    selectedGroup: {
      path,
      name: 'selectedGroup',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null)
    },

    initialLogLines: {
      path,
      name: 'initialLogLines',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(20)
    },

    fields: {
      path,
      name: 'fields',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null)
    },

    chartedMetrics: {
      path,
      name: 'chartedMetrics',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null)
    }
  } as const;
}
