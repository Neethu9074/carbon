/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import TwoColumnContainer from 'in-alerting/smart-alerts/components/tearSheet/TwoColumnContainer';
import { t } from 'in-i18n';

describe('TwoColumnContainer : in-alerting/smart-alerts/components/tearSheet/TwoColumnContainer', () => {
  it('should render correctly', async () => {
    render(
      <TwoColumnContainer
        mainContent={<>{t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertProperties')}</>}
        secondaryContent={<>{t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle')}</>}
      />
    );
    expect(
      screen.getByText(t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertProperties'))
    ).toBeInTheDocument();
    expect(
      screen.getByText(t('in-alerting:smartAlerts.applications.tearSheet.alertProperties.previewTitle'))
    ).toBeInTheDocument();
  });
});
