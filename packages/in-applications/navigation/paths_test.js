/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { renderHook } from '@testing-library/react-hooks';
import { expect } from 'chai';
import sinon from 'sinon';

import { useLinkToAnalyze as useLinkToApplicationAnalyze } from 'in-applications/navigation/paths';
import { STRING_MAX_LENGTH } from 'in-components/QueryBuilder/tagFilter/constraints';
import { parseUrl } from 'in-stores/navigation/routing/parser';
import { t } from 'in-i18n';

const tagCatalog = {
  tags: [
    { name: 'call.inbound_of_application' },
    { name: 'application.name' },
    { name: 'service.name' },
    { name: 'endpoint.name' },
    { name: 'call.error.message' }
  ]
};

const cases = [
  {
    testName: 'empty params',
    params: {},
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls'
        }
      }
    }
  },

  {
    testName: 'dataSource',
    params: {
      dataSource: 'traces'
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'traces'
        }
      }
    }
  },

  {
    testName: 'orderBy',
    params: {
      orderBy: {
        by: 'latency',
        direction: 'DESC'
      }
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          orderBy: '(by~latency~direction~DESC)~'
        }
      }
    }
  },

  {
    testName: 'groupBy',
    params: {
      groupBy: {
        groupbyTag: 'endpoint.name',
        groupbyTagEntity: 'DESTINATION'
      }
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          groupBy: '(groupbyTag~endpoint.name~groupbyTagEntity~DESTINATION)~'
        }
      }
    }
  },

  {
    testName: 'empty orderBy, orderByGroups and groupBy',
    params: {
      groupBy: {},
      orderBy: {},
      orderByGroups: {}
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls'
        }
      }
    }
  },

  {
    testName: 'orderByGroups',
    params: {
      orderByGroups: {
        by: 'calls_SUM',
        direction: 'ASC'
      }
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          orderByGroups: '(by~calls*_SUM~direction~ASC)~'
        }
      }
    }
  },

  {
    testName: 'fields',
    params: {
      fields: [
        {
          metricId: 'latency',
          aggregationId: 'MEAN',
          type: 'metric'
        },
        {
          metricId: 'errors',
          aggregationId: 'MEAN',
          type: 'metric'
        }
      ]
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          fields: '!(metricId~latency~aggregationId~MEAN~type~metric)(metricId~errors~aggregationId~MEAN~type~metric)~'
        }
      }
    }
  },

  {
    testName: 'chartedMetrics',
    params: {
      chartedMetrics: [
        {
          metricId: 'latency',
          aggregationId: 'DISTRIBUTION'
        }
      ]
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          chartedMetrics: '!(metricId~latency~aggregationId~DISTRIBUTION)~'
        }
      }
    }
  },

  {
    testName: 'fastQueryModeEnabled',
    params: {
      fastQueryModeEnabled: true
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          fastQueryModeEnabled: 'true'
        }
      }
    }
  },

  {
    testName: 'hiddenCalls',
    params: {
      hiddenCalls: { includeInternal: true, includeSynthetic: true }
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          hiddenCalls: '(includeInternal~~includeSynthetic)~'
        }
      }
    }
  },

  {
    testName: 'simple filters',
    params: {
      applicationName: 'myApp',
      serviceName: 'myService',
      endpointName: 'myEndpoint'
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~call.inbound*_of*_application~value~myApp~operator~EQUALS)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~service.name~value~myService~operator~EQUALS~entity~DESTINATION)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~endpoint.name~value~myEndpoint~operator~EQUALS~entity~DESTINATION)~'
        }
      }
    }
  },

  {
    testName: 'application boundary scope',
    params: {
      applicationName: 'myApp',
      boundaryScope: 'ALL'
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~application.name~value~myApp~operator~EQUALS~entity~DESTINATION)~'
        }
      }
    }
  },

  {
    testName: 'jumpToSource - application',
    params: {
      applicationName: 'myApp',
      serviceName: 'myService',
      endpointName: 'myEndpoint',
      jumpToSource: 'application'
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression: '!(type~TAG*_FILTER~name~application.name~value~myApp~operator~EQUALS~entity~SOURCE)~'
        }
      }
    }
  },

  {
    testName: 'jumpToSource - service',
    params: {
      applicationName: 'myApp',
      serviceName: 'myService',
      endpointName: 'myEndpoint',
      jumpToSource: 'service'
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression: '!(type~TAG*_FILTER~name~service.name~value~myService~operator~EQUALS~entity~SOURCE)~'
        }
      }
    }
  },

  {
    testName: 'jumpToSource - endpoint',
    params: {
      applicationName: 'myApp',
      serviceName: 'myService',
      endpointName: 'myEndpoint',
      jumpToSource: 'endpoint'
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression: '!(type~TAG*_FILTER~name~endpoint.name~value~myEndpoint~operator~EQUALS~entity~SOURCE)~'
        }
      }
    }
  },

  {
    testName: 'sanitize formModel',
    params: {
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'call.error.message',
          operator: 'EQUALS',
          value: 'a'.repeat(STRING_MAX_LENGTH + 10)
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'OR'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'NOT_EQUAL',
          value: 'b'.repeat(STRING_MAX_LENGTH + 10),
          entity: 'DESTINATION'
        }
      ],
      tagCatalog
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~call.error.message~operator~STARTS*_WITH~value~aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa)(type~CONJUNCTION~logicalOperator~OR)(type~TAG*_FILTER~name~application.name~operator~NOT*_STARTS*_WITH~value~bbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbbb~entity~DESTINATION)~'
        }
      }
    }
  },

  {
    testName: 'formModel - ignore if it includes unsupported tags',
    params: {
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'foo.bar',
          operator: 'EQUALS',
          value: 'test'
        }
      ],
      tagCatalog
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls'
        }
      }
    }
  },

  {
    testName: 'formModel with a simple filter',
    params: {
      applicationName: 'foo',
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'call.error.message',
          operator: 'EQUALS',
          value: 'error'
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'OR'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'EQUALS',
          value: 'bar',
          entity: 'DESTINATION'
        }
      ],
      tagCatalog
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~call.inbound*_of*_application~value~foo~operator~EQUALS)(type~CONJUNCTION~logicalOperator~AND)(type~OPEN*_BRACKET)(type~TAG*_FILTER~name~call.error.message~operator~EQUALS~value~error)(type~CONJUNCTION~logicalOperator~OR)(type~TAG*_FILTER~name~application.name~operator~EQUALS~value~bar~entity~DESTINATION)(type~CLOSE*_BRACKET)~'
        }
      }
    }
  },

  {
    testName: 'time config',
    params: {
      applicationName: 'myApp',
      timeConfig: {
        windowSize: 3600000,
        to: 1616491871000
      }
    },
    expected: {
      pathname: '/#/analyze',
      query: {
        'timeline.to': '1616491871000',
        'timeline.ws': '3600000'
      },
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'calls',
          tagFilterExpression: '!(type~TAG*_FILTER~name~call.inbound*_of*_application~value~myApp~operator~EQUALS)~'
        }
      }
    }
  }
];

const filtersWithNotifications = [
  {
    testName: 'reset invalid OR filter',
    params: {
      dataSource: 'traces',
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'call.error.message',
          operator: 'EQUALS',
          value: 'a'
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'OR'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'NOT_EQUAL',
          value: 'b',
          entity: 'DESTINATION'
        }
      ],
      setOnClickNotificationMessage: () => {},
      tagCatalog
    },
    expectedNotificationMessage: t('in-applications:analyze.resetUnsupportedTracesFilterContainingOrConjunction'),
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'traces'
        }
      }
    }
  },
  {
    testName: 'resetting OR filters takes precedence over brackets',
    params: {
      dataSource: 'traces',
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'call.error.message',
          operator: 'EQUALS',
          value: 'a'
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'AND'
        },
        {
          type: 'OPEN_BRACKET'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'NOT_EQUAL',
          value: 'b',
          entity: 'DESTINATION'
        },
        {
          type: 'CLOSE_BRACKET'
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'OR'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'NOT_EQUAL',
          value: 'b',
          entity: 'DESTINATION'
        }
      ],
      setOnClickNotificationMessage: () => {},
      tagCatalog
    },
    expectedNotificationMessage: t('in-applications:analyze.resetUnsupportedTracesFilterContainingOrConjunction'),
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'traces'
        }
      }
    }
  }
];

const traceFilters = [
  {
    testName: 'preserve valid filter',
    params: {
      dataSource: 'traces',
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'call.error.message',
          operator: 'EQUALS',
          value: 'a'
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'AND'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'NOT_EQUAL',
          value: 'b',
          entity: 'DESTINATION'
        }
      ],
      tagCatalog
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'traces',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~call.error.message~operator~EQUALS~value~a)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~application.name~operator~NOT*_EQUAL~value~b~entity~DESTINATION)~'
        }
      }
    }
  },
  {
    testName: 'remove brackets from filter',
    params: {
      dataSource: 'traces',
      formModel: [
        {
          type: 'TAG_FILTER',
          name: 'call.error.message',
          operator: 'EQUALS',
          value: 'a'
        },
        {
          type: 'CONJUNCTION',
          logicalOperator: 'AND'
        },
        {
          type: 'OPEN_BRACKET'
        },
        {
          type: 'TAG_FILTER',
          name: 'application.name',
          operator: 'NOT_EQUAL',
          value: 'b',
          entity: 'DESTINATION'
        },
        {
          type: 'CLOSE_BRACKET'
        }
      ],
      tagCatalog
    },
    expected: {
      pathname: '/#/analyze',
      query: {},
      matrix: {
        '/#': {},
        '/analyze': {
          dataSource: 'traces',
          tagFilterExpression:
            '!(type~TAG*_FILTER~name~call.error.message~operator~EQUALS~value~a)(type~CONJUNCTION~logicalOperator~AND)(type~TAG*_FILTER~name~application.name~operator~NOT*_EQUAL~value~b~entity~DESTINATION)~'
        }
      }
    }
  },
  ...filtersWithNotifications
];

describe('in-applications/navigation/paths', () => {
  describe('useLinkToApplicationAnalyze', () => {
    cases.forEach(({ testName, params, expected }) => {
      it(testName, () => {
        const { result } = renderHook(() => useLinkToApplicationAnalyze());
        const getLinkToApplicationAnalyze = result.current;

        expect(parseUrl(getLinkToApplicationAnalyze(params))).to.deep.equal(expected);
      });
    });
  });

  describe('resetTraceFilters', () => {
    traceFilters.forEach(({ testName, params, expected }) => {
      it(testName, () => {
        // GIVEN
        const { result } = renderHook(() => useLinkToApplicationAnalyze());
        const getLinkToApplicationAnalyze = result.current;

        // WHEN
        const url = parseUrl(getLinkToApplicationAnalyze(params));

        // THEN
        expect(url).to.deep.equal(expected);
      });
    });
  });

  describe('trigger notifications', () => {
    filtersWithNotifications.forEach(({ testName, params, expectedNotificationMessage }) => {
      it(`should trigger a notification for ${testName}`, () => {
        // GIVEN
        const { result } = renderHook(() => useLinkToApplicationAnalyze());
        const getLinkToApplicationAnalyze = result.current;

        const notificationSpy = sinon.spy();
        const spyParameters = {
          ...params,
          setOnClickNotificationMessage: notificationSpy
        };

        // WHEN
        getLinkToApplicationAnalyze(spyParameters);
        const notificationMessage = notificationSpy.getCall(0).args[0];

        // THEN
        expect(notificationSpy.calledOnce).to.equal(true);
        expect(notificationMessage).to.equal(expectedNotificationMessage);
      });
    });

    it('should handle the optional notification callback gracefully', () => {
      // GIVEN
      const { result } = renderHook(() => useLinkToApplicationAnalyze());
      const getLinkToApplicationAnalyze = result.current;

      const undefinedCallback = {
        ...filtersWithNotifications[0].params,
        setOnClickNotificationMessage: undefined
      };

      // WHEN
      const linkToApplicationAnalyze = getLinkToApplicationAnalyze(undefinedCallback);

      // THEN
      expect(linkToApplicationAnalyze).to.equal('/#/analyze;dataSource=traces');
    });
  });
});
