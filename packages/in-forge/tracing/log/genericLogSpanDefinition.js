/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { getLabel } from 'in-forge/tracing/log/spanDefinition';

export default logSpanDefinition('log');

export function logSpanDefinition(type) {
  return {
    type: type,
    category: 'logger',

    typeName: {
      singular: 'Log',
      plural: 'Logs'
    },

    detailView: 'LogSpanDetailView',

    getLabel
  };
}
