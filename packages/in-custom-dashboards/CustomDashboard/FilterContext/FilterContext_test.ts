/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { expect } from 'chai';

import { TagFilterExpressionElementUnion, TagFilterOperator, UnifiedMetricConfiguration } from '@instana/types';

import {
  Conjunction,
  MinimalTagDefinition,
  SelfValidatingTagFilter,
  TAG
} from 'in-components/QueryBuilder/transformation/formModel';
import { EMPTY_EXPRESSION } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { MaybeFilterable, applyFilteredConfiguration } from './FilterContext';

describe('in-custom-dashboards/CustomDashboard/FilterContext/applyFilteredConfiguration', () => {
  it('must statically remove not-applicable filters', () => {
    const {
      metricConfiguration,
      result: { code: resultCode }
    } = applyFilteredConfiguration(createMetricConfiguration('INFRASTRUCTURE_METRICS'), [
      createTagFilter('endpoint.name', 'GET /foo', ENDPOINT_NAME_TAG_DEFINITION)
    ]);

    expect(resultCode).to.equal('OMITTED_SELECTS_NOTHING');
    expect(metricConfiguration.tagFilterExpression).to.deep.equal(EMPTY_EXPRESSION);
  });

  it('must apply applicable filters', () => {
    const appName = createTagFilter('jvm.app.name', 'my application', APP_NAME_TAG_DEFINITION);
    const {
      metricConfiguration,
      result: { code: resultCode }
    } = applyFilteredConfiguration(createMetricConfiguration('INFRASTRUCTURE_METRICS'), [appName]);

    expect(resultCode).to.equal('APPLIED');
    expect(metricConfiguration.tagFilterExpression).to.deep.equal(appName);
  });

  it('must statically remove non-applicable filters from multiple filter expression', () => {
    const hostName = createTagFilter('host.name', 'my host', HOST_NAME_TAG_DEFINITION);
    const appName = createTagFilter('jvm.app.name', 'my app', APP_NAME_TAG_DEFINITION);
    const {
      metricConfiguration,
      result: { code: resultCode }
    } = applyFilteredConfiguration(createMetricConfiguration('INFRASTRUCTURE_METRICS', hostName), [
      createTagFilter('endpoint.name', 'GET /foo', ENDPOINT_NAME_TAG_DEFINITION),
      OR,
      appName
    ]);

    expect(resultCode).to.equal('PARTIALLY_APPLIED');
    expect(metricConfiguration.tagFilterExpression).to.deep.equal({
      type: 'EXPRESSION',
      logicalOperator: 'AND',
      elements: [hostName, appName]
    });
  });

  it('must ignore non-applicable negative filters', () => {
    const appName = createTagFilter('jvm.app.name', 'my app', APP_NAME_TAG_DEFINITION);
    const {
      metricConfiguration,
      result: { code: resultCode }
    } = applyFilteredConfiguration(createMetricConfiguration('INFRASTRUCTURE_METRICS', EMPTY_EXPRESSION), [
      createTagFilter('endpoint.name', 'ignored', ENDPOINT_NAME_TAG_DEFINITION, 'NOT_EQUAL'),
      AND,
      appName
    ]);

    expect(resultCode).to.equal('PARTIALLY_APPLIED');
    expect(metricConfiguration.tagFilterExpression).to.deep.equal(appName);
  });
});

const ENDPOINT_NAME_TAG_DEFINITION: MinimalTagDefinition = {
  name: 'endpoint.name',
  type: 'STRING',
  path: [{ label: 'Endpoint' }, { label: 'Name' }],
  availability: ['APPLICATION']
};

const APP_NAME_TAG_DEFINITION: MinimalTagDefinition = {
  name: 'jvm.app.name',
  type: 'STRING',
  path: [{ label: 'JVM' }, { label: 'App' }, { label: 'Name' }],
  availability: ['INFRASTRUCTURE_METRICS']
};

const HOST_NAME_TAG_DEFINITION: MinimalTagDefinition = {
  name: 'host.name',
  type: 'STRING',
  path: [{ label: 'Host' }, { label: 'Name' }],
  availability: ['INFRASTRUCTURE_METRICS']
};

const OR: Conjunction = {
  type: 'CONJUNCTION',
  logicalOperator: 'OR'
};

const AND: Conjunction = {
  type: 'CONJUNCTION',
  logicalOperator: 'AND'
};

function createTagFilter(
  name: string,
  value: any,
  tagDefinition: MinimalTagDefinition,
  operator: TagFilterOperator = 'EQUALS'
): SelfValidatingTagFilter {
  return {
    type: TAG,
    name,
    value,
    operator,
    entity: 'NOT_APPLICABLE',
    tagDefinition
  };
}

function createMetricConfiguration(
  source: UnifiedMetricConfiguration['source'],
  tagFilterExpression: TagFilterExpressionElementUnion = EMPTY_EXPRESSION
): UnifiedMetricConfiguration & MaybeFilterable {
  return {
    source,
    aggregation: 'MEAN',
    metric: 'gc.time',
    resultType: 'TIME_SERIES',
    timeConfig: { windowSize: 3600000, autoRefresh: false },
    timeShift: { offset: 0 },
    tagFilterExpression
  };
}
