import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import ServiceLiveList from 'in-applications/creation/components/ServiceLiveList';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Spacer from 'in-applications/Forms/components/Spacer';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep3({ form, updateForm, servicesLiveList, matchSpecification }) {
  const labelField = form.get('label');

  return (
    <SimpleModeStepContentWrapper headline="Configuration Details">
      <div className={locals.filterWrapper}>
        <FormGroup>
          <Label htmlFor="label" hasError={!labelField.valid && labelField.touched}>
            Name your new Application Perspective
          </Label>
          <Input
            type="text"
            id="label"
            value={labelField.value}
            onChange={e =>
              updateForm(form.updateIn(['label'], field => field.setValue(e.target.value || '').setTouched(true)))
            }
            autoComplete="off"
            hasError={!labelField.valid && labelField.touched}
            autoFocus
          />
        </FormGroup>
        <TouchedMessages field={labelField} />
        <Spacer type="dark" />
        <Label>Select the default dashboard view</Label>
        <InboundAllCalls form={form} updateForm={updateForm} apCreation />
      </div>
      <ServiceLiveList
        servicesLiveList={servicesLiveList}
        headerText="Services in this Application Perspective..."
        descriptionText="Not impacted by settings in this step."
        matchSpecification={matchSpecification}
      />
    </SimpleModeStepContentWrapper>
  );
}
