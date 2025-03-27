/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/AlertConfigTearSheetStep1';
import alertFormDefinition from 'in-alerting/smart-alerts/synthetics/form/alertDialogFormDefinition';
import { initialConfig } from 'in-alerting/smart-alerts/synthetics/data/alertConfig.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep1 : in-alerting/smart-alerts/infrastructure/tearsheet/steps/AlertConfigTearSheetStep1', () => {
  const onChange = jest.fn();
  const updateForm = jest.fn();
  const setTagFilterValid = jest.fn();
  const form = alertFormDefinition(initialConfig);

  it('should render step 1 components', async () => {
    render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step1.header'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.step1.description'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.scopeFilter.filter'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.synthetics.tearSheet.scopeFilter.filterDescription'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButton'))
    ).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.synthetics.selectTests.alertTests'))).toBeInTheDocument();
  });

  it('should render and click the add test button', async () => {
    render(
      <AlertConfigTearSheetStep1
        form={form}
        updateForm={updateForm}
        onChange={onChange}
        setTagFilterValid={setTagFilterValid}
      />
    );
    const addTestButton = screen.getByRole('button', {
      name: t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButton')
    });
    expect(addTestButton).toBeTruthy();
    fireEvent.click(addTestButton);
    expect(
      screen.getByText(t('in-alerting:smartAlerts.synthetics.selectTests.selectAlertTestButton'))
    ).toBeInTheDocument();
  });
});
