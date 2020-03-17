import PropTypes from 'prop-types';
import React from 'react';

import PropContainer from 'in-new-components/Alerting/components/PropContainer';
import Toggle from 'in-components/form/Toggle/Toggle';
import Label from 'in-components/form/Label';

import locals from './AlertPropertyInfos.mless';

const warningIndex = 0;
const severityWarning = 5;
const severityCritical = 10;

const severitySelectOptions = [
  { value: severityWarning, label: 'Warning' },
  { value: severityCritical, label: 'Critical' }
];

export default function AlertPropertyInfos({ form }) {
  const severity = Number(form.get('severity').value);

  return (
    <>
      <PropContainer left="Title" right={<Label className={locals.staticTitle}>{form.get('name').value}</Label>} />
      <PropContainer
        icon={severity <= severityWarning ? 'lib_events_warning' : 'lib_events_critical'}
        left="Alert Level"
        right={<Label className={locals.staticSeverity}>{severitySelectOptions[warningIndex].label}</Label>}
      />
      <PropContainer
        icon="lib_events_incident"
        left="Triggers Incident"
        right={<Toggle checked={Boolean(form.get('triggering').value)} disabled />}
      />
      <PropContainer
        icon="lib_help_error_error_outline"
        left="Description"
        right={<Label className={locals.staticDescription}>{form.get('description').value}</Label>}
      />
    </>
  );
}

AlertPropertyInfos.propTypes = {
  form: PropTypes.object.isRequired
};
