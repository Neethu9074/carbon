/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { action } from '@storybook/addon-actions';
import React, { useState } from 'react';

import { EntitySelectionOverlay } from 'in-alerting/smart-alerts/applications/chart/ChartEntitySelector/EntitySelectionOverlay';
import EndpointTypeBadgeList from 'in-applications/Dashboards/commonComponents/EndpointTypeBadgeList';
import PermanentlyVisibleOverlay from '../../../util/PermanentlyVisibleOverlay';

export default {
  title: 'Organisms|smartAlerts/EntitySelectionOverlay',
  component: EntitySelectionOverlay
};

/*
 * Example data. Some information left out, e.g. any IDs or type (AP/Service/Endpoint)
 * ... to make it easier to use here
 */
const options = [
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
                label:
                  '3rd Lvl - Endpoint - extra 3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint-3rd Lvl - Endpoint'
              },
              {
                label: '3rd Lvl - Endpoint'
              },
              {
                label: '/rest'
              }
            ]
          },
          {
            label: 'Service Node B',
            icon: 'lib_application_service',
            children: [
              {
                label: 'Endpoint B-1',
                icon: 'lib_application_endpoint'
              },
              {
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
            children: [
              {
                label: 'some super long endpoint name '
              }
            ]
          }
        ]
      }
    ]
  }
];

export function EndpointSelector() {
  const [query, onQueryChange] = useState('');
  return (
    <PermanentlyVisibleOverlay>
      <EntitySelectionOverlay options={options} query={query} onQueryChange={onQueryChange} onChange={action} />
    </PermanentlyVisibleOverlay>
  );
}

export function WithSearch() {
  const [query, onQueryChange] = useState('e');
  return (
    <PermanentlyVisibleOverlay>
      <EntitySelectionOverlay options={options} query={query} onQueryChange={onQueryChange} onChange={action} />
    </PermanentlyVisibleOverlay>
  );
}
