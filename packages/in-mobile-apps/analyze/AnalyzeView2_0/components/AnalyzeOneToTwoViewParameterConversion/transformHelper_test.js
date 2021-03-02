/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

/* eslint-env mocha */

import { expect } from 'chai';

import {
  isAnalyticsOneLocation,
  transformOneZeroToTwoZero
} from 'in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper';
import { cloneLocation } from 'in-stores/navigation/routing/clone';

const cases = [
  {
    name: 'grouped views',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          tagFilters: '!(name~mobileBeacon.mobileApp.name~stringValue~Demo~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'timestamp',
          orderDirection: 'ASC'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'sessionStart',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~mobileBeacon.mobileApp.name~operator~EQUALS~entity~NOT*_APPLICABLE~value~Demo)~',
          groupBy: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~',
          orderByGroups: '(by~earliestTimestamp~direction~ASC)~'
        }
      }
    }
  },

  {
    name: 'grouped views ordered by metric',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          tagFilters: '!(name~mobileBeacon.mobileApp.name~stringValue~Demo~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'uniqueUsers_DISTINCT_COUNT_Agg',
          orderDirection: 'DESC'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'sessionStart',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~mobileBeacon.mobileApp.name~operator~EQUALS~entity~NOT*_APPLICABLE~value~Demo)~',
          groupBy: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~',
          orderByGroups: '(by~uniqueUsers*_DISTINCT*_COUNT~direction~DESC)~'
        }
      }
    }
  },

  {
    name: 'ungrouped views',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '()~',
          beaconType: 'sessionStart',
          tagFilters:
            '!(name~mobileBeacon.mobileApp.name~stringValue~Demo~operator~EQUALS~entity~NOT*_APPLICABLE)(name~mobileBeacon.view.name~stringValue~Home~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'timestamp',
          orderDirection: 'ASC'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'sessionStart',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~mobileBeacon.mobileApp.name~operator~EQUALS~entity~NOT*_APPLICABLE~value~Demo)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~mobileBeacon.view.name~operator~EQUALS~entity~NOT*_APPLICABLE~value~Home)~',
          groupBy: '()~',
          orderBy: '(by~timestamp~direction~ASC)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~'
        }
      }
    }
  },

  {
    name: 'ungrouped views ordered by metric',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '()~',
          beaconType: 'httpRequest',
          tagFilters:
            '!(name~mobileBeacon.mobileApp.name~stringValue~Demo~operator~EQUALS~entity~NOT*_APPLICABLE)(name~mobileBeacon.view.name~stringValue~Home~operator~EQUALS~entity~NOT*_APPLICABLE)~',
          orderBy: 'beaconErrorRate_MEAN_Agg',
          orderDirection: 'DESC'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          beaconType: 'httpRequest',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~mobileBeacon.mobileApp.name~operator~EQUALS~entity~NOT*_APPLICABLE~value~Demo)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~mobileBeacon.view.name~operator~EQUALS~entity~NOT*_APPLICABLE~value~Home)~',
          groupBy: '()~',
          orderBy: '(by~mobileBeacon.error.count~direction~DESC)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~'
        }
      }
    }
  },

  {
    name: 'detail views',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons/session/summary',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {},
        '/session': {
          sessionId: 'a389983d-f753-4896-aaeb-6389fa93ef24',
          beaconTimestamp: '1612361206157'
        },
        '/summary': {}
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          detailId: '(sessionId~a389983d-f753-4896-aaeb-6389fa93ef24~beaconTimestamp~1612361206157)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~'
        }
      }
    }
  },

  {
    name: 'with metrics',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '()~',
          beaconType: 'sessionStart',
          metrics: '!(metric~beaconDuration~aggregation~MEAN)(metric~beaconDuration~aggregation~MIN)~'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '()~',
          beaconType: 'sessionStart',
          fields:
            '!(type~metric~metricId~beaconDuration~aggregationId~MEAN)(type~metric~metricId~beaconDuration~aggregationId~MIN)~',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~'
        }
      }
    }
  },
  {
    name: 'with charted metric and showGraph true',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          showGraph: 'true',
          focusedMetric: 'beaconDuration_MEAN'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          chartedMetrics: '!(metricId~beaconDuration~aggregationId~MEAN~rendererId~stackedBar)~'
        }
      }
    }
  },
  {
    name: 'with charted metric and showGraph false',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          showGraph: 'false',
          focusedMetric: 'beaconDuration_MEAN'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          chartedMetrics: '!(metricId~beaconDuration~aggregationId~MEAN~rendererId~stackedBar)~'
        }
      }
    }
  },
  {
    name: 'with charted metric and showGraph true without focusedMetric',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          showGraph: 'true'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          chartedMetrics: '!(metricId~beaconCount~aggregationId~SUM~rendererId~stackedBar)~'
        }
      }
    }
  },
  {
    name: 'charted metric with DISTINCT_COUNT aggregation',
    one: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          group: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          showGraph: 'true',
          focusedMetric: 'uniqueUsers_DISTINCT_COUNT'
        }
      }
    },
    two: {
      pathname: '/mobileAppMonitoring/analyzeBeacons',
      query: {},
      matrix: {
        '/mobileAppMonitoring': {},
        '/analyzeBeacons': {
          groupBy: '(groupbyTag~mobileBeacon.mobileApp.name~entity~NOT*_APPLICABLE)~',
          beaconType: 'sessionStart',
          chartedMetrics: '!(metricId~uniqueUsers~aggregationId~DISTINCT*_COUNT~rendererId~stackedBar)~'
        }
      }
    }
  }
];

const tagCatalog = {
  tagTree: [],
  tags: [
    {
      name: 'mobileBeacon.mobileApp.name',
      label: 'Name',
      type: 'STRING',
      description: 'Name of the mobile app as configured within the Instana user interface.',
      canApplyToSource: false,
      canApplyToDestination: false
    }
  ]
};

const metricCatalog = [
  {
    metricId: 'beaconErrorRate',
    tagName: 'mobileBeacon.error.count'
  }
];

describe('in-mobile-apps/analyze/AnalyzeView2_0/components/AnalyzeOneToTwoViewParameterConversion/transformHelper', () => {
  describe('transformOneZeroToTwoZero', () => {
    cases.forEach(({ name, one, two }) => {
      it(`must convert ${name}`, () => {
        const transformed = cloneLocation(one);
        transformOneZeroToTwoZero(transformed, tagCatalog, metricCatalog);
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
