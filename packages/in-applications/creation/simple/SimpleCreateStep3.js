/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Spacer from 'in-applications/Forms/components/Spacer';
import { error } from 'in-new-components/Message/types';
import FormGroup from 'in-components/form/FormGroup';
import Message from 'in-new-components/Message';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep3({ form, updateForm, servicesLiveList, selectedBlueprint, errorMessage }) {
  const labelField = form.get('label');

  return (
    <SimpleModeStepContentWrapper headline="What is the name of this Application Perspective?">
      <div className={locals.filterWrapper}>
        <FormGroup>
          <Label htmlFor="label" hasError={!labelField.valid && labelField.touched}>
            Application Perspective Name
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
        <Spacer type="dark" />
        <Label>Are you interested just in the calls to this application, or also the internal calls?</Label>
        <InboundAllCalls form={form} updateForm={updateForm} selectedBlueprint={selectedBlueprint} />
      </div>
      <ServiceLiveList servicesLiveList={servicesLiveList} headerText="Matched services in the last hour" />
    </SimpleModeStepContentWrapper>
  );
}
