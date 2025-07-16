/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

// @ts-expect-error import GroupingConfigurator from 'in-components/GroupingConfigurator/GroupingConfigurator';
import GroupingConfigurator from 'in-components/GroupingConfigurator/GroupingConfigurator';

const tagCatalog = {
  tagTree: [
    {
      label: 'Trace',
      description: null,
      icon: null,
      children: [
        {
          label: 'Endpoint Name',
          icon: 'lib_application_trace',
          tagName: 'trace.endpoint.name',
          queryable: true,
          type: 'TAG'
        },
        {
          label: 'Service Name',
          icon: 'lib_application_trace',
          tagName: 'trace.service.name',
          queryable: true,
          type: 'TAG'
        }
      ],
      type: 'LEVEL',
      queryable: false
    }
  ],
  tags: [
    {
      name: 'trace.service.name',
      label: 'Service Name',
      type: 'STRING',
      description: null,
      canApplyToSource: true,
      canApplyToDestination: true,
      idTag: false
    },
    {
      name: 'trace.endpoint.name',
      label: 'Endpoint Name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false
    }
  ],
  __enriched: true,
  tagsByName: {
    'trace.service.name': {
      name: 'trace.service.name',
      label: 'Service Name',
      type: 'STRING',
      description: null,
      canApplyToSource: true,
      canApplyToDestination: true,
      idTag: false,
      path: [
        {
          label: 'Trace',
          description: null,
          icon: null,
          children: [
            {
              label: 'Endpoint Name',
              icon: 'lib_application_trace',
              tagName: 'trace.endpoint.name',
              queryable: true,
              type: 'TAG'
            },
            {
              label: 'Service Name',
              icon: 'lib_application_trace',
              tagName: 'trace.service.name',
              queryable: true,
              type: 'TAG'
            }
          ],
          type: 'LEVEL',
          queryable: false
        },
        {
          label: 'Service Name',
          icon: 'lib_application_trace',
          tagName: 'trace.service.name',
          queryable: true,
          type: 'TAG'
        }
      ]
    },
    'trace.endpoint.name': {
      name: 'trace.endpoint.name',
      label: 'Endpoint Name',
      type: 'STRING',
      description: null,
      canApplyToSource: false,
      canApplyToDestination: false,
      idTag: false,
      path: [null, null]
    }
  },
  allTagNames: ['trace.service.name', 'trace.endpoint.name']
};

export default {
  component: GroupingConfigurator
};

export const TraceServiceName = {
  render: () => (
    <GroupingConfigurator
      value={{
        groupbyTag: 'trace.service.name',
        groupbyTagEntity: 'DESTINATION'
      }}
      tagCatalog={tagCatalog}
      tagFilterExpression={{
        type: 'TAG_FILTER',
        name: 'application.name',
        operator: 'EQUALS',
        entity: 'DESTINATION',
        value: 'End-to-End test-1666221113342-G-app-1'
      }}
    />
  ),

  name: 'traceServiceName'
};
