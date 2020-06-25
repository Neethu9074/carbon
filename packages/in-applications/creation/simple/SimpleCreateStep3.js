import React from 'react';

import SimpleModeStepContentWrapper from 'in-new-components/BlueprintFormMultistep/SimpleModeStepContentWrapper';
import ApplicationScopeSelector from 'in-applications/creation/components/ApplicationScopeSelector';
import InboundAllCalls from 'in-applications/creation/components/InboundAllCalls';
import Spacer from 'in-applications/Forms/components/Spacer';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';

import locals from './SimpleCreateStep2.mless';

export default function SimpleCreateStep3({ form, updateForm }) {
  const labelField = form.get('label');

  return (
    <SimpleModeStepContentWrapper headline="Final configuration">
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
        <Spacer type="dark" />
        <InboundAllCalls form={form} updateForm={updateForm} />
        <Spacer type="dark" />
        <ApplicationScopeSelector form={form} updateForm={updateForm} />
      </div>
    </SimpleModeStepContentWrapper>
  );
}
