/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createContext, useContext } from 'react';
import { isEqual, uniq } from 'lodash';

import {
  TagFilter,
  TagFilterExpression,
  TagFilterExpressionElementUnion,
  UnifiedMetricConfiguration,
  isTagFilterExpression
} from '@instana/types';
import { MetricSource } from '@instana/types/typeDefinitions';
import { t } from '@instana/i18n-react';

import {
  FormModelElement,
  MinimalTagDefinition,
  SelfValidatingTagFilter
} from 'in-components/QueryBuilder/transformation/formModel';
import {
  EMPTY_EXPRESSION,
  EXPRESSION,
  toBackendQueryModel
} from 'in-components/QueryBuilder/transformation/backendQueryModel';

export const FilterContext = createContext<FormModelElement[]>([]);

export function useFilterContext() {
  return useContext(FilterContext);
}

export interface MaybeFilterable {
  tagFilterExpression?: TagFilterExpressionElementUnion;
}

export type HasSource = Required<Pick<UnifiedMetricConfiguration, 'source'>>;

interface MaybeLabeled {
  label?: string;
  metricLabel?: string;
  metric?: string;
}

export type FilterResultCode =
  | 'OMITTED_SELECTS_EVERYTHING'
  | 'OMITTED_SELECTS_NOTHING'
  | 'PARTIALLY_APPLIED'
  | 'APPLIED'
  | 'NOT_SUPPORTED';

export interface FilterResult {
  code: FilterResultCode;
  dataset?: string;
}

export interface FilteringResult<T> {
  metricConfiguration: T;
  result: FilterResult;
}

const NOTES: { [resultCode in FilterResultCode]?: string } = {
  OMITTED_SELECTS_EVERYTHING: t('in-custom-dashboards:customDashboard.filterContext.topLevelFilterSelectsEverything'),
  OMITTED_SELECTS_NOTHING: t('in-custom-dashboards:customDashboard.filterContext.topLevelFilterSelectsNothing'),
  PARTIALLY_APPLIED: t('in-custom-dashboards:customDashboard.filterContext.topLevelFilterPartiallyApplied'),
  NOT_SUPPORTED: t('in-custom-dashboards:customDashboard.filterContext.topLevelFilterNotSupported')
};

export function getFilterResultNote(result?: FilterResult): string | undefined {
  return result && NOTES[result.code];
}

export function summarizeFilterResult(result: FilterResult[]): string | undefined {
  const uniqueCodes = uniq(result.map(r => r.code));
  const notAppliedDatasets = uniq(result.filter(r => r.code !== 'APPLIED').map(r => r.dataset));
  if (uniqueCodes.length === 0) {
    return undefined;
  } else if (uniqueCodes.length === 1) {
    return NOTES[uniqueCodes[0]];
  } else {
    return t('in-custom-dashboards:customDashboard.filterContext.topLevelFilterAppliedToSomeDatasets', {
      datasets: notAppliedDatasets.join(', ')
    });
  }
}

export function useFilteredMetricConfiguration<T extends MaybeLabeled & MaybeFilterable & HasSource>(
  metricConfiguration: T
): FilteringResult<T> {
  const formModel = useFilterContext();
  return applyFilteredConfiguration(metricConfiguration, formModel);
}

export function applyFilteredConfiguration<T extends MaybeLabeled & MaybeFilterable & HasSource>(
  metricConfiguration: T,
  filter: FormModelElement[]
): FilteringResult<T> {
  const dataset = getDataset(metricConfiguration);
  if (!filter || filter.length === 0) {
    return {
      metricConfiguration,
      result: {
        code: 'APPLIED',
        dataset
      }
    };
  }
  if (!('tagFilterExpression' in metricConfiguration)) {
    return {
      metricConfiguration,
      result: {
        code: 'NOT_SUPPORTED',
        dataset
      }
    };
  }
  const { expression, resultCode } = reduceFormModel(filter, metricConfiguration.source);
  if (isEqual(metricConfiguration.tagFilterExpression, EMPTY_EXPRESSION)) {
    return {
      metricConfiguration: {
        ...metricConfiguration,
        tagFilterExpression: expression
      },
      result: {
        code: resultCode,
        dataset
      }
    };
  } else {
    return {
      metricConfiguration: {
        ...metricConfiguration,
        tagFilterExpression: {
          type: 'EXPRESSION',
          logicalOperator: 'AND',
          elements: [metricConfiguration.tagFilterExpression, expression]
        }
      },
      result: {
        code: resultCode,
        dataset
      }
    };
  }
}

function getDataset(metricConfiguration: MaybeLabeled) {
  if (metricConfiguration.label) {
    return metricConfiguration.label;
  }

  if (metricConfiguration.metricLabel) {
    return metricConfiguration.metricLabel;
  }

  if (metricConfiguration.metric) {
    return metricConfiguration.metric;
  }

  return t('in-custom-dashboards:customDashboard.filterContext.unnamedDataset');
}

function reduceFormModel(
  formModel: FormModelElement[],
  source: UnifiedMetricConfiguration['source']
): ReducedTagFilterExpression {
  const tagDefinitions = formModel.reduce<{ [name: string]: MinimalTagDefinition }>((acc, elem) => {
    if (isSelfValidatingTagFilter(elem) && elem.tagDefinition) {
      acc[elem.tagDefinition.name] = elem.tagDefinition;
    }
    return acc;
  }, {});

  const tagFilterExpression = toBackendQueryModel(formModel);
  return reduceFilterExpressionElement(tagFilterExpression, tagDefinitions, source);
}

interface ReducedTagFilterExpression {
  resultCode: FilterResultCode;
  expression: TagFilterExpressionElementUnion;
}

function reduceFilterExpressionElement(
  tagFilterExpression: TagFilterExpressionElementUnion,
  tagDefinitions: { [name: string]: MinimalTagDefinition },
  source: UnifiedMetricConfiguration['source']
): ReducedTagFilterExpression {
  if (isTagFilterExpression(tagFilterExpression)) {
    return reduceExpression(tagFilterExpression, tagDefinitions, source);
  }
  return reduceTagFilter(tagFilterExpression, tagDefinitions, source);
}

// note: NOT_BLANK and NOT_EMPTY are not included because they both imply a value is present
const NEGATIVE_OPERATORS = ['NOT_EQUAL', 'NOT_CONTAIN', 'NOT_STARTS_WITH', 'NOT_ENDS_WITH'];

function reduceExpression(
  tagFilterExpression: TagFilterExpression,
  tagDefinitions: { [name: string]: MinimalTagDefinition },
  source: UnifiedMetricConfiguration['source']
): ReducedTagFilterExpression {
  const reducedElements = tagFilterExpression.elements.map(elem =>
    reduceFilterExpressionElement(elem, tagDefinitions, source)
  );
  if (
    reducedElements.every(e => e.resultCode === 'OMITTED_SELECTS_NOTHING') ||
    (tagFilterExpression.logicalOperator === 'AND' &&
      reducedElements.find(e => e.resultCode === 'OMITTED_SELECTS_NOTHING'))
  ) {
    return {
      resultCode: 'OMITTED_SELECTS_NOTHING',
      expression: EMPTY_EXPRESSION
    };
  } else if (
    reducedElements.every(e => e.resultCode === 'OMITTED_SELECTS_EVERYTHING') ||
    (tagFilterExpression.logicalOperator === 'OR' &&
      reducedElements.find(e => e.resultCode === 'OMITTED_SELECTS_EVERYTHING'))
  ) {
    return {
      resultCode: 'OMITTED_SELECTS_EVERYTHING',
      expression: EMPTY_EXPRESSION
    };
  } else {
    const elements = reducedElements
      .map(e => e.expression)
      .filter(e => !isTagFilterExpression(e) || e.elements.length > 0);
    const resultCode = reducedElements.every(e => e.resultCode === 'APPLIED') ? 'APPLIED' : 'PARTIALLY_APPLIED';
    if (elements.length === 1) {
      return {
        expression: elements[0],
        resultCode
      };
    } else {
      return {
        expression: {
          type: EXPRESSION,
          elements,
          logicalOperator: tagFilterExpression.logicalOperator
        },
        resultCode
      };
    }
  }
}

function reduceTagFilter(
  tagFilter: TagFilter,
  tagDefinitions: { [name: string]: MinimalTagDefinition },
  source: UnifiedMetricConfiguration['source']
): ReducedTagFilterExpression {
  const tagDefinition = tagDefinitions[tagFilter.name];
  // FIXME: there is a clash in the types:
  // UnifiedMetricConfiguration.source contains SUBTRACE while
  // MetricSource contains SUBTRACES
  // this seems to be a bug on the server-side, and needs further
  // investigation
  // casting to MetricSource here, is for fixing this current build, only
  if (tagDefinition?.availability?.includes(source as MetricSource)) {
    return {
      resultCode: 'APPLIED',
      expression: tagFilter
    };
  }
  if (NEGATIVE_OPERATORS.includes(tagFilter.operator)) {
    return {
      resultCode: 'OMITTED_SELECTS_EVERYTHING',
      expression: EMPTY_EXPRESSION
    };
  } else {
    return {
      resultCode: 'OMITTED_SELECTS_NOTHING',
      expression: EMPTY_EXPRESSION
    };
  }
}

function isSelfValidatingTagFilter(element: FormModelElement): element is SelfValidatingTagFilter {
  return element.type === 'TAG_FILTER';
}
