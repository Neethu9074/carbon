/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { buildJsonSerializer, buildJsonParser } from 'in-stores/navigation/matrix';
import { emptyArray, emptyObject } from 'in-services/fixedObjects';

export function createParameters(path) {
  return {
    tagFilterExpression: {
      path,
      name: 'tagFilterExpression',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(emptyArray),
      initialState: emptyArray
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

    detailId: {
      path,
      name: 'detailId',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null)
    },

    fields: {
      path,
      name: 'fields',
      serializer: buildJsonSerializer(),
      parser: buildJsonParser(null),
    }
  };
}
