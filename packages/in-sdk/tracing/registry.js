/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { createLogger } from '@instana/logger';

import genericLogSpanDefinition from 'in-forge/tracing/log/genericLogSpanDefinition';
import { ensurTracingPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import { t } from 'in-i18n';

let missingSpanDefinitionReported = false;

// maps type => spanDefinition
export const registry = {};

function defaultSpanDefinition(span) {
  const spanDefinition = {
    type: 'unknown',
    category: 'generic',

    typeName: {
      singular: t('in-sdk:tracing.registryCall'),
      plural: t('in-sdk:tracing.registryCall', { count: 2 })
    },

    detailView: 'GenericSpanDetailView',

    groupingDetailView: 'GenericSpanGroupingDetailView',

    getLabel() {
      return 'Unknown (' + span.get('name') + ')';
    }
  };
  return spanDefinition;
}

export function registerSpanDefinition(spanDefinition) {
  registry[spanDefinition.type] = spanDefinition;
}

export function getSpanDefinition(type, span) {
  ensurTracingPluginsAreEvaluated();
  const spanDefinition = registry[type];
  if (spanDefinition) {
    return spanDefinition;
  } else if (type.indexOf('log.') === 0) {
    return genericLogSpanDefinition;
  }

  if (!missingSpanDefinitionReported) {
    createLogger('in-sdk/tracing/registry').warn(`Span definition for ${type} could not be found.`, span?.toJS?.());
    missingSpanDefinitionReported = true;
  }

  return defaultSpanDefinition(span);
}
