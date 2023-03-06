/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { ListNameColumn, getSubtitle } from 'in-alerting/smart-alerts/applications/list/columns/ListNameColumn';
import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { NameContent } from 'in-alerting/smart-alerts/components/AlertsBaseList';

export default {
  component: ListNameColumn
};

const config = {
  description: 'some description',
  name: 'some name',
  severity: 5,
  rule: {
    alertType: 'slowness',
    aggregation: 'SUM',
    metricName: 'latency'
  },
  threshold: {},
  builtIn: true,
  evaluationType: 'AP_ONLY',
  enabled: true
};

export const APListNameColumn = {
  args: {
    config
  }
};

export const NewNameContentColumn = () => (
  <NameContent
    config={config}
    getSubtitle={config => getSubtitle(config.rule, config.threshold)}
    getAdditionalContent={config => <BuiltInIndicator builtIn={config.builtIn} />}
  />
);

export const ComparisonRegularName = () => (
  <div>
    old AP list name:
    <ListNameColumn config={config} />
    <hr />
    new Alert list name:
    <NameContent
      config={config}
      getSubtitle={config => getSubtitle(config.rule, config.threshold)}
      getAdditionalContent={config => <BuiltInIndicator builtIn={config.builtIn} />}
    />
  </div>
);
export const WithExtraLongNameAndMaxWidth = args => {
  const withLongName = { ...config, builtIn: args.builtIn, name: 'some super long text to test and demonstrate ' };
  return (
    <div style={{ width: 300, display: 'flex', flexDirection: 'column' }}>
      <div style={{ border: '1px solid red', padding: '1rem' }}>
        <strong>old AP list name:</strong>
        <ListNameColumn config={withLongName} />
      </div>
      <div style={{ border: '1px solid green', padding: '1rem' }}>
        <strong>new Alert list name:</strong>
        <NameContent
          config={withLongName}
          getSubtitle={config => getSubtitle(config.rule, config.threshold)}
          getAdditionalContent={config => <BuiltInIndicator builtIn={config.builtIn} />}
        />
      </div>
    </div>
  );
};
WithExtraLongNameAndMaxWidth.args = {
  builtIn: true
};
