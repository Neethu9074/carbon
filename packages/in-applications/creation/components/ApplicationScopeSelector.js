import React, { useEffect } from 'react';
import classNames from 'classnames';

import { applicationCreationScopeSelect } from 'in-applications/creation/tracker';
import OptionBox from 'in-applications/components/OptionBox';
import FormGroup from 'in-components/form/FormGroup';

import locals from './ApplicationScopeSelector.mless';

export default function ApplicationScopeSelector({ form, updateForm, description, selectedBlueprint }) {
  const scopeField = form.get('scope');
  const applicationScope = selectedBlueprint?.presetFormFields?.applicationScope;
  useEffect(() => {
    if (applicationScope) {
      updateForm(form.updateIn(['scope'], field => field.setValue(applicationScope).setTouched(true)));
    }
  }, [applicationScope]);

  return (
    <div>
      <FormGroup>
        {description && description}
        <OptionBox
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: scopeField.value !== 'INCLUDE_NO_DOWNSTREAM'
          })}
          title="No downstream services"
          asRadioButton
          checked={scopeField.value == 'INCLUDE_NO_DOWNSTREAM'}
          onChange={() => {
            applicationCreationScopeSelect({ scope: 'INCLUDE_NO_DOWNSTREAM' });
            updateForm(form.updateIn(['scope'], field => field.setValue('INCLUDE_NO_DOWNSTREAM').setTouched(true)));
          }}
        />
        <OptionBox
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: scopeField.value !== 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'
          })}
          title="Immediate downstream database and messaging services"
          asRadioButton
          checked={scopeField.value == 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'}
          onChange={() => {
            applicationCreationScopeSelect({ scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING' });
            updateForm(
              form.updateIn(['scope'], field =>
                field.setValue('INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING').setTouched(true)
              )
            );
          }}
        />
        <OptionBox
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: scopeField.value !== 'INCLUDE_ALL_DOWNSTREAM'
          })}
          title="All downstream services"
          asRadioButton
          checked={scopeField.value == 'INCLUDE_ALL_DOWNSTREAM'}
          onChange={() => {
            applicationCreationScopeSelect({ scope: 'INCLUDE_ALL_DOWNSTREAM' });
            updateForm(form.updateIn(['scope'], field => field.setValue('INCLUDE_ALL_DOWNSTREAM').setTouched(true)));
          }}
        />
      </FormGroup>
    </div>
  );
}
