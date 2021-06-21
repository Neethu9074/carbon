/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer } from '@instana/components';

import SimpleModeStepContentWrapper from 'in-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import { error } from 'in-components/Message/types';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import Message from 'in-components/Message';
import { t } from 'in-i18n';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep3({
  form,
  updateForm,
  servicesLiveList,
  selectedBlueprint,
  errorMessage,
  isValidTagFilterExpression
}) {
  const labelField = form.get('label');

  return (
    <SimpleModeStepContentWrapper headline={t('in-applications:creation.simple.step3.headline')}>
      <div className={locals.filterWrapper}>
        <FormGroup>
          <Label htmlFor="label" hasError={!labelField.valid && labelField.touched}>
            {t('in-applications:creation.simple.step3.apName')}
          </Label>
          <Input
            type="text"
            id="label"
            value={labelField.value}
            onChange={e =>
              updateForm(form.updateIn(['label'], field => field.setValue(e.target.value || '').setTouched(true)))
            }
            autoComplete="off"
            hasError={(!labelField.valid || errorMessage) && labelField.touched}
            autoFocus
          />
        </FormGroup>
        <TouchedMessages field={labelField} />
        {errorMessage && (
          <Message type={error} withIcon small>
            {errorMessage}
          </Message>
        )}
        <Spacer vertical="normal" />
        <Label>{t('in-applications:creation.simple.step3.inboundAllCalls')}</Label>
        <InboundAllCalls form={form} updateForm={updateForm} selectedBlueprint={selectedBlueprint} />
      </div>
      <ServiceLiveList
        servicesLiveList={servicesLiveList}
        headerText={t('in-applications:creation.simple.liveList.matchedServicesLastHour')}
        isValidTagFilterExpression={isValidTagFilterExpression}
      />
    </SimpleModeStepContentWrapper>
  );
}
