import React, { useEffect } from 'react';

import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import { applicationCreationBoundaryScopeSelect } from 'in-applications/creation/tracker';
import FormGroup from 'in-components/form/FormGroup';

export default function InboundAllCalls({ form, updateForm, selectedBlueprint }) {
  const boundaryScopeField = form.get('boundaryScope');
  const boundaryScope = selectedBlueprint?.presetFormFields.boundaryScope;
  if (boundaryScope)
    useEffect(() => {
      updateForm(form.updateIn(['boundaryScope'], field => field.setValue(boundaryScope).setTouched(true)));
    }, []);

  return (
    <div>
      <FormGroup>
        <InboundOrAllCallsChoiceVertical
          boundaryScope={boundaryScopeField.value}
          onBoundaryStateChange={value => {
            applicationCreationBoundaryScopeSelect({ value });
            updateForm(form.updateIn(['boundaryScope'], field => field.setValue(value.boundaryScope).setTouched(true)));
          }}
        />
      </FormGroup>
    </div>
  );
}
