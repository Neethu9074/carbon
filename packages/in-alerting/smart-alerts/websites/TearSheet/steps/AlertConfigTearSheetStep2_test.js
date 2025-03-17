/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import AlertConfigTearSheetStep2 from 'in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep2';
import alertFormDefinition from 'in-alerting/smart-alerts/websites/form/alertDialogFormDefinition.ts';
import { website } from 'in-alerting/smart-alerts/eum/data/alertConfig.json';
import { t } from 'in-i18n';

describe('AlertConfigTearSheetStep2 : in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep2', () => {
  const { tagFilterExpression } = website;
  const updateForm = jest.fn();
  const form = alertFormDefinition(website);
  it('render step 2 components', async () => {
    render(<AlertConfigTearSheetStep2 form={form} updateForm={updateForm} tagFilterExpression={tagFilterExpression} />);
    expect(screen.getByText(t('in-alerting:smartAlerts.websites.tearSheet.filter'))).toBeInTheDocument();
  });
});
