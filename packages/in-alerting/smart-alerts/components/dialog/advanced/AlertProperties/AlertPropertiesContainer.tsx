/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode } from 'react';

import TwoColumnContainerForTearsheet from 'in-alerting/smart-alerts/components/tearSheet/TwoColumnContainer';
import TwoColumnContainer from 'in-alerting/smart-alerts/components/dialog/TwoColumnContainer';
import { t } from 'in-i18n';

interface AlertPropertiesContainerProps {
  renderAlertPreview: () => ReactNode;
  renderAlertProperties: () => ReactNode;
  isTearSheet?: boolean;
}

export default function AlertPropertiesContainer({
  renderAlertPreview,
  renderAlertProperties,
  isTearSheet = false
}: AlertPropertiesContainerProps): JSX.Element {
  return isTearSheet ? (
    <TwoColumnContainerForTearsheet mainContent={renderAlertProperties()} secondaryContent={renderAlertPreview()} />
  ) : (
    <TwoColumnContainer
      mainContentHeadline={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertProperties')}
      mainContent={renderAlertProperties()}
      secondaryContent={renderAlertPreview()}
      removeMainAreaContentBorder
    />
  );
}
