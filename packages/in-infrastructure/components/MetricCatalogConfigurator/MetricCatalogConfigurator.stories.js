/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { action as storybookAction } from '@storybook/addon-actions';
import React from 'react';

import MetricCatalogConfigurator from 'in-infrastructure/components/MetricCatalogConfigurator/MetricCatalogConfigurator';

export default {
  component: MetricCatalogConfigurator
};

export const Default = {
  render: () => (
    <MetricCatalogConfigurator
      values={[]}
      onChange={storybookAction('onChange')}
      metricCatalog={{
        data: {
          tree: []
        },

        progress: {
          loading: false
        }
      }}
      catalogQuery={{
        value: ''
      }}
      type={'all'}
    />
  ),

  name: 'default'
};
