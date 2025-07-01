/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

//@ts-expect-error not ts file - temporary
import { formatForTable, sendAPIQuery, fetchAPIData } from 'in-events/components/AIChat/chatAPI';
//@ts-expect-error not ts file - temporary
import { formatForBarChart, formatForEventsTable } from 'in-events/components/AIChat/chatAPI';

const DATA = {
  emptyItems: {
    items: []
  },
  noName: {
    items: [
      {
        snapshotId: 'VaxDbMS49-pE67cnSvYXy0QxPaA',
        label: 'instana-agent/controller-manager-5cd6df6d96-75bwg',
        plugin: 'kubernetesPod',
        time: 1742765760000,
        metrics: {
          'cpuRequests.MEAN': [[1743057172000, 0.199999880616829]]
        },
        tags: {
          notAName: 'instana-agent/controller-manager-5cd6df6d96-75bwg'
        },
        entityHealthInfo: {
          maxSeverity: 0.0,
          openIssues: []
        }
      }
    ]
  },
  noTimestamp: {
    // show me latency and number of calls for service shipping
    items: [
      {
        name: '/calc/{id}',
        timestamp: 1743028884856,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 1
        },
        count: 987,
        metrics: {
          'calls.sum': [[null, 123]],
          'latency.mean': [[null, 456]]
        }
      }
    ]
  },
  parse: {
    items: [
      {
        snapshotId: 'VaxDbMS49-pE67cnSvYXy0QxPaA',
        label: 'instana-agent/controller-manager-5cd6df6d96-75bwg',
        plugin: 'kubernetesPod',
        time: 1742765760000,
        metrics: {
          'cpuRequests.MEAN': [[1743057172000, 0.199999880616829]]
        },
        tags: {
          'label.kubernetesPod': 'instana-agent/controller-manager-5cd6df6d96-75bwg',
          'id.kubernetesPod': 'VaxDbMS49-pE67cnSvYXy0QxPaA'
        },
        entityHealthInfo: {
          maxSeverity: 0.0,
          openIssues: []
        }
      }
    ]
  },
  showCount: {
    items: [
      {
        tags: {
          'kubernetes.deployment.name': 'aap-gateway-operator-controller-manager'
        },
        count: 987,
        metrics: {}
      }
    ]
  },
  multipleWithCount: {
    // show me latency and number of calls for service shipping
    items: [
      {
        name: '/calc/{id}',
        timestamp: 1743028884856,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 1
        },
        count: 987,
        metrics: {
          'calls.sum': [[1743030480000, 123]],
          'latency.mean': [[1743030480000, 456]]
        }
      },
      {
        name: '/cities/{code}',
        timestamp: 1743028874282,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 2
        },
        count: 987,
        metrics: {
          'calls.sum': [[1743030480000, 32]],
          'latency.mean': [[1743030480000, 1936.78125]]
        }
      }
    ]
  },
  multiple: {
    // show me latency and number of calls for service shipping
    items: [
      {
        name: '/calc/{id}',
        timestamp: 1743028884856,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 1
        },
        metrics: {
          'calls.sum': [[1743030480000, 123]],
          'latency.mean': [[1743030480000, 456]]
        }
      },
      {
        name: '/cities/{code}',
        timestamp: 1743028874282,
        cursor: {
          '@class': '.IngestionOffsetCursor',
          ingestionTime: 1743030525000,
          offset: 2
        },
        metrics: {
          'calls.sum': [[1743030480000, 32]],
          'latency.mean': [[1743030480000, 1936.78125]]
        }
      }
    ]
  },
  labelKube: {
    // Show me the average of desired replicas for all deployments
    items: [
      {
        snapshotId: 'JUrkna6ww4BNpK28Rb94NgOhUqA',
        label: 'aap/aap-gateway-operator-controller-manager',
        plugin: 'kubernetesDeployment',
        time: 9223372036854775000,
        metrics: {
          'desiredReplicas.MEAN': [[1743027654000, 123123]]
        },
        tags: {
          'id.kubernetesDeployment': 'JUrkna6ww4BNpK28Rb94NgOhUqA',
          'label.kubernetesDeployment': 'aap/aap-gateway-operator-controller-manager'
        },
        entityHealthInfo: {
          maxSeverity: 0,
          openIssues: []
        }
      },
      {
        snapshotId: 'NKDezX1GlJ1dH_G6nrxLJ7CiHZs',
        label: 'aap/ansible-lightspeed-operator-controller-manager',
        plugin: 'kubernetesDeployment',
        time: 9223372036854775000,
        metrics: {
          'desiredReplicas.MEAN': [[1743027654000, 1]]
        },
        tags: {
          'id.kubernetesDeployment': 'NKDezX1GlJ1dH_G6nrxLJ7CiHZs',
          'label.kubernetesDeployment': 'aap/ansible-lightspeed-operator-controller-manager'
        },
        entityHealthInfo: {
          maxSeverity: 0,
          openIssues: []
        }
      }
    ]
  }
};

const mockHttpFunc = jest.fn();
jest.mock('in-services/http', () => ({
  __esModule: true,
  get default() {
    return mockHttpFunc;
  }
}));

const sampleReturn = [{ body: {} }];

describe('fetchAPIData', () => {
  it('should remove api_endpoint from payload', () => {
    mockHttpFunc.mockReturnValue(sampleReturn);
    const value = fetchAPIData({ api_endpoint: 654, windowStart: 987 });
    expect(value).not.toBeNull();
    expect(mockHttpFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { windowStart: 987 }
      })
    );
    expect(mockHttpFunc).not.toHaveBeenCalledWith(
      expect.objectContaining({
        data: { api_endpoint: 654 }
      })
    );
  });
});

describe('sendAPIQuery', () => {
  it('should correctly structure the request', () => {
    mockHttpFunc.mockReturnValue(sampleReturn);
    const value = sendAPIQuery({ windowStart: 123 });
    expect(value).not.toBeNull();
    expect(mockHttpFunc).toHaveBeenCalledWith(
      expect.objectContaining({
        data: { query: { windowStart: 123 } }
      })
    );
  });
});

describe('formatForTable', () => {
  const nlg = '';
  it('works with empty items array', () => {
    const fmt = formatForTable(nlg, DATA.emptyItems);
    const userDefined = fmt.output.generic[1].user_defined;
    expect(userDefined.rows.length).toBe(0);
  });
  it('returns empty result if no primary column is found', () => {
    const fmt = formatForTable(nlg, DATA.noName);
    const userDefined = fmt.output.generic[1].user_defined;
    expect(userDefined.rows.length).toBe(0);
  });
  it('does not error if timestamp is undefined', () => {
    const fmt = formatForTable(nlg, DATA.noTimestamp);
    const userDefined = fmt.output.generic[1].user_defined;
    const firstRow = userDefined.rows[0];
    expect(firstRow.timestamp).toBeUndefined();
  });
  it('parses single metric response', () => {
    const fmt = formatForTable(nlg, DATA.labelKube);
    const userDefined = fmt.output.generic[1].user_defined;
    const firstColumn = userDefined.headers[0].key;
    const firstLabel = 'aap/aap-gateway-operator-controller-manager';
    const metricKey = 'desiredReplicas.MEAN';
    expect(userDefined.rows[0][firstColumn]).toBe(firstLabel);
    expect(userDefined.rows[0][metricKey]).toBe(123123);
    expect(userDefined.rows[0].timestamp).toBe('Mar 26, 2025 11:20:54 PM');
  });
  it('parses two metric response with count', () => {
    const fmt = formatForTable(nlg, DATA.multipleWithCount);
    const userDefined = fmt.output.generic[1].user_defined;
    const callsKey = 'calls.sum';
    const meanKey = 'latency.mean';
    expect(userDefined.headers[0].header).toBe('Name');
    expect(userDefined.headers[1].header).toBe('# Calls');
    expect(userDefined.headers[2].header).toBe('Mean latency');
    expect(userDefined.headers[3].header).toBe('Count');
    expect(userDefined.headers[4].header).toBe('Timestamp');
    expect(userDefined.rows[0][callsKey]).toBe(123);
    expect(userDefined.rows[0][meanKey]).toBe(456);
    expect(userDefined.rows[0].count).toBe(987);
    expect(userDefined.rows[0].timestamp).toBe('Mar 27, 2025 12:08:00 AM');
  });
  it('parses two metric response', () => {
    const fmt = formatForTable(nlg, DATA.multiple);
    const userDefined = fmt.output.generic[1].user_defined;
    const firstLabel = '/calc/{id}';
    const callsKey = 'calls.sum';
    const meanKey = 'latency.mean';
    expect(userDefined.headers[0].header).toBe('Name');
    expect(userDefined.headers[1].header).toBe('# Calls');
    expect(userDefined.headers[2].header).toBe('Mean latency');
    expect(userDefined.headers[3].header).toBe('Timestamp');
    expect(userDefined.rows[0].name).toBe(firstLabel);
    expect(userDefined.rows[0][callsKey]).toBe(123);
    expect(userDefined.rows[0][meanKey]).toBe(456);
    expect(userDefined.rows[0].timestamp).toBe('Mar 27, 2025 12:08:00 AM');
  });
  it('shows count as a column', () => {
    const fmt = formatForTable(nlg, DATA.showCount);
    const userDefined = fmt.output.generic[1].user_defined;
    const firstLabel = 'aap-gateway-operator-controller-manager';
    const tagKey = 'kubernetes.deployment.name';
    expect(userDefined.rows[0][tagKey]).toBe(firstLabel);
    expect(userDefined.rows[0].count).toBe(987);
  });
  it('parses correctly', () => {
    const fmt = formatForTable(nlg, DATA.parse);
    const userDefined = fmt.output.generic[1].user_defined;
    const firstColumn = userDefined.headers[0].key;
    const firstLabel = 'instana-agent/controller-manager-5cd6df6d96-75bwg';
    const cpuKey = 'cpuRequests.MEAN';
    expect(userDefined.rows[0][firstColumn]).toBe(firstLabel);
    expect(userDefined.rows[0][cpuKey]).toBe(0.199999880616829);
  });
});

const tableDataSingleMetric = {
  //Show the mean latency from service nginx-web to service discount, grouped by the HTTP method
  items: [
    {
      name: 'POST',
      timestamp: 1747684804160,
      cursor: {
        '@class': '.IngestionOffsetCursor',
        ingestionTime: 1747686571000,
        offset: 1
      },
      metrics: {
        'latency.mean': [[1747686540000, 36.173857868020306]]
      }
    }
  ],
  canLoadMore: false,
  totalHits: 1,
  totalRepresentedItemCount: 1,
  totalRetainedItemCount: 1,
  adjustedTimeframe: {
    windowSize: 1740000,
    to: 1747686540000
  }
};

const tableDataDoubleMetric = {
  //Show the mean latency and number of calls from service nginx-web to service discount, grouped by the HTTP method
  items: [
    {
      name: 'POST',
      timestamp: 1747684921917,
      cursor: {
        '@class': '.IngestionOffsetCursor',
        ingestionTime: 1747686687000,
        offset: 1
      },
      metrics: {
        'calls.sum': [[1747686660000, 774.0]],
        'latency.mean': [[1747686660000, 36.29586563307493]]
      }
    }
  ],
  canLoadMore: false,
  totalHits: 1,
  totalRepresentedItemCount: 1,
  totalRetainedItemCount: 1,
  adjustedTimeframe: {
    windowSize: 1740000,
    to: 1747686660000
  }
};

describe('formatForBarChart', () => {
  const nlg = '';
  const chartOptions = {
    title: '',
    axes: {
      left: {
        mapsTo: 'value'
      },
      bottom: {
        mapsTo: 'group',
        scaleType: 'labels'
      }
    },
    height: '400px'
  };
  test('returns empty chart data when input tableData is empty', () => {
    const result = formatForBarChart();
    expect(result).toEqual({
      data: [],
      options: chartOptions
    });
  });
  test('returns correct chart data for one metric column', () => {
    const tableResponse = formatForTable(nlg, tableDataSingleMetric).output.generic[1].user_defined;
    const result = formatForBarChart({ headers: tableResponse.headers, rows: tableResponse.rows });
    expect(result?.data?.[0].group).toBe('POST');
    expect(result?.data[0].value).toBe(36.173857868020306);
    expect(result?.options).toEqual(chartOptions);
  });
  test('returns first metric in chart data for multiple metrics columns', () => {
    const tableResponse = formatForTable(nlg, tableDataDoubleMetric).output.generic[1].user_defined;
    const result = formatForBarChart({ headers: tableResponse.headers, rows: tableResponse.rows });
    expect(result?.data?.[0].group).toBe('POST');
    expect(result?.data[0].value).toBe(774);
    expect(result?.options).toEqual(chartOptions);
  });
});

// Test data for formatForEventsTable
const EVENTS_DATA = {
  emptyEvents: {
    data: {
      events: []
    }
  },
  nullEvents: {
    data: {
      events: null
    }
  },
  arrayOfEvents: {
    data: {
      count: 2,
      events: [
        {
          severity: 5,
          eventId: 'I8RsDKG7RX67C_vu_ULD8Q',
          fixSuggestion: 'Event with 2 conditions',
          snapshotId: 'ldzVavfk_wMmovt6SA8FnMf1N5o',
          entityType: 'INFRASTRUCTURE',
          start: 1749763241000,
          type: 'issue',
          problem: 'Event with 2 conditions',
          eventSpecificationId: 'tVrCdlcoG62w-2Aq',
          entityName: 'JVM',
          end: 1749763576000,
          state: 'open',
          detail: 'Event with 2 conditions'
        },
        {
          severity: 10,
          eventId: 'XZ1HcdrFTUOf61okTRr6xA',
          fixSuggestion: 'Calls are slower or equal to 1 ms based on latency (90th).',
          snapshotId: 'XV3A_Gi4dvSf3Zf3FcNJSK9DR6w',
          entityType: 'ENDPOINT',
          start: 1749757382004,
          type: 'issue',
          problem: 'Forced "Archive Invoice" activity alert',
          eventSpecificationId: '_DDlqshtQgeCsssRZY2n3g',
          entityName: 'Endpoint',
          entityLabel: 'Archive Invoice',
          end: 1749757472004,
          state: 'closed',
          detail: 'Calls are slower or equal to 1 ms based on latency (90th).'
        }
      ]
    }
  },
  groupedEvents: {
    data: {
      count: 55,
      events: [
        {
          errors: [
            {
              eventId: 'SeCVrkXWSvezckInfEmnhg',
              start: 1749757862004,
              end: 1749758192004,
              type: 'issue',
              state: 'closed',
              problem: 'Test errors per service',
              detail: 'Test errors per service',
              severity: 10,
              entityName: 'Service',
              entityLabel: 'dev181183.service-now.com',
              entityType: 'SERVICE',
              fixSuggestion: 'Test errors per service'
            },
            {
              eventId: 's3o4Dt_NSwyBEfMs_GISfw',
              start: 1749757862004,
              end: 1749759092004,
              type: 'issue',
              state: 'open',
              problem: 'Test errors per service',
              detail: 'Test errors per service',
              severity: 10,
              entityName: 'Service',
              entityLabel: 'dev.api.ibm.com',
              entityType: 'SERVICE',
              fixSuggestion: 'Test errors per service'
            }
          ],
          latency: [
            {
              eventId: '9BG5J4FKSoO4DdTw2HfsaQ',
              start: 1749742262003,
              end: 1749757487677,
              type: 'issue',
              state: 'closed',
              problem: 'Calls are slower than usual',
              detail: 'Calls are slower or equal to 33 ms based on latency (90th).',
              severity: 10,
              entityName: 'Application',
              entityLabel: 'DO THIS',
              entityType: 'APPLICATION',
              fixSuggestion: 'Calls are slower or equal to 33 ms based on latency (90th).'
            }
          ]
        }
      ]
    }
  },
  emptyGroupedEvents: {
    data: {
      count: 0,
      events: [
        {
          errors: [],
          latency: []
        }
      ]
    }
  }
};

describe('formatForEventsTable', () => {
  const nlg = 'Test NLG response';

  it('returns empty result for null events', () => {
    const result = formatForEventsTable(nlg, EVENTS_DATA.nullEvents);
    expect(result.output.generic[0].user_defined.text).toBe(nlg);
    expect(result.output.generic[1].user_defined.headers).toEqual([]);
    expect(result.output.generic[1].user_defined.rows).toEqual([]);
  });

  it('returns empty result for empty events array', () => {
    const result = formatForEventsTable(nlg, EVENTS_DATA.emptyEvents);
    expect(result.output.generic[0].user_defined.text).toBe(nlg);
    expect(result.output.generic[1].user_defined.headers).toEqual([]);
    expect(result.output.generic[1].user_defined.rows).toEqual([]);
  });

  it('correctly formats array of events', () => {
    const result = formatForEventsTable(nlg, EVENTS_DATA.arrayOfEvents);
    const userDefined = result.output.generic[1].user_defined;

    // Check headers
    expect(userDefined.headers.length).toBe(5);
    expect(userDefined.headers[0].key).toBe('name');
    expect(userDefined.headers[1].key).toBe('on');
    expect(userDefined.headers[2].key).toBe('started');
    expect(userDefined.headers[3].key).toBe('end');
    expect(userDefined.headers[4].key).toBe('state');

    // Check rows
    expect(userDefined.rows.length).toBe(2);

    // Check first row
    expect(userDefined.rows[0].name).toBe('Event with 2 conditions');
    expect(userDefined.rows[0].on).toBe('');
    expect(userDefined.rows[0].state).toBe('open');

    // Check second row
    expect(userDefined.rows[1].name).toBe('Forced "Archive Invoice" activity alert');
    expect(userDefined.rows[1].on).toBe('Archive Invoice');
    expect(userDefined.rows[1].state).toBe('closed');
  });

  it('correctly formats grouped events', () => {
    const result = formatForEventsTable(nlg, EVENTS_DATA.groupedEvents);
    const userDefined = result.output.generic[1].user_defined;

    // Check headers - should include group column
    expect(userDefined.headers.length).toBe(6);
    expect(userDefined.headers[0].key).toBe('name');
    expect(userDefined.headers[1].key).toBe('on');
    expect(userDefined.headers[2].key).toBe('group');
    expect(userDefined.headers[3].key).toBe('started');
    expect(userDefined.headers[4].key).toBe('end');
    expect(userDefined.headers[5].key).toBe('state');

    // Check rows
    expect(userDefined.rows.length).toBe(3);

    // Check rows have group information
    expect(userDefined.rows[0].group).toBe('errors');
    expect(userDefined.rows[1].group).toBe('errors');
    expect(userDefined.rows[2].group).toBe('latency');

    // Check specific row data
    expect(userDefined.rows[0].name).toBe('Test errors per service');
    expect(userDefined.rows[0].on).toBe('dev181183.service-now.com');
    expect(userDefined.rows[0].state).toBe('closed');

    expect(userDefined.rows[2].name).toBe('Calls are slower than usual');
    expect(userDefined.rows[2].on).toBe('DO THIS');
    expect(userDefined.rows[2].state).toBe('closed');
  });

  it('returns empty result for empty grouped events', () => {
    const result = formatForEventsTable(nlg, EVENTS_DATA.emptyGroupedEvents);
    expect(result.output.generic[0].user_defined.text).toBe(nlg);
    expect(result.output.generic[1].user_defined.headers).toEqual([]);
    expect(result.output.generic[1].user_defined.rows).toEqual([]);
  });
});
