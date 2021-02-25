/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';
import classNames from 'classnames';
import { t } from 'in-i18n';

import { applicationCreationScopeSelect } from 'in-applications/creation/tracker';
import OptionBox from 'in-applications/components/OptionBox';
import FormGroup from 'in-components/form/FormGroup';

import locals from './ApplicationScopeSelector.mless';

export default function ApplicationScopeSelector({ form, updateForm }) {
  const scopeField = form.get('scope');

  return (
    <div className={locals.applicationScopeSwitchContainer}>
      <FormGroup withoutBottomMargin>
        <OptionBox
          className={classNames({
            [locals.optionBox]: true,
            [locals.optionBoxUnchecked]: scopeField.value !== 'INCLUDE_NO_DOWNSTREAM'
          })}
          title={t('in-applications:creation.scope.optionNoDownStreamServices')}
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
          title={t('in-applications:creation.scope.optionImmediateDownstreamServices')}
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
          title={t('in-applications:creation.scope.optionAllDownstreamServices')}
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
