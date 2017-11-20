import React from 'react';

import Toggle from 'in-components/form/Toggle';
import Step from 'in-components/form/Step';

import './Step3.less';

const block = 'in-alerting-config-form-step-3';

export default function Step3({ form, onChange }) {
  const types = form.get('eventTypes').value;

  return (
    <Step number={3} title="Event Types" form={form} onChange={onChange}>
      <div className={`${block}__labeled-toggle-group`}>
        <LabeledToggle onChange={onChange} types={types} type="incident" />
        <LabeledToggle onChange={onChange} types={types} type="critical" title="Critical Issues" />
        <LabeledToggle onChange={onChange} types={types} type="warning" title="Warning Issues" />
        <LabeledToggle onChange={onChange} types={types} type="change" />
        <LabeledToggle onChange={onChange} types={types} type="online" />
        <LabeledToggle onChange={onChange} types={types} type="offline" />
      </div>
    </Step>
  );
}

function LabeledToggle({ onChange, types, title, type }) {
  return (
    <div className={`${block}__labeled-toggle`}>
      <span className={`${block}__label`}>{title ? title : type}</span>
      <Toggle
        className={`${block}__toggle`}
        checked={types.includes(type)}
        onChange={() => onSelectChanged(types, onChange, type)}
      />
    </div>
  );
}

function onSelectChanged(types, onChange, type) {
  const containsType = types.includes(type);

  if (containsType) {
    types = types.delete(types.indexOf(type));
  } else {
    types = types.push(type);
  }

  onChange('eventTypes', types);
}
