/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import TwoColumnContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/TwoColumnContainer';
import { t } from 'in-i18n';

export default function AlertPropertiesContainer({ renderAlertPreview, renderAlertProperties }) {
  return (
    <TwoColumnContainer
      mainContentHeadline={t('in-alerting:smartAlerts.components.smartAlertDialog.alertPropertiesAlertProperties')}
      mainContent={renderAlertProperties()}
      secondaryContent={renderAlertPreview()}
      removeMainAreaContentBorder
    />
  );
}

AlertPropertiesContainer.propTypes = {
  renderAlertPreview: PropTypes.func.isRequired,
  renderAlertProperties: PropTypes.func.isRequired
};
