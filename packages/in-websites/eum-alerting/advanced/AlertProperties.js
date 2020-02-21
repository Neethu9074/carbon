import PropTypes from 'prop-types';
import React from 'react';

import {
  websitesAlertingAdditionalPropsTitleChanged,
  websitesAlertingAdditionalPropsAlertLevelChanged,
  websitesAlertingAdditionalPropsTriggerChanged,
  websitesAlertingAdditionalPropsDescriptionChanged
} from 'in-websites/eum-alerting/tracker';
import { getTitlePlaceholder, getDescriptionPlaceholder } from 'in-websites/eum-alerting/formHelpers';
import { fieldNames, selectOptions } from 'in-websites/eum-alerting/form/alertDialogFormDefinition';
import ComboBox from 'in-components/ComboBox/ComboBox';
import Toggle from 'in-components/form/Toggle/Toggle';
import SvgIcon from 'in-components/SvgIcon/SvgIcon';
import TextArea from 'in-components/form/TextArea';
import Label from 'in-components/form/Label';

import locals from './AlertProperties.mless';

export default function AlertProperties({ form, onChange, isReadOnly }) {
  const severity = +form.get(fieldNames.severity).value;

  return (
    <>
      <PropContainer
        left="Title"
        right={
          isReadOnly ? (
            <Label className={locals.staticTitle}>{form.get(fieldNames.name).value}</Label>
          ) : (
            <TextArea
              className={locals.textArea}
              name={fieldNames.name}
              rows="3"
              value={form.get(fieldNames.name).value}
              onChange={e => {
                onChange(form, fieldNames.name, (e && e.target.value) || '');
                websitesAlertingAdditionalPropsTitleChanged();
              }}
              hasError={hasError(form.get(fieldNames.name))}
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
            <Label className={locals.staticSeverity}>{selectOptions[fieldNames.severity][0].label}</Label>
          ) : (
            <ComboBox
              className={locals.alertLevel}
              name={fieldNames.severity}
              value={form.get(fieldNames.severity).value}
              options={selectOptions[fieldNames.severity]}
              onChange={e => {
                onChange(form, fieldNames.severity, (e && e.value) || '');
                websitesAlertingAdditionalPropsAlertLevelChanged();
              }}
              defaultValue={selectOptions[fieldNames.severity][0].value}
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
            checked={form.get(fieldNames.triggering).value}
            onChange={e => {
              onChange(form, fieldNames.triggering, (e && e.target.checked) || false);
              websitesAlertingAdditionalPropsTriggerChanged();
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
            <Label className={locals.staticDescription}>{form.get(fieldNames.description).value}</Label>
          ) : (
            <TextArea
              className={locals.textArea}
              name={fieldNames.description}
              rows="3"
              value={form.get(fieldNames.description).value}
              onChange={e => {
                onChange(form, fieldNames.description, (e && e.target.value) || '');
                websitesAlertingAdditionalPropsDescriptionChanged();
              }}
              hasError={hasError(form.get(fieldNames.description))}
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
  onChange: PropTypes.func.isRequired,
  websiteLabel: PropTypes.string.isRequired
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

function hasError(field) {
  return !field.valid && field.touched;
}
