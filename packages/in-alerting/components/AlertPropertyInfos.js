/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PropTypes from 'prop-types';
import React from 'react';

import AlertSection from 'in-alerting/components/AlertSection';
import Sections from 'in-components/workspace/Sections';
import Toggle from 'in-components/form/Toggle';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/components/AlertPropertyInfos.mless';

const propertiesBySeverity = Object.freeze({
  5: {
    icon: 'lib_events_warning',
    label: t('in-alerting:components.alertPropertyInfosWarning')
  },
  10: {
    icon: 'lib_events_critical',
    label: t('in-alerting:components.alertPropertyInfosCritical')
  }
});

export default function AlertPropertyInfos({
  alertConfig: { name, description, triggering, severity },
  renderCustomTitle
}) {
  const severityProperty = propertiesBySeverity[severity];
  return (
    <Sections>
      <AlertSection title={t('in-alerting:components.alertPropertyInfosLabelTitle')}>
        <Label className={locals.staticTitle}>{renderCustomTitle?.() ?? name}</Label>
      </AlertSection>
      <AlertSection icon={severityProperty.icon} title={t('in-alerting:components.alertPropertyInfosLabelAlertLevel')}>
        <Label className={locals.staticSeverity}>{severityProperty.label}</Label>
      </AlertSection>
      <AlertSection
        icon="lib_events_incident"
        title={t('in-alerting:components.alertPropertyInfosLabelTriggersIncident')}
      >
        <Toggle checked={triggering} disabled />
      </AlertSection>
      <AlertSection
        icon="lib_help_error_error_outline"
        title={t('in-alerting:components.alertPropertyInfosLabelDescription')}
      >
        <Label className={locals.staticDescription}>{description}</Label>
      </AlertSection>
    </Sections>
  );
}

AlertPropertyInfos.propTypes = {
  alertConfig: PropTypes.object.isRequired,
  renderCustomTitle: PropTypes.func
};
