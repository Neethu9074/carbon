/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env jest */

import { expect } from 'chai';

import {
  isAnalyticsTwoBetaLocation,
  transformTwoGAToPostGA
} from 'in-applications/analyze/AnalyzeView2_0/components/AnalyzeTwoBetaViewParameterConversion/transformHelper';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

const cases = [
  {
    name: 'grouped views',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          charts: '!(metric~latency~aggregation~DISTRIBUTION)~',
          metrics:
            '!(metric~latency~aggregation~MEAN)(metric~errors~aggregation~MEAN)(metric~latency~aggregation~MIN)~',
          groupBy: '(groupbyTag~endpoint.name~entity~DESTINATION)~',
          orderByGroups: '(by~latency*_MIN*_Agg~direction~ASC)~'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~',
          fields:
            '!(metricId~latency~aggregationId~MEAN~type~metric)(metricId~errors~aggregationId~MEAN~type~metric)(metricId~latency~aggregationId~MIN~type~metric)~',
          groupBy: '(groupbyTag~endpoint.name~entity~DESTINATION)~',
          orderByGroups: '(by~latency*_MIN~direction~ASC)~'
        }
      }
    }
  },
  {
    name: 'grouped views - without charts and metrics',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          metrics: '!~',
          groupBy: '(groupbyTag~endpoint.name~entity~DESTINATION)~'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'calls',
          groupBy: '(groupbyTag~endpoint.name~entity~DESTINATION)~'
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
          dataSource: 'traces',
          charts: '!(metric~latency~aggregation~DISTRIBUTION)~',
          metrics:
            '!(metric~latency~aggregation~MEAN)(metric~errors~aggregation~MEAN)(metric~latency~aggregation~MIN)~',
          groupBy: '(groupbyTag~trace.endpoint.name)~',
          orderByGroups: '(by~latency*_MIN*_Agg~direction~ASC)~'
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
          chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~',
          fields:
            '!(metricId~latency~aggregationId~MEAN~type~metric)(metricId~errors~aggregationId~MEAN~type~metric)(metricId~latency~aggregationId~MIN~type~metric)~',
          groupBy: '(groupbyTag~trace.endpoint.name)~',
          orderByGroups: '(by~latency*_MIN~direction~ASC)~',
          detailId: '(traceId~*0000000000000000ae5511eda9237a73~colorCode~byServiceAndEndpoint)~'
        }
      }
    }
  },
  {
    name: 'traces with trace sum chart',
    one: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'traces',
          charts: '!(metric~traces~aggregation~SUM)~',
          metrics: '!~',
          groupBy: '(groupbyTag~trace.endpoint.name)~'
        }
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          dataSource: 'traces',
          groupBy: '(groupbyTag~trace.endpoint.name)~',
          chartedMetrics: '!(metricId~calls~aggregationId~SUM)~'
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
          dataSource: 'calls'
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
          detailId: '(traceId~*0000000000000000ae5511eda9237a73~callId~ae5511eda9237a73)~'
        }
      }
    }
  },
  {
    name: 'call detail without dataSource',
    one: {
      pathname: '/analyze/trace/tree',
      query: {},
      matrix: {
        '/analyze': {},
        '/trace': {
          traceId: '0000000000000000ae5511eda9237a73',
          callId: 'ROOT'
        },
        '/tree': {}
      }
    },
    two: {
      pathname: '/analyze',
      query: {},
      matrix: {
        '/analyze': {
          detailId: '(traceId~*0000000000000000ae5511eda9237a73~callId~ROOT)~'
        }
      }
    }
  }
];

describe('in-applications/analyze/AnalyzeView2_0/components/AnalyzeTwoBetaViewParameterConversion/transformHelper', () => {
  describe('transformOneZeroToTwoZero', () => {
    cases.forEach(({ name, one, two }) => {
      it(`must convert ${name}`, () => {
        const transformed = cloneLocation(one);
        transformTwoGAToPostGA(transformed);
        expect(transformed).to.deep.equal(two);
      });
    });
  });

  describe('isAnalyticsOneLocation', () => {
    describe('UA 2 beta locations', () => {
      cases.forEach(({ name, one }) => {
        it(`must identify ${name}`, () => {
          expect(isAnalyticsTwoBetaLocation(one)).to.equal(true);
        });
      });
    });

    describe('UA 2 locations', () => {
      cases.forEach(({ name, two }) => {
        it(`must identify ${name}`, () => {
          expect(isAnalyticsTwoBetaLocation(two)).to.equal(false);
        });
      });
    });
  });
});
