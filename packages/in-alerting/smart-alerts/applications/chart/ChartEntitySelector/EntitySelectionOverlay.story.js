/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { EntitySelectionOverlay } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/EntitySelectionOverlay';
import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';

export default {
  component: EntitySelectionOverlay,
  argTypes: {
    close: { action: 'close' },
    setApplicationId: { action: 'setApplicationId' },
    setServiceId: { action: 'setServiceId' },
    setEndpointId: { action: 'setEndpointId' },
    setApplicationName: { action: 'setApplicationName' },
    setServiceName: { action: 'setServiceName' },
    setEndpointName: { action: 'setEndpointName' }
  },
  args: {
    options: createOptions()
  }
};

/*
 * Example data. Some information left out, e.g. any IDs or type (AP/Service/Endpoint)
 * ... to make it easier to use here
 */
function createOptions() {
  return [
    {
      label: 'Applications:',
      description: 'search result',
      children: [
        {
          label: 'All Services',
          description: 'search result',
          icon: 'lib_application',
          children: [
            {
              label: 'Service Node',
              description: 'search result',
              badge: <EndpointTypeBadgeList types={['HTTP', 'GRAPHQL']} />,
              icon: 'lib_application_service',
              children: [
                {
                  label: '3rd Level',
                  icon: 'lib_application_endpoint'
                },
                {
                  label:
                    '3rd Lvl - Endpoint - extra Second Level Service Leaf-Second Level Service Leaf-Second Level Service Leaf-Second Level Service Leaf-Second Level Service Leaf-Second Level Service Leaf',
                  icon: 'lib_application_endpoint'
                }
              ]
            },
            {
              icon: 'lib_application_service',
              badge: <EndpointTypeBadgeList types={['HTTP', 'GRAPHQL']} />,
              label: 'Second Level Service Leaf - super long - Second Level Service Leaf',
              children: [
                {
                  type: 'SERVICE',
                  label:
                    '3rd Lvl - Endpoint - extra 3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint'
                },
                {
                  type: 'SERVICE',
                  label: '3rd Lvl - Endpoint'
                },
                {
                  type: 'SERVICE',
                  label: '/rest'
                }
              ]
            },
            {
              type: 'SERVICE',
              label: 'Service Node B',
              icon: 'lib_application_service',
              children: [
                {
                  type: 'ENDPOINT',
                  label: 'Endpoint B-1',
                  icon: 'lib_application_endpoint'
                },
                {
                  type: 'ENDPOINT',
                  label: 'Endpoint B-2',
                  icon: 'lib_application_endpoint'
                }
              ]
            }
          ]
        },
        {
          label: 'some super long application name ',
          children: [
            {
              label: 'some super extra long service name ',
              type: 'SERVICE',
              children: [
                {
                  type: 'ENDPOINT',
                  label: 'some super long endpoint name '
                }
              ]
            }
          ]
        }
      ]
    }
  ];
}

export function EndpointSelector(args) {
  const [query, onQueryChange] = useState('');
  return (
    <PermanentlyVisibleOverlay>
      <EntitySelectionOverlay {...args} query={query} onQueryChange={onQueryChange} />
    </PermanentlyVisibleOverlay>
  );
}

export function WithSearch(args) {
  const [query, onQueryChange] = useState('e');
  return (
    <PermanentlyVisibleOverlay>
      <EntitySelectionOverlay {...args} query={query} onQueryChange={onQueryChange} />
    </PermanentlyVisibleOverlay>
  );
}
