/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import PropTypes from 'prop-types';
import React from 'react';

import PropContainer from 'in-new-components/Alerting/components/PropContainer';
import Toggle from 'in-components/form/Toggle/Toggle';
import Label from 'in-components/form/Label';

import locals from './AlertPropertyInfos.mless';

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
      <PropContainer left="Title" right={<Label className={locals.staticTitle}>{name}</Label>} />
      <PropContainer
        icon={severityProperty.icon}
        left="Alert Level"
        right={<Label className={locals.staticSeverity}>{severityProperty.label}</Label>}
      />
      <PropContainer
        icon="lib_events_incident"
        left="Triggers Incident"
        right={<Toggle checked={triggering} disabled />}
      />
      <PropContainer
        icon="lib_help_error_error_outline"
        left="Description"
        right={<Label className={locals.staticDescription}>{description}</Label>}
      />
    </>
  );
}

AlertPropertyInfos.propTypes = {
  alertConfig: PropTypes.object.isRequired
};
