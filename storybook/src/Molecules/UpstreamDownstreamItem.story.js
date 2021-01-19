/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { withKnobs, select } from '@storybook/addon-knobs';
import React from 'react';

import UpstreamDownstreamPresenter from 'in-new-components/UpstreamDownstream/UpstreamDownstreamPresenter';

export default {
  title: 'Molecules|UpstreamDownstream',
  component: UpstreamDownstreamPresenter,
  parameters: {
    // Error creating WebGL context. ... at new WebGLRenderer
    chromatic: { disable: true }
  },
  decorators: [withKnobs]
};

export const Default = () => {
  const tabs = select('TabIndex', [0, 1], 0);
  const prepProgress = {
    loading: false
  };
  return (
    <UpstreamDownstreamPresenter
      timeConfig={{ windowSize: 60000, to: 60000 }}
      result={upstream}
      resultApplication={applicationUpstream}
      items={tabs === 0 ? upstream.data.items : downstream.data.items}
      itemsApplication={tabs === 0 ? applicationUpstream.data.items : applicationDownstream.data.items}
      activeTabIndex={0}
      label="shop-frontend"
      progress={prepProgress}
    />
  );
};

export const Loading = () => {
  const tabs = select('TabIndex', [0, 1], 0);
  const prepProgress = {
    loading: true
  };
  return (
    <UpstreamDownstreamPresenter
      timeConfig={{ windowSize: 60000, to: 60000 }}
      items={tabs === 0 ? upstream.data.items : downstream.data.items}
      activeTabIndex={0}
      label="shop-frontend"
      progress={prepProgress}
      result={upstream}
    />
  );
};

const upstream = {
  data: {
    items: [
      {
        service: {
          id: '5131abcd21ea6e99111d71795fd9ad592bbc08a0',
          label: 'groundskeeper',
          types: ['HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer', 'nginx', 'postgreSqlDatabase', 'clickHouseDatabase'],
          entityType: 'SERVICE'
        },
        metrics: {
          endpoints: [[1579538823382, 1]],
          latencyAgg: [[1579538823382, 4.1331]],
          erroneousCalls: [
            [0, 200],
            [10000, 192],
            [20000, 197],
            [30000, 220],
            [40000, 197],
            [50000, 800],
            [60000, 198]
          ],
          errorsAgg: [[1579538823382, 0]],
          openIssues: [[1579538823382, 0]],
          maxSeverity: [[1579538823382, 6]],
          applications: [[1579538823382, 14]],
          callsAgg: [[1579538823382, 1968]]
        }
      },
      {
        service: {
          id: 'ccfb99a6c50dec396bc22fe7c39538f6ff597db9',
          label: 'instana-test-ui-backend',
          types: ['HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {
          endpoints: [[1579538823382, 4]],
          latencyAgg: [[1579538823382, 7.0853]],
          erroneousCalls: [
            [0, 200],
            [10000, 192],
            [20000, 197],
            [30000, 220],
            [40000, 197],
            [50000, 800],
            [60000, 198]
          ],
          errorsAgg: [[1579538823382, 0]],
          openIssues: [[1579538823382, 0]],
          maxSeverity: [[1579538823382, 0]],
          applications: [[1579538823382, 14]],
          callsAgg: [[1579538823382, 164]]
        }
      },
      {
        service: {
          id: 'f3a600d7ad22c85c078e0324eb577fbf7f2d0de7',
          label: 'hubforce',
          types: ['BATCH', 'HTTP', 'SDK'],
          technologies: ['dropwizardApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {
          endpoints: [[1579538823382, 1]],
          latencyAgg: [[1579538823382, 82.3333]],
          erroneousCalls: [
            [0, 200],
            [10000, 192],
            [20000, 197],
            [30000, 220],
            [40000, 197],
            [50000, 800],
            [60000, 198]
          ],
          errorsAgg: [[1579538823382, 0]],
          openIssues: [[1579538823382, 0]],
          maxSeverity: [[1579538823382, 0]],
          applications: [[1579538823382, 14]],
          callsAgg: [[1579538823382, 6]]
        }
      }
    ],
    page: 1,
    pageSize: 5,
    totalHits: 3
  },
  time: 1579538823382,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

const downstream = {
  data: {
    items: [
      {
        service: {
          id: '568618b53d8eca0bd4cbdf92ab869ca95bb87ba2',
          label: 'butlerdb',
          types: ['DATABASE'],
          technologies: ['postgreSqlDatabase'],
          entityType: 'SERVICE'
        },
        metrics: {
          endpoints: [[1579539053035, 7]],
          latencyAgg: [[1579539053035, 1.2351]],
          errorsAgg: [[1579539053035, 0]],
          openIssues: [[1579539053035, 0]],
          maxSeverity: [[1579539053035, 0]],
          callsAgg: [[1579539053035, 3913]],
          applications: [[1579539053035, 14]]
        }
      },
      {
        service: {
          id: 'f3a600d7ad22c85c078e0324eb577fbf7f2d0de7',
          label: 'hubforce',
          types: ['HTTP'],
          technologies: ['dropwizardApplicationContainer'],
          entityType: 'SERVICE'
        },
        metrics: {
          endpoints: [[1579539053035, 1]],
          latencyAgg: [[1579539053035, 3.8461]],
          errorsAgg: [[1579539053035, 0]],
          openIssues: [[1579539053035, 0]],
          maxSeverity: [[1579539053035, 0]],
          callsAgg: [[1579539053035, 13]],
          applications: [[1579539053035, 14]]
        }
      }
    ],
    page: 1,
    pageSize: 20,
    totalHits: 2
  },
  time: 1579539053035,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

const applicationUpstream = {
  data: {
    items: [
      {
        application: {
          id: 'U-LXHHgmRPmns8gNJChpXg',
          label: 'Robot Shop',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {
          latencyAgg: [[1591347496889, 8.5537]],
          calls: [
            [1591344000000, 21497],
            [1591344300000, 20662],
            [1591344600000, 24099],
            [1591344900000, 26056],
            [1591345200000, 26720],
            [1591345500000, 25382],
            [1591345800000, 9962],
            [1591346100000, 22294],
            [1591346400000, 25989],
            [1591346700000, 26661],
            [1591347000000, 24929]
          ],
          latency: [
            [1591344000000, 28.945],
            [1591344300000, 30.777],
            [1591344600000, 29.2138],
            [1591344900000, 30.8152],
            [1591345200000, 24.7766],
            [1591345500000, 25.4023],
            [1591345800000, 414.7244],
            [1591346100000, 22.9811],
            [1591346400000, 26.8657],
            [1591346700000, 26.7822],
            [1591347000000, 26.7783]
          ],
          errorsAgg: [[1591347496889, 0]],
          erroneousCalls: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 658],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          erroneousCallsAgg: [[1591347496889, 0]],
          errors: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 0.066],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          maxSeverity: [[1591347496889, 5]],
          callsAgg: [[1591347496889, 12508]]
        }
      },
      {
        application: {
          id: 'lBR64A07QICHH3oSLY1bZg',
          label: 'All Services',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {
          latencyAgg: [[1591347496889, 8.5537]],
          calls: [
            [1591344000000, 23991],
            [1591344300000, 23474],
            [1591344600000, 29064],
            [1591344900000, 30762],
            [1591345200000, 32681],
            [1591345500000, 32166],
            [1591345800000, 11049],
            [1591346100000, 26660],
            [1591346400000, 30074],
            [1591346700000, 31369],
            [1591347000000, 29756]
          ],
          latency: [
            [1591344000000, 26.5509],
            [1591344300000, 27.6869],
            [1591344600000, 25.3206],
            [1591344900000, 27.258],
            [1591345200000, 21.5959],
            [1591345500000, 21.5351],
            [1591345800000, 683.1755],
            [1591346100000, 23.5439],
            [1591346400000, 24.4249],
            [1591346700000, 26.9204],
            [1591347000000, 26.0568]
          ],
          errorsAgg: [[1591347496889, 0]],
          erroneousCalls: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 1184],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 2]
          ],
          erroneousCallsAgg: [[1591347496889, 0]],
          errors: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 0.1071],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          maxSeverity: [[1591347496889, 0]],
          callsAgg: [[1591347496889, 12508]]
        }
      },
      {
        application: {
          id: 'TI1ItQY6TXOmb8j9SPl7NQ',
          label: 'test yoann 3',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {
          latencyAgg: [[1591347496889, 8.5537]],
          calls: [
            [1591344000000, 23991],
            [1591344300000, 23474],
            [1591344600000, 29064],
            [1591344900000, 30762],
            [1591345200000, 32681],
            [1591345500000, 32166],
            [1591345800000, 11049],
            [1591346100000, 26660],
            [1591346400000, 30074],
            [1591346700000, 31369],
            [1591347000000, 29756]
          ],
          latency: [
            [1591344000000, 26.5509],
            [1591344300000, 27.6869],
            [1591344600000, 25.3206],
            [1591344900000, 27.258],
            [1591345200000, 21.5959],
            [1591345500000, 21.5351],
            [1591345800000, 683.1755],
            [1591346100000, 23.5439],
            [1591346400000, 24.4249],
            [1591346700000, 26.9204],
            [1591347000000, 26.0568]
          ],
          errorsAgg: [[1591347496889, 0]],
          erroneousCalls: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 1184],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 2]
          ],
          erroneousCallsAgg: [[1591347496889, 0]],
          errors: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 0.1071],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          maxSeverity: [[1591347496889, 0]],
          callsAgg: [[1591347496889, 12508]]
        }
      }
    ],
    page: 1,
    pageSize: 5,
    totalHits: 5
  },
  time: 1579539053035,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};

const applicationDownstream = {
  data: {
    items: [
      {
        application: {
          id: 'U-LXHHgmRPmns8gNJChpXg',
          label: 'Robot Shop',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {
          latencyAgg: [[1591347496889, 8.5537]],
          calls: [
            [1591344000000, 21497],
            [1591344300000, 20662],
            [1591344600000, 24099],
            [1591344900000, 26056],
            [1591345200000, 26720],
            [1591345500000, 25382],
            [1591345800000, 9962],
            [1591346100000, 22294],
            [1591346400000, 25989],
            [1591346700000, 26661],
            [1591347000000, 24929]
          ],
          latency: [
            [1591344000000, 28.945],
            [1591344300000, 30.777],
            [1591344600000, 29.2138],
            [1591344900000, 30.8152],
            [1591345200000, 24.7766],
            [1591345500000, 25.4023],
            [1591345800000, 414.7244],
            [1591346100000, 22.9811],
            [1591346400000, 26.8657],
            [1591346700000, 26.7822],
            [1591347000000, 26.7783]
          ],
          errorsAgg: [[1591347496889, 0]],
          erroneousCalls: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 658],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          erroneousCallsAgg: [[1591347496889, 0]],
          errors: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 0.066],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          maxSeverity: [[1591347496889, 5]],
          callsAgg: [[1591347496889, 12508]]
        }
      },
      {
        application: {
          id: 'lBR64A07QICHH3oSLY1bZg',
          label: 'All Services',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {
          latencyAgg: [[1591347496889, 8.5537]],
          calls: [
            [1591344000000, 23991],
            [1591344300000, 23474],
            [1591344600000, 29064],
            [1591344900000, 30762],
            [1591345200000, 32681],
            [1591345500000, 32166],
            [1591345800000, 11049],
            [1591346100000, 26660],
            [1591346400000, 30074],
            [1591346700000, 31369],
            [1591347000000, 29756]
          ],
          latency: [
            [1591344000000, 26.5509],
            [1591344300000, 27.6869],
            [1591344600000, 25.3206],
            [1591344900000, 27.258],
            [1591345200000, 21.5959],
            [1591345500000, 21.5351],
            [1591345800000, 683.1755],
            [1591346100000, 23.5439],
            [1591346400000, 24.4249],
            [1591346700000, 26.9204],
            [1591347000000, 26.0568]
          ],
          errorsAgg: [[1591347496889, 0]],
          erroneousCalls: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 1184],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 2]
          ],
          erroneousCallsAgg: [[1591347496889, 0]],
          errors: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 0.1071],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          maxSeverity: [[1591347496889, 0]],
          callsAgg: [[1591347496889, 12508]]
        }
      },
      {
        application: {
          id: 'TI1ItQY6TXOmb8j9SPl7NQ',
          label: 'test yoann 3',
          boundaryScope: 'INBOUND',
          entityType: 'APPLICATION'
        },
        metrics: {
          latencyAgg: [[1591347496889, 8.5537]],
          calls: [
            [1591344000000, 23991],
            [1591344300000, 23474],
            [1591344600000, 29064],
            [1591344900000, 30762],
            [1591345200000, 32681],
            [1591345500000, 32166],
            [1591345800000, 11049],
            [1591346100000, 26660],
            [1591346400000, 30074],
            [1591346700000, 31369],
            [1591347000000, 29756]
          ],
          latency: [
            [1591344000000, 26.5509],
            [1591344300000, 27.6869],
            [1591344600000, 25.3206],
            [1591344900000, 27.258],
            [1591345200000, 21.5959],
            [1591345500000, 21.5351],
            [1591345800000, 683.1755],
            [1591346100000, 23.5439],
            [1591346400000, 24.4249],
            [1591346700000, 26.9204],
            [1591347000000, 26.0568]
          ],
          errorsAgg: [[1591347496889, 0]],
          erroneousCalls: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 1184],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 2]
          ],
          erroneousCallsAgg: [[1591347496889, 0]],
          errors: [
            [1591344000000, 0],
            [1591344300000, 0],
            [1591344600000, 0],
            [1591344900000, 0],
            [1591345200000, 0],
            [1591345500000, 0],
            [1591345800000, 0.1071],
            [1591346100000, 0],
            [1591346400000, 0],
            [1591346700000, 0],
            [1591347000000, 0]
          ],
          maxSeverity: [[1591347496889, 0]],
          callsAgg: [[1591347496889, 12508]]
        }
      }
    ],
    page: 1,
    pageSize: 5,
    totalHits: 5
  },
  time: 1579539053035,
  adjustedWindowSize: null,
  errors: [],
  progress: {
    percentage: null,
    loading: false,
    note: null
  }
};
