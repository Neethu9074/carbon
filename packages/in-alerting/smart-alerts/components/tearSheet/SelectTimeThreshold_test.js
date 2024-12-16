/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import SelectTimeThreshold from 'in-alerting/smart-alerts/components/tearSheet/SelectTimeThreshold';
import { createSmartAlertForm } from 'in-alerting/smart-alerts/applications/form/smartAlertForm';
import { alertConfig } from 'in-alerting/smart-alerts/applications/data/alertConfigData.json';
import { t } from 'in-i18n';

describe('SelectTimeThreshold : in-alerting/smart-alerts/components/tearSheet/SelectTimeThreshold', () => {
  const form = createSmartAlertForm(alertConfig, true, true);
  alertConfig.timeThreshold = {
    type: 'violationsInSequence',
    timeWindow: 1200000
  };
  const formWithviolationsInSequence = createSmartAlertForm(alertConfig, true, true);
  const updateForm = jest.fn();
  const user = userEvent.setup();
  it('should render correctly', async () => {
    render(
      <SelectTimeThreshold
        form={formWithviolationsInSequence}
        updateForm={updateForm}
        hasTraceImpactOption
        impactTimeThresholdDisabled={false}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAlert'))
    ).toBeInTheDocument();
    await expect(screen.getAllByRole('option').length).toEqual(4);
  });

  it('should render correctly with - ImpactTimeThreshold disabled', async () => {
    render(
      <SelectTimeThreshold
        form={formWithviolationsInSequence}
        updateForm={updateForm}
        hasTraceImpactOption
        impactTimeThresholdDisabled
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.triggerAlert'))
    ).toBeInTheDocument();
    await expect(screen.getAllByRole('option').length).toEqual(3);
  });

  it('should allow user to select the tracer impact from dropdown', async () => {
    render(
      <SelectTimeThreshold
        form={formWithviolationsInSequence}
        updateForm={updateForm}
        hasTraceImpactOption
        impactTimeThresholdDisabled={false}
      />
    );
    user.selectOptions(
      screen.getByTestId('timeThresholdTypeTriggerAlert'),
      screen.getByRole('option', { name: 'When a minimum number of traces are impacted' })
    );
    expect(screen.getByRole('option', { name: 'When a minimum number of traces are impacted' })).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('timeThresholdTypeTriggerAlert'), { target: { value: 'requestImpact' } });
    expect(screen.getByRole('option', { name: 'When a minimum number of traces are impacted' }).selected);
    expect(updateForm).toHaveBeenCalled();
  });

  it('should allow user to select the items from the persistence dropdown ', async () => {
    render(
      <SelectTimeThreshold
        form={formWithviolationsInSequence}
        updateForm={updateForm}
        hasTraceImpactOption
        impactTimeThresholdDisabled={false}
      />
    );
    user.selectOptions(
      screen.getByTestId('timeThresholdTypePersistenceType'),
      screen.getByRole('option', { name: 'Violations persist continuously' })
    );
    expect(screen.getByRole('option', { name: 'Violations persist continuously' })).toBeInTheDocument();
    fireEvent.change(screen.getByTestId('timeThresholdTypePersistenceType'), {
      target: { value: 'violationsInPeriod' }
    });
    expect(screen.getByRole('option', { name: 'Violations persist continuously' }).selected);
    expect(updateForm).toHaveBeenCalled();
  });

  it('Check the persistence dropdown is not visible when traces impacted are selected', () => {
    render(
      <SelectTimeThreshold
        form={form}
        updateForm={updateForm}
        hasTraceImpactOption
        impactTimeThresholdDisabled={false}
      />
    );
    expect(
      screen.queryByText(t('in-alerting:smartAlerts.components.tearSheet.timeThreshold.persistenceType'))
    ).not.toBeInTheDocument();
  });
});
