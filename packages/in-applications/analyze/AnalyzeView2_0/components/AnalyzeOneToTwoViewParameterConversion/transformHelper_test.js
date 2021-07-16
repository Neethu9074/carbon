/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { expect } from 'chai';

import {
  CONTAINS,
  ENDS_WITH,
  EQUALS,
  GREATER_OR_EQUAL_THAN,
  GREATER_THAN,
  IS_EMPTY,
  LESS_OR_EQUAL_THAN,
  LESS_THAN,
  NOT_EMPTY,
  NOT_EQUAL,
  NOT_STARTS_WITH,
  STARTS_WITH
} from 'in-components/QueryBuilder/tagFilter/operators';
import {
  httpStatusCodeTagFiltersToExpression,
  isAnalyticsOneLocation,
  transformOneZeroToTwoZero
} from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import { CLOSE_BRACKET, CONJUNCTION, OPEN_BRACKET } from 'in-components/QueryBuilder/transformation/formModel';
import { type as TAG_FILTER } from 'in-components/QueryBuilder/transformation/tagFilter';
import { TAG_CALL_HTTP_STATUS } from 'in-applications/analyze/utils/formModelUtils';
import { metric as metricType } from 'in-components/AnalyzeView/fieldTypes';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

export const EXP_OPEN_BRACKET = Object.freeze({ type: OPEN_BRACKET });
export const EXP_CLOSE_BRACKET = Object.freeze({ type: CLOSE_BRACKET });
export const EXP_AND_CONJUNCTION = Object.freeze({ type: CONJUNCTION, logicalOperator: 'AND' });
export const EXP_OR_CONJUNCTION = Object.freeze({ type: CONJUNCTION, logicalOperator: 'OR' });

const cases = [
  {
    name: 'grouped views',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'calls',
          'callList.groupBy': '(name~endpoint.name~value~*~entity~DESTINATION)~',
          'callList.showGraph': true,
          'callList.focusedMetric': 'latency_MEAN',
          'groups.metrics':
            '!(metric~latency~aggregation~MEAN)(metric~errors~aggregation~MEAN)(metric~latency~aggregation~P50)~',
          'groups.orderBy': 'latency_MEAN_Agg',
          'groups.orderDirection': 'DESC',
          'rawItems.orderBy': 'latency',
          'rawItems.orderDirection': 'DESC',
          'callList.tagFilter': '!(name~service.name~value~backbone~operator~EQUALS~entity~DESTINATION)~'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          fields:
            '!(type~metric~metricId~latency~aggregationId~MEAN)(type~metric~metricId~errors~aggregationId~MEAN)(type~metric~metricId~latency~aggregationId~P50)~',
          chartedMetrics: '!(metricId~latency~aggregationId~MEAN)~',
          groupBy: '(groupbyTag~endpoint.name~groupbyTagEntity~DESTINATION)~',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~service.name~value~backbone~operator~EQUALS~entity~DESTINATION)~',
          orderBy: '(by~latency~direction~DESC)~',
          orderByGroups: '(by~latency*_MEAN~direction~DESC)~'
        }
      }
    }
  },
  {
    name: 'group by endpoint.name with wrong entity type NOT_APPLICABLE and default chart',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'calls',
          'callList.groupBy': '(name~endpoint.name~value~*~entity~NOT*_APPLICABLE)~',
          'groups.orderBy': 'firstTimestamp',
          'groups.orderDirection': 'ASC',
          'rawItems.orderBy': 'timestamp',
          'rawItems.orderDirection': 'ASC'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~',
          dataSource: 'calls',
          groupBy: '(groupbyTag~endpoint.name~groupbyTagEntity~DESTINATION)~',
          orderBy: '(by~timestamp~direction~ASC)~',
          orderByGroups: '(by~firstTimestamp~direction~ASC)~'
        }
      }
    }
  },
  {
    name: 'grouped view with hidden calls',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'calls',
          'callList.groupBy': '(name~call.http.status~entity~NOT*_APPLICABLE)~',
          'callList.showGraph': true,
          'callList.focusedMetric': 'latency_MEAN',
          'groups.metrics':
            '!(metric~latency~aggregation~MEAN)(metric~errors~aggregation~MEAN)(metric~latency~aggregation~P50)~',
          'groups.orderBy': 'group',
          'groups.orderDirection': 'DESC',
          'callList.tagFilter':
            '!(name~service.name~value~Apache_Tomcat_Bootstrap~operator~EQUALS~entity~DESTINATION)(name~call.erroneous~value~true~operator~EQUALS~entity~NOT*_APPLICABLE)(name~include*_synthetic~value~true~operator~EQUALS~entity~NOT*_APPLICABLE)(name~include*_internal~value~true~operator~EQUALS~entity~NOT*_APPLICABLE)~'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          chartedMetrics: '!(metricId~latency~aggregationId~MEAN)~',
          dataSource: 'calls',
          fields:
            '!(type~metric~metricId~latency~aggregationId~MEAN)(type~metric~metricId~errors~aggregationId~MEAN)(type~metric~metricId~latency~aggregationId~P50)~',
          groupBy: '(groupbyTag~call.http.status)~',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~service.name~value~Apache_Tomcat_Bootstrap~operator~EQUALS~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~call.erroneous~value~~operator~EQUALS)~',
          orderByGroups: '(by~group~direction~DESC)~',
          hiddenCalls: '(includeInternal~~includeSynthetic)~'
        }
      }
    }
  },
  {
    name: 'preview enabled',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'calls',
          'callList.previewEnabled': true,
          'callList.groupBy': '(name~call.http.status~entity~NOT*_APPLICABLE)~',
          'groups.orderBy': 'count',
          'groups.orderDirection': 'ASC'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~',
          dataSource: 'calls',
          previewEnabled: true,
          groupBy: '(groupbyTag~call.http.status)~',
          orderByGroups: '(by~calls*_SUM~direction~ASC)~'
        }
      }
    }
  },

  {
    name: 'grouped traces',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'traces',
          'callList.groupBy': '(name~trace.endpoint.name~value~*~entity~NOT*_APPLICABLE)~',
          'callList.showGraph': true,
          'callList.focusedMetric': 'latency_MEAN',
          'groups.metrics':
            '!(metric~latency~aggregation~MEAN)(metric~errors~aggregation~MEAN)(metric~latency~aggregation~P98)~',
          'groups.orderBy': 'count',
          'groups.orderDirection': 'DESC',
          'callList.tagFilter': '!(name~call.type~value~BATCH~operator~EQUALS~entity~NOT*_APPLICABLE)~'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          chartedMetrics: '!(metricId~latency~aggregationId~MEAN)~',
          dataSource: 'traces',
          fields:
            '!(type~metric~metricId~latency~aggregationId~MEAN)(type~metric~metricId~errors~aggregationId~MEAN)(type~metric~metricId~latency~aggregationId~P98)~',
          groupBy: '(groupbyTag~trace.endpoint.name)~',
          tagFilterExpression: '!(type~TAG*_FILTER~name~call.type~value~BATCH~operator~EQUALS)~',
          orderByGroups: '(by~traces*_SUM~direction~DESC)~'
        }
      }
    }
  },
  {
    name: 'grouped traces with chart traces sum',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'traces',
          'callList.groupBy': '(name~trace.endpoint.name~value~*~entity~NOT*_APPLICABLE)~',
          'callList.showGraph': true,
          'callList.focusedMetric': 'traces_SUM'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          chartedMetrics: '!(metricId~calls~aggregationId~SUM)~',
          dataSource: 'traces',
          groupBy: '(groupbyTag~trace.endpoint.name)~'
        }
      }
    }
  },
  {
    name: 'trace detail',
    one: {
      pathname: '/analyze/trace/tree',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'traces',
          'callList.groupBy': '(name~trace.endpoint.name~value~*~entity~NOT*_APPLICABLE)~',
          'callList.showGraph': true,
          'callList.focusedMetric': 'latency_MEAN',
          'groups.metrics':
            '!(metric~latency~aggregation~MEAN)(metric~errors~aggregation~MEAN)(metric~latency~aggregation~P98)~',
          'groups.orderBy': 'count',
          'groups.orderDirection': 'DESC',
          'callList.tagFilter': '!(name~call.type~value~BATCH~operator~EQUALS~entity~NOT*_APPLICABLE)~'
        },
        '/trace': {
          traceId: '0000000000000000ae5511eda9237a73',
          colorCode: 'byServiceAndEndpoint'
        },
        '/tree': {}
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'traces',
          chartedMetrics: '!(metricId~latency~aggregationId~MEAN)~',
          fields:
            '!(type~metric~metricId~latency~aggregationId~MEAN)(type~metric~metricId~errors~aggregationId~MEAN)(type~metric~metricId~latency~aggregationId~P98)~',
          groupBy: '(groupbyTag~trace.endpoint.name)~',
          tagFilterExpression: '!(type~TAG*_FILTER~name~call.type~value~BATCH~operator~EQUALS)~',
          orderByGroups: '(by~traces*_SUM~direction~DESC)~',
          detailId: '(traceId~*0000000000000000ae5511eda9237a73~colorCode~byServiceAndEndpoint)~'
        }
      }
    }
  },
  {
    name: 'call detail',
    one: {
      pathname: '/analyze/trace/tree',
      query: {},
      matrix: {
        '/analyze': {
          'callList.dataSource': 'calls'
        },
        '/trace': {
          traceId: '0000000000000000ae5511eda9237a73',
          callId: 'ae5511eda9237a73'
        },
        '/tree': {}
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          detailId: '(traceId~*0000000000000000ae5511eda9237a73~callId~ae5511eda9237a73)~',
          chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~'
        }
      }
    }
  }
];

const tagCatalog = {
  tagTree: [],
  tags: [
    {
      name: 'call.erroneous',
      label: 'Erroneous',
      type: 'BOOLEAN',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'service.name',
      label: 'Name',
      type: 'STRING',
      description: null,
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'endpoint.name',
      label: 'Name',
      type: 'STRING',
      description: null,
      canApplyToSource: true,
      canApplyToDestination: true
    },
    {
      name: 'call.http.status',
      label: 'Status',
      type: 'NUMBER',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'call.type',
      label: 'Type',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false
    }
  ]
};

const dataSourceConfig = {
  fixedFields: [{ type: metricType, metricId: 'calls', aggregationId: 'SUM' }],
  defaultChartedMetrics: [{ metricId: 'latency', aggregationId: 'DISTRIBUTION' }]
};

describe('in-applications/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper', () => {
  describe('transformOneZeroToTwoZero', () => {
    cases.forEach(({ name, one, two }) => {
      it(`must convert ${name}`, () => {
        const transformed = cloneLocation(one);
        transformOneZeroToTwoZero(transformed, tagCatalog, dataSourceConfig);
        expect(transformed).to.deep.equal(two);
      });
    });
  });

  describe('isAnalyticsOneLocation', () => {
    describe('UA 1.0 locations', () => {
      cases.forEach(({ name, one }) => {
        it(`must identify ${name}`, () => {
          expect(isAnalyticsOneLocation(one)).to.equal(true);
        });
      });
    });

    describe('UA 2.0 locations', () => {
      cases.forEach(({ name, two }) => {
        it(`must identify ${name}`, () => {
          expect(isAnalyticsOneLocation(two)).to.equal(false);
        });
      });
    });
  });

  describe('#httpStatusCodeTagFiltersToExpression()', () => {
    it('not 1xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH }])
      ).to.deep.equal([{ type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN }]);
    });

    it('not 2xx, 4xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 2, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 4, operator: NOT_STARTS_WITH }
        ])
      ).to.deep.equal([
        EXP_OPEN_BRACKET,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 199, operator: LESS_OR_EQUAL_THAN },
        EXP_OR_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 300, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 399, operator: LESS_OR_EQUAL_THAN },
        EXP_CLOSE_BRACKET,
        EXP_OR_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 500, operator: GREATER_OR_EQUAL_THAN }
      ]);
    });

    it('not 1xx, 2xx, 3xx, 4xx, 5xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 2, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 3, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 4, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 5, operator: NOT_STARTS_WITH }
        ])
      ).to.deep.equal([]);
    });

    it('not 1xx, 5xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 5, operator: NOT_STARTS_WITH }
        ])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 499, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('not 1xx, 3xx, 4xx, 5xx and not empty', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 3, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 4, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 5, operator: NOT_STARTS_WITH },
          { name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY }
        ])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY, key: undefined, value: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 299, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('EQUALS, NOT_EQUAL, LESS_THAN, GREATER_THAN, GREATER_OR_EQUAL_THAN, LESS_OR_EQUAL_THAN', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 100, operator: EQUALS },
          { name: TAG_CALL_HTTP_STATUS, value: 200, operator: NOT_EQUAL },
          { name: TAG_CALL_HTTP_STATUS, value: 300, operator: LESS_THAN },
          { name: TAG_CALL_HTTP_STATUS, value: 400, operator: GREATER_THAN },
          { name: TAG_CALL_HTTP_STATUS, value: 500, operator: GREATER_OR_EQUAL_THAN },
          { name: TAG_CALL_HTTP_STATUS, value: 599, operator: LESS_OR_EQUAL_THAN }
        ])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 100, operator: EQUALS, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: NOT_EQUAL, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 300, operator: LESS_THAN, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 400, operator: GREATER_THAN, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 500, operator: GREATER_OR_EQUAL_THAN, key: undefined },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 599, operator: LESS_OR_EQUAL_THAN, key: undefined }
      ]);
    });

    it('2xx', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, value: 2, operator: STARTS_WITH }])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 200, operator: GREATER_OR_EQUAL_THAN },
        EXP_AND_CONJUNCTION,
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, value: 299, operator: LESS_OR_EQUAL_THAN }
      ]);
    });

    it('equal foobar', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, value: 'foobar', operator: EQUALS }])
      ).to.deep.equal([]);
    });

    it('not empty', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY }])
      ).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, operator: NOT_EMPTY, key: undefined, value: undefined }
      ]);
    });

    it('is empty', () => {
      expect(httpStatusCodeTagFiltersToExpression([{ name: TAG_CALL_HTTP_STATUS, operator: IS_EMPTY }])).to.deep.equal([
        { type: TAG_FILTER, name: TAG_CALL_HTTP_STATUS, operator: IS_EMPTY, key: undefined, value: undefined }
      ]);
    });

    it('unsupported', () => {
      expect(
        httpStatusCodeTagFiltersToExpression([
          { name: TAG_CALL_HTTP_STATUS, value: 1, operator: ENDS_WITH },
          { name: TAG_CALL_HTTP_STATUS, value: 2, operator: CONTAINS }
        ])
      ).to.deep.equal([]);
    });
  });
});
