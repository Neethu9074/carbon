/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { ListNameColumn } from 'in-alerting/smart-alerts/applications/list/columns/ListNameColumn';

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

export default {
  component: ListNameColumn,
  args: {
    config
  }
};

export const APListNameColumn = {};

export const WithExtraLongNameAndMaxWidth = {
  args: {
    config: {
      ...config,
      name: 'some super long text to test and demonstrate '
    }
  }
};
