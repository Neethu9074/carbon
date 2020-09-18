import { withKnobs, select } from '@storybook/addon-knobs';
import React from 'react';

import StackPresenter from 'in-new-components/Stack/StackPresenter';

export default {
  title: 'Molecules/Stack',
  component: StackPresenter,
  decorators: [withKnobs]
};

export const Default = () => {
  const tabs = select('TabIndex', [0, 1, 2], 0);
  return <StackPresenter stack={stackResult.data} activeTabIndex={tabs} />;
};

const stackResult = {
  data: {
    application: {
      groups: [
        {
          items: [
            {
              id: '68',
              label: 'discount',
              type: 'Service',
              healthInfo: {
                type: 'CRITICAL',
                explanation: 'explanation',
                partOfIncident: true
              }
            }
          ],
          relationship: 'PROVIDES'
        },
        {
          items: [
            {
              id: '69',
              label: 'robot-shop',
              type: 'Application Perspective',
              healthInfo: {
                type: 'CRITICAL',
                explanation: 'explanation',
                partOfIncident: true
              }
            },
            {
              id: '70',
              label: 'All',
              type: 'Application Perspective',
              healthInfo: {
                type: 'CRITICAL',
                explanation: 'explanation',
                partOfIncident: true
              }
            }
          ],
          relationship: 'PART_OF'
        }
      ],
      healthInfo: {
        type: 'WARNING',
        explanation: 'tooltip',
        partOfIncident: false
      }
    },
    infrastructure: {
      groups: [
        {
          items: [
            {
              id: '71',
              label: 'Instana Demo - App 0.1',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            },
            {
              id: '72',
              label: 'Java',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            }
          ],
          relationship: 'EXECUTED_BY'
        },
        {
          items: [
            {
              id: '73',
              label: 'discount (robot-shop/discount-3549852)',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            },
            {
              id: '74',
              label: 'demo-fullstack-host',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            }
          ],
          relationship: 'RUNNING_ON'
        }
      ],
      healthInfo: {
        type: 'HEALTHY',
        explanation: 'tooltip',
        partOfIncident: true
      }
    },
    kubernetes: {
      groups: [
        {
          items: [
            {
              id: '75',
              label: 'robot-shop/discount-3549852',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            }
          ],
          relationship: 'RUNNING_ON'
        },
        {
          items: [
            {
              id: '76',
              label: 'robot-shop/discount',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            }
          ],
          relationship: 'SCHEDULING_ON'
        },
        {
          items: [
            {
              id: '77',
              label: 'discount-svc',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            }
          ],
          relationship: 'EXPOSED_THROUGH'
        },
        {
          items: [
            {
              id: '78',
              label: 'gke-demo-cluster-default-pool-3jk2b2k435b2jk3hb4',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            },
            {
              id: '79',
              label: 'robot-shop',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            },
            {
              id: '80',
              label: 'k8s-demo',
              type: 'Infrastructure',
              healthInfo: {
                type: 'WARNING',
                explanation: 'tooltip',
                partOfIncident: false
              },
              offline: false
            }
          ],
          relationship: 'ORCHESTRATED_ON'
        }
      ],
      healthInfo: {
        type: 'HEALTHY',
        explanation: 'tooltip',
        partOfIncident: false
      }
    },
    healthInfo: {
      type: 'WARNING',
      explanation: 'tooltip',
      partOfIncident: true
    }
  },
  time: 1568816942111,
  errors: [],
  progress: { percentage: null, loading: false, note: null }
};
