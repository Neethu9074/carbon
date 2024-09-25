/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { APPLICATION_CREATION_SCOPE_SELECT } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import OptionBox from 'in-applications/components/OptionBox';
import FormGroup from 'in-components/form/FormGroup';
import { t } from 'in-i18n';

import locals from './ApplicationScopeSelector.mless';

export default function ApplicationScopeSelector({ form, updateForm, maxScope = 'INCLUDE_ALL_DOWNSTREAM' }) {
  const scopeField = form.get('scope');
  const { trackCta } = useSegmentTracking();
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
            trackCta(APPLICATION_CREATION_SCOPE_SELECT, { scope: 'INCLUDE_NO_DOWNSTREAM' });
            updateForm(form.updateIn(['scope'], field => field.setValue('INCLUDE_NO_DOWNSTREAM').setTouched(true)));
          }}
        />
        {(maxScope === 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING' ||
          maxScope === 'INCLUDE_ALL_DOWNSTREAM') && (
          <OptionBox
            className={classNames({
              [locals.optionBox]: true,
              [locals.optionBoxUnchecked]: scopeField.value !== 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'
            })}
            title={t('in-applications:creation.scope.optionImmediateDownstreamServices')}
            asRadioButton
            checked={scopeField.value == 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'}
            onChange={() => {
              trackCta(APPLICATION_CREATION_SCOPE_SELECT, {
                scope: 'INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING'
              });
              updateForm(
                form.updateIn(['scope'], field =>
                  field.setValue('INCLUDE_IMMEDIATE_DOWNSTREAM_DATABASE_AND_MESSAGING').setTouched(true)
                )
              );
            }}
          />
        )}
        {maxScope === 'INCLUDE_ALL_DOWNSTREAM' && (
          <OptionBox
            className={classNames({
              [locals.optionBox]: true,
              [locals.optionBoxUnchecked]: scopeField.value !== 'INCLUDE_ALL_DOWNSTREAM'
            })}
            title={t('in-applications:creation.scope.optionAllDownstreamServices')}
            asRadioButton
            checked={scopeField.value == 'INCLUDE_ALL_DOWNSTREAM'}
            onChange={() => {
              trackCta(APPLICATION_CREATION_SCOPE_SELECT, { scope: 'INCLUDE_ALL_DOWNSTREAM' });
              updateForm(form.updateIn(['scope'], field => field.setValue('INCLUDE_ALL_DOWNSTREAM').setTouched(true)));
            }}
          />
        )}
      </FormGroup>
    </div>
  );
}
