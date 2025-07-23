/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import ScopeAggregation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { alertConfig } from 'in-alerting/smart-alerts/infrastructure/data/testData';
import { t } from 'in-i18n';

describe('Render Scope Aggregation in Infra SA dialog : in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation', () => {
  let form;
  let updateForm;

  beforeEach(() => {
    form = alertFormDefinition(alertConfig, false);
    updateForm = jest.fn(newForm => {
      form = newForm;
      return form;
    });
  });

  it('Check if component rendered in UI', () => {
    render(<ScopeAggregation form={form} updateForm={updateForm} />);
    expect(
      screen.getByText(t('in-custom-dashboards:widgets.srcInfrastructure.metricsFormComponent.crossSeriesAggregation'))
    ).toBeInTheDocument();
  });

  it('Click on aggregation Dropdown and verify form update', () => {
    const { rerender } = render(<ScopeAggregation form={form} updateForm={updateForm} />);
    const selectElement = document.querySelector("[id='metric-configurator-infra-aggregation']");
    fireEvent.change(selectElement, { target: { value: 'MAX' } });
    expect(updateForm).toHaveBeenCalled();
    rerender(<ScopeAggregation form={form} updateForm={updateForm} />);
    expect(screen.getByRole('switch')).not.toBeDisabled();
  });
});
