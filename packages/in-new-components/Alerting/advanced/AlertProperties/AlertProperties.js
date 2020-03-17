import PropTypes from 'prop-types';
import React from 'react';

import ComboBox from 'in-components/ComboBox/ComboBox';
import Toggle from 'in-components/form/Toggle/Toggle';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';

import locals from './AlertProperties.mless';

const warningIndex = 0;
const severityWarning = 5;
const severityCritical = 10;

const severitySelectOptions = [
  { value: severityWarning, label: 'Warning' },
  { value: severityCritical, label: 'Critical' }
];

export default function AlertProperties({
  form,
  getDescriptionPlaceholder,
  getTitlePlaceholder,
  isReadOnly,
  onChange,
  trackAlertLevelChanged,
  trackDescriptionChanged,
  trackTitleChanged,
  trackTriggerChanged
}) {
  const severity = Number(form.get('severity').value);

  return (
    <>
      <PropContainer
        left="Title"
        right={
          isReadOnly ? (
            <Label className={locals.staticTitle}>{form.get('name').value}</Label>
          ) : (
            <TextArea
              className={locals.textArea}
              name={'name'}
              rows="3"
              value={form.get('name').value}
              onChange={e => {
                onChange(['name'], field => field.setValue(e.target.value || '').setTouched(true));
                if (trackTitleChanged) {
                  trackTitleChanged();
                }
              }}
              hasError={hasError(form.get('name'))}
              maxLength={500}
              placeholder={getTitlePlaceholder(form)}
            />
          )
        }
      />
      <PropContainer
        icon={severity <= 5 ? 'lib_events_warning' : 'lib_events_critical'}
        left="Alert Level"
        right={
          isReadOnly ? (
            <Label className={locals.staticSeverity}>{severitySelectOptions[warningIndex].label}</Label>
          ) : (
            <ComboBox
              className={locals.alertLevel}
              name={'severity'}
              value={form.get('severity').value}
              options={severitySelectOptions}
              onChange={({ value = '' }) => {
                onChange(['severity'], field => field.setValue(value).setTouched(true));
                if (trackAlertLevelChanged) {
                  trackAlertLevelChanged();
                }
              }}
              defaultValue={severitySelectOptions[warningIndex].value}
              clearable={false}
            />
          )
        }
      />
      <PropContainer
        icon="lib_events_incident"
        left="Triggers Incident"
        right={
          <Toggle
            checked={Boolean(form.get('triggering').value)}
            onChange={e => {
              onChange(['triggering'], field => field.setValue(e.target.checked || '').setTouched(true));

              if (trackTriggerChanged) {
                trackTriggerChanged();
              }
            }}
            disabled={isReadOnly}
          />
        }
      />
      <PropContainer
        icon="lib_help_error_error_outline"
        left="Description"
        right={
          isReadOnly ? (
            <Label className={locals.staticDescription}>{form.get('description').value}</Label>
          ) : (
            <TextArea
              className={locals.textArea}
              name={'description'}
              rows="3"
              value={form.get('description').value}
              onChange={e => {
                onChange(['description'], field => field.setValue(e.target.value || '').setTouched(true));
                if (trackDescriptionChanged) {
                  trackDescriptionChanged();
                }
              }}
              hasError={hasError(form.get('description'))}
              maxLength={500}
              placeholder={getDescriptionPlaceholder(form)}
            />
          )
        }
      />
    </>
  );
}

AlertProperties.propTypes = {
  form: PropTypes.object.isRequired,
  getDescriptionPlaceholder: PropTypes.func.isRequired,
  getTitlePlaceholder: PropTypes.func.isRequired,
  isReadOnly: PropTypes.bool,
  onChange: PropTypes.func.isRequired,
  trackAlertLevelChanged: PropTypes.func.isRequired,
  trackDescriptionChanged: PropTypes.func,
  trackTitleChanged: PropTypes.func,
  trackTriggerChanged: PropTypes.func
};

function PropContainer({ left, right, icon }) {
  return (
    <div className={locals.propContainer}>
      <div className={locals.leftContent}>
        <div className={locals.iconWrapper}>{icon && <SvgIcon className={locals.icon} type={icon} />}</div>
        <div>{left}</div>
      </div>
      <div className={locals.rightContent}>{right}</div>
    </div>
  );
}

PropContainer.propTypes = {
  icon: PropTypes.string,
  left: PropTypes.node.isRequired,
  right: PropTypes.node.isRequired
};

function hasError(field) {
  return !field.valid && field.touched;
}
