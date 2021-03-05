/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  isAnalyticsOneLocation,
  transformOneZeroToTwoZero
} from 'in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import { metric as metricType } from 'in-new-components/AnalyzeView/fieldTypes';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

const cases = [
  {
    name: 'grouped views',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageLoad',
          tagFilters: '!(name~beacon.website.name~stringValue~Product~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'timestamp',
          orderDirection: 'ASC'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'pageLoad',
          tagFilterExpression: '!(type~TAG*_FILTER~name~beacon.website.name~operator~EQUALS~value~Product)~',
          groupBy: '(groupbyTag~beacon.website.name)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~',
          orderByGroups: '(by~earliestTimestamp~direction~ASC)~'
        }
      }
    }
  },

  {
    name: 'grouped views ordered by metric',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageLoad',
          tagFilters: '!(name~beacon.website.name~stringValue~Product~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'firstPaintTime_P90_Agg',
          orderDirection: 'DESC'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'pageLoad',
          tagFilterExpression: '!(type~TAG*_FILTER~name~beacon.website.name~operator~EQUALS~value~Product)~',
          groupBy: '(groupbyTag~beacon.website.name)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~',
          orderByGroups: '(by~firstPaintTime*_P90~direction~DESC)~'
        }
      }
    }
  },

  {
    name: 'ungrouped views',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '()~',
          beaconType: 'pageLoad',
          tagFilters:
            '!(name~beacon.website.name~stringValue~Product~operator~EQUALS~entity~NOT*_APPLICABLE)(name~beacon.page.name~stringValue~*/home~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'timestamp',
          orderDirection: 'ASC'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'pageLoad',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~beacon.website.name~operator~EQUALS~value~Product)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~beacon.page.name~operator~EQUALS~value~*/home)~',
          orderBy: '(by~timestamp~direction~ASC)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~'
        }
      }
    }
  },

  {
    name: 'ungrouped views ordered by metric',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '()~',
          beaconType: 'pageLoad',
          tagFilters:
            '!(name~beacon.website.name~stringValue~Product~operator~EQUALS~entity~NOT*_APPLICABLE)(name~beacon.page.name~stringValue~*/home~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'firstPaintTime_P90_Agg',
          orderDirection: 'DESC'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'pageLoad',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~beacon.website.name~operator~EQUALS~value~Product)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~beacon.page.name~operator~EQUALS~value~*/home)~',
          orderBy: '(by~beacon.timing.firstPaint~direction~DESC)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~'
        }
      }
    }
  },

  {
    name: 'detail views',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons/pageLoad/summary',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {},
        '/pageLoad': {
          pageLoadId: 'e8b1b13d8d8466dd',
          beaconTimestamp: '1612361206157'
        },
        '/summary': {}
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          detailId: '(pageLoadId~e8b1b13d8d8466dd~beaconTimestamp~1612361206157)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~'
        }
      }
    }
  },

  {
    name: 'with metrics',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '()~',
          beaconType: 'pageLoad',
          metrics: '!(metric~beaconDuration~aggregation~MEAN)(metric~beaconDuration~aggregation~MIN)~'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'pageLoad',
          fields:
            '!(type~metric~metricId~beaconDuration~aggregationId~MEAN)(type~metric~metricId~beaconDuration~aggregationId~MIN)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~'
        }
      }
    }
  },
  {
    name: 'with charted metric and showGraph true',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageLoad',
          showGraph: 'true',
          focusedMetric: 'beaconDuration_MEAN'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~beacon.website.name)~',
          beaconType: 'pageLoad',
          chartedMetrics: '!(metricId~beaconDuration~aggregationId~MEAN)~'
        }
      }
    }
  },
  {
    name: 'with charted metric and showGraph false',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageLoad',
          showGraph: 'false',
          focusedMetric: 'beaconDuration_MEAN'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~beacon.website.name)~',
          beaconType: 'pageLoad',
          chartedMetrics: '!(metricId~beaconDuration~aggregationId~MEAN)~'
        }
      }
    }
  },
  {
    name: 'with charted metric and showGraph true without focusedMetric',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageLoad',
          showGraph: 'true'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~beacon.website.name)~',
          beaconType: 'pageLoad',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~'
        }
      }
    }
  },
  {
    name: 'charted metric with DISTINCT_COUNT aggregation',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageChange',
          showGraph: 'true',
          focusedMetric: 'uniqueUsersOrSessions_DISTINCT_COUNT'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~beacon.website.name)~',
          beaconType: 'pageChange',
          chartedMetrics: '!(metricId~uniqueUsersOrSessions~aggregationId~DISTINCT*_COUNT)~'
        }
      }
    }
  },
  {
    name: 'with order by count',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'pageLoad',
          orderBy: 'count',
          orderDirection: 'ASC'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~beacon.website.name)~',
          beaconType: 'pageLoad',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~',
          orderByGroups: '(by~beaconCount*_SUM~direction~ASC)~'
        }
      }
    }
  },
  {
    name: 'with selected fixed field "metric~beaconCount~aggregation~SUM"',
    one: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~beacon.website.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'httpRequest',
          metrics: '!(metric~beaconDuration~aggregation~MEAN)(metric~beaconCount~aggregation~SUM)~'
        }
      }
    },
    two: {
      pathname: '/websiteMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/websiteMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~beacon.website.name)~',
          beaconType: 'httpRequest',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM)~',
          fields: '!(type~metric~metricId~beaconDuration~aggregationId~MEAN)~'
        }
      }
    }
  }
];

const tagCatalog = {
  tagTree: [],
  tags: [
    {
      name: 'beacon.website.name',
      label: 'Name',
      type: 'STRING',
      description: 'Name of the website as configured within the Instana user interface.',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.window.height',
      label: 'Height',
      type: 'NUMBER',
      description: 'The browser window height in pixels (window.innerWidth).',
      canApplyToSource: false,
      canApplyToDestination: false
    },
    {
      name: 'beacon.window.hidden',
      label: 'Hidden',
      type: 'BOOLEAN',
      description:
        'Whether or not the browser window was hidden at the time an activity was initiated / a beacon was created (as defined via the W3C Page Visibility APIs).',
      canApplyToSource: false,
      canApplyToDestination: false
    }
  ]
};

const metricCatalog = [
  {
    metricId: 'firstPaintTime',
    tagName: 'beacon.timing.firstPaint'
  }
];

const dataSourceConfig = {
  fixedFields: [{ type: metricType, metricId: 'beaconCount', aggregationId: 'SUM' }]
};

describe('in-websites/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper', () => {
  describe('transformOneZeroToTwoZero', () => {
    cases.forEach(({ name, one, two }) => {
      it(`must convert ${name}`, () => {
        const transformed = cloneLocation(one);
        transformOneZeroToTwoZero(transformed, tagCatalog, metricCatalog, dataSourceConfig);
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
});
