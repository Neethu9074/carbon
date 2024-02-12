/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render } from '@testing-library/react';
import React from 'react';

import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import ScopeMetric from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeMetric';
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';

describe('Render Scope Metric in Infra SA dialog : in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeMetric', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();
  const isRegex = true;
  const onChange = jest.fn();

  it('Check if component rendered in UI', async () => {
    const { getByRole } = render(
      <ScopeMetric form={form} updateForm={updateForm} onChange={onChange} isRegex={isRegex} />
    );
    expect(getByRole('button'));
  });
});
