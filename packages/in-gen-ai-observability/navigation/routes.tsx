/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Route } from 'react-router-dom';
import React from 'react';

//@ts-expect-error
import { renderAsyncRouteChildren } from 'in-components/routing/createAsyncComponent';
import { genAiObservability, llmMetricsMonitoring } from 'in-gen-ai-observability/navigation/paths';
import GenAiObservabilityLayout from 'in-gen-ai-observability/Dashboard/GenAiObservabilityLayout';

// Wrapper function to apply the layout to any component
const withGenAiLayout = (Component: React.ComponentType<any>) => {
  return (props: Record<string, unknown>) => (
    <GenAiObservabilityLayout>
      <Component {...props} />
    </GenAiObservabilityLayout>
  );
};

const GenAiObservability = () =>
  import(/* webpackChunkName: "gen-ai-observability" */ 'in-gen-ai-observability/Dashboard/LlmMetricsPage').then(
    module => ({ default: withGenAiLayout(module.default) })
  );

const LlmMetricsPage = () =>
  import(/* webpackChunkName: "gen-ai-observability" */ 'in-gen-ai-observability/Dashboard/LlmMetricsPage').then(
    module => ({ default: withGenAiLayout(module.default) })
  );

export default [
  <Route exact path={genAiObservability} key="monitoringPath">
    {renderAsyncRouteChildren(GenAiObservability)}
  </Route>,
  <Route exact path={llmMetricsMonitoring} key="llmPage">
    {renderAsyncRouteChildren(LlmMetricsPage)}
  </Route>
];
