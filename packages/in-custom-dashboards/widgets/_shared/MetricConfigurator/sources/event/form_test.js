/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { createMapForm } from 'formalistic';

/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env jest */
import { createForm } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/event/form';

test('createForm generation with empty state', () => {
  const form = createForm(createMapForm());
  expect(form.toJS()).toMatchInlineSnapshot(`
    Object {
      "aggregation": "DISTINCT_COUNT",
      "dynamicFocusQuery": "",
      "includeAgentMonitoringIssues": false,
      "includeK8sInfoEvents": false,
      "metric": "eventCount",
      "metricLabel": "Event Count",
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
      "metricLabel": "Event Count",
    }
  `);
});
