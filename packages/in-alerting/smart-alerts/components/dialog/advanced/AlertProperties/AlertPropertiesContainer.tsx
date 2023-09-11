/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import TwoColumnContainer from 'in-alerting/smart-alerts/components/dialog/TwoColumnContainer';
import { t } from 'in-i18n';

interface AlertPropertiesContainerProps {
  renderAlertPreview: () => ReactNode;
  renderAlertProperties: () => ReactNode;
}

export default function AlertPropertiesContainer({
  renderAlertPreview,
  renderAlertProperties
}: AlertPropertiesContainerProps): JSX.Element {
  return (
    <TwoColumnContainer
      mainContentHeadline={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertProperties')}
      mainContent={renderAlertProperties()}
      secondaryContent={renderAlertPreview()}
      removeMainAreaContentBorder
    />
  );
}
