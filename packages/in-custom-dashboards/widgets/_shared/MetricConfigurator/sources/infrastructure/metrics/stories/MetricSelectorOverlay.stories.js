/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { action as storybookAction } from '@storybook/addon-actions';
import { useState } from 'react';
import React from 'react';

import metricCatalogExampleJson from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/stories/metricCatalogExample.ts';
import MetricSelectorOverlay from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/MetricSelectorOverlay';
import PermanentlyVisibleOverlay from 'in-components/overlays/OverlayPresenter/stories/PermanentlyVisibleOverlay';

const Template = args => {
  const [query, setQuery] = useState('');
  return (
    <PermanentlyVisibleOverlay>
      <MetricSelectorOverlay
        {...args}
        onChange={storybookAction('onChange')}
        close={storybookAction('close')}
        onQueryChange={setQuery}
        query={query}
      />
    </PermanentlyVisibleOverlay>
  );
};

function generateEmptyResult() {
  return { tree: [] };
}

const emptyResult = generateEmptyResult();

export default {
  component: MetricSelectorOverlay
};

export const Default = {
  render: Template.bind({}),
  name: 'default',

  args: {
    metricCatalog: metricCatalogExampleJson,
    loading: false
  }
};

export const WithNoResults = {
  render: Template.bind({}),
  name: 'WithNoResults',

  args: {
    metricCatalog: emptyResult,
    loading: false
  }
};
