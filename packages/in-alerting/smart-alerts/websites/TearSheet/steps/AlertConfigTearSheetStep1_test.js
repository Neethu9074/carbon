/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep1 from 'in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep1';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition.ts';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { website } from 'in-alerting/smart-alerts/eum/data/alertConfig.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep1 : in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep1', () => {
  const blueprintConfig = getBlueprintConfig('throughput');
  const updateForm = jest.fn();
  const form = alertFormDefinition(website);
  it('render step 1 components', async () => {
    render(<AlertConfigTearSheetStep1 form={form} updateForm={updateForm} blueprintConfig={blueprintConfig} />);

    expect(screen.getByText(t('in-alerting:smartAlerts.websites.tearSheet.step1.description'))).toBeInTheDocument();

    expect(screen.getByText(t('in-alerting:smartAlerts.eum.slowness.blueprintConfigName'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.websites.tearSheet.JsErrors.name'))).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigName'))
    ).toBeInTheDocument();

    expect(
      screen.getByText(t('in-alerting:smartAlerts.websites.data.statusCodeBlueprintConfigName'))
    ).toBeInTheDocument();

    expect(screen.getByText(t('in-alerting:smartAlerts.websites.tearSheet.throughput.headline'))).toBeInTheDocument();
    expect(screen.getByText(t('in-alerting:smartAlerts.websites.tearSheet.throughput.text'))).toBeInTheDocument();
  });
});
