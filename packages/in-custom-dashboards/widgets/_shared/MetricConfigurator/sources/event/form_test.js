/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm } from 'formalistic';

import { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event/form';

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

test('createForm generation with empty state', () => {
  const form = createForm(createMapForm());
  expect(form.toJS()).toMatchInlineSnapshot(`
    Object {
      "aggregation": "DISTINCT_COUNT",
      "dynamicFocusQuery": "",
      "includeAgentMonitoringIssues": false,
      "includeK8sInfoEvents": false,
      "metric": "eventCount",
      "metricLabel": "Event count",
    }
  `);
});

test('createForm generation with saved state', () => {
  const form = createForm(createMapForm(), {
    dynamicFocusQuery: 'dynamic focus query',
    includeK8sInfoEvents: true,
    includeAgentMonitoringIssues: true
  });

  expect(form.toJS()).toMatchInlineSnapshot(`
    Object {
      "aggregation": "DISTINCT_COUNT",
      "dynamicFocusQuery": "dynamic focus query",
      "includeAgentMonitoringIssues": true,
      "includeK8sInfoEvents": true,
      "metric": "eventCount",
      "metricLabel": "Event count",
    }
  `);
});
