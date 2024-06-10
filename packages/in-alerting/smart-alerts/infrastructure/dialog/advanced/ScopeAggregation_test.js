/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import ScopeAggregation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import { t } from 'in-i18n';

describe('Render Scope Aggregation in Infra SA dialog : in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation', () => {
  const form = alertFormDefinition(alertConfig, false);
  const updateForm = jest.fn();

  it('Check if component rendered in UI', () => {
    render(<ScopeAggregation form={form} updateForm={updateForm} />);
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation'))
    ).toBeInTheDocument();
  });

  it('Click on aggregation Dropdown', () => {
    render(<ScopeAggregation form={form} updateForm={updateForm} />);
    document.querySelector("[id='metric-configurator-infra-aggregation']").click();
    expect(screen.getByText('max')).toBeInTheDocument();
    screen.getByText('max').click();
    expect(screen.getByRole('switch')).not.toBeDisabled();
  });
});
