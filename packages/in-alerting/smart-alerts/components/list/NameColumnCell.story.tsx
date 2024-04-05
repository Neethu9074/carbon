/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import BuiltInIndicator from 'in-alerting/smart-alerts/components/details/BuiltInIndicator';
import { NameColumnCell } from 'in-alerting/smart-alerts/components/list/NameColumnCell';

const config = {
  description: 'some description',
  name: 'some name',
  severity: 5,
  enabled: true
};

export default {
  component: NameColumnCell,
  args: {
    config
  }
};

export const WithBuiltIn = {
  args: {
    getAdditionalContent: () => <BuiltInIndicator builtIn />
  }
};

export const WithExtraLongNameAndMaxWidth = {
  args: {
    config: {
      ...config,
      name: 'some super long text to test and demonstrate '
    }
  },
  decorators: [
    // @ts-expect-error
    story => <div style={{ width: 300, display: 'flex', flexDirection: 'column' }}>{story()}</div>
  ]
};
