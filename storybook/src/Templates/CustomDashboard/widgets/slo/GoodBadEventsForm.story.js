import React, { useState } from 'react';

import GoodBadEventsForm from 'in-custom-dashboards/widgets/Slo/sli/GoodBadEventsForm';
import { createForm } from 'in-custom-dashboards/widgets/Slo/sli/sliForm';
import { createQueryBuilder } from 'in-new-components/QueryBuilder';
import { successObservableFactory } from 'in-services/util/result';
import Form from 'in-components/form/binding/Form';

export default {
  title: 'Templates|CustomDashboard/widgets/SLO/SLI-management/GoodBadEvents',
  component: GoodBadEventsForm
};

export function GoodBadEvents() {
  const sliConfig = {
    id: 'event-based--incomplete-data',
    sliName: 'good-bad-events-filters--missing',
    sliEntity: {
      sliType: 'availability'
    }
  };

  const [form, setForm] = useState(createForm(sliConfig, 'applicationId'));

  const tinyTagCatalog = {
    tags: [
      {
        name: 'kubernetes.label',
        type: 'STRING'
      },
      {
        name: 'kubernetes.cluster.label',
        type: 'STRING'
      },
      {
        name: 'kubernetes.cluster.name',
        type: 'STRING'
      },
      {
        name: 'kubernetes.namespace.label',
        type: 'STRING'
      },
      {
        name: 'kubernetes.namespace.name',
        type: 'STRING'
      },
      {
        name: 'application.name',
        type: 'STRING',
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'service.name',
        type: 'STRING',
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'endpoint.name',
        type: 'STRING',
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'call.latency',
        type: 'NUMBER',
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'trace.latency',
        type: 'NUMBER',
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'call.erroneous',
        type: 'BOOLEAN',
        canApplyToSource: true,
        canApplyToDestination: true
      },
      {
        name: 'call.http.header',
        type: 'KEY_VALUE_PAIR',
        canApplyToSource: true,
        canApplyToDestination: true
      }
    ],
    tagTree: [
      {
        type: 'TAG',
        label: 'Label',
        icon: 'lib_kubernetes_label',
        description: 'Root level tag',
        tagName: 'kubernetes.label'
      },
      {
        type: 'LEVEL',
        label: 'Calls',
        children: [
          {
            type: 'TAG',
            label: 'Latency',
            description: 'Call latency',
            tagName: 'call.latency'
          },
          {
            type: 'TAG',
            label: 'Erroneous',
            description: 'Whether or not the call was successful',
            tagName: 'call.erroneous'
          },
          {
            type: 'TAG',
            label: 'HTTP Headers',
            description: 'HTTP headers in HTTP request',
            tagName: 'call.http.header'
          }
        ]
      }
    ]
  };
  const { QueryBuilder } = createQueryBuilder({
    getTagCatalog: successObservableFactory(tinyTagCatalog),
    getSuggestions: successObservableFactory({
      suggestions: ['Suggestion 1', 'Suggestion 2', 'Suggestion 3'],
      totalHits: 42
    })
  });

  return (
    <Form form={form} setForm={setForm}>
      <GoodBadEventsForm applicationName="All Services" onChange={setForm} QueryBuilderComponent={QueryBuilder} />
    </Form>
  );
}
