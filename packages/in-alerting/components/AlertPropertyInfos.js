/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import PropContainer from 'in-alerting/smart-alerts/components/smart-alert-dialog/PropContainer';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/AlertPropertyInfos.mless';

const propertiesBySeverity = Object.freeze({
  5: {
    icon: 'lib_events_warning',
    label: 'Warning'
  },
  10: {
    icon: 'lib_events_critical',
    label: 'Critical'
  }
});

export default function AlertPropertyInfos({ alertConfig: { name, description, triggering, severity } }) {
  const severityProperty = propertiesBySeverity[severity];
  return (
    <>
      <PropContainer
        left={t('in-new-components:alerting.components.alertPropertyInfosLabelTitle')}
        right={<Label className={locals.staticTitle}>{name}</Label>}
      />
      <PropContainer
        icon={severityProperty.icon}
        left={t('in-new-components:alerting.components.alertPropertyInfosLabelAlertLevel')}
        right={<Label className={locals.staticSeverity}>{severityProperty.label}</Label>}
      />
      <PropContainer
        icon="lib_events_incident"
        left={t('in-new-components:alerting.components.alertPropertyInfosLabelTriggersIncident')}
        right={<Toggle checked={triggering} disabled />}
      />
      <PropContainer
        icon="lib_help_error_error_outline"
        left={t('in-new-components:alerting.components.alertPropertyInfosLabelDescription')}
        right={<Label className={locals.staticDescription}>{description}</Label>}
      />
    </>
  );
}

AlertPropertyInfos.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
