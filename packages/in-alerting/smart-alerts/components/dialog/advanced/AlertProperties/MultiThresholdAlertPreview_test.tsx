/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { MultiThresholdAlertPreview } from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/MultiThresholdAlertPreview';
import { getDefaultConfig } from 'in-alerting/smart-alerts/infrastructure/form/useInfraSmartAlertFormSideEffects_test';
import alertFormDefinition from 'in-alerting/smart-alerts/infrastructure/form/alertFormDefinition';
import { getDescriptionPlaceholder } from 'in-alerting/smart-alerts/infrastructure/form/formUtils';
import { t } from 'in-i18n';

describe('in-alerting/components/AlertThresholdInfosPresenter', () => {
  it('renders component correctly', () => {
    const alertConfig = getDefaultConfig();

    const props = {
      form: alertFormDefinition(alertConfig, false),
      getDescriptionPlaceholder: getDescriptionPlaceholder
    };

    render(<MultiThresholdAlertPreview {...props} />);

    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.warningAlertPreviewLabel'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.criticalAlertPreviewLabel'))
    ).toBeInTheDocument();
  });
});
