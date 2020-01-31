import { withKnobs, select } from '@storybook/addon-knobs';
import React from 'react';

import UpstreamDownstreamPresenter from 'in-new-components/UpstreamDownstream/UpstreamDownstreamPresenter';

export default {
  title: 'Molecules|UpstreamDownstream',
  component: UpstreamDownstreamPresenter,
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
      items={tabs === 0 ? upstream.data.items : downstream.data.items}
      activeTabIndex={0}
      label="shop-frontend"
      progress={prepProgress}
      result={upstream}
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
