import React from 'react';

import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import { applicationCreationBoundaryScopeSelect } from 'in-applications/creation/tracker';
import FormGroup from 'in-components/form/FormGroup';

export default function InboundAllCalls({ form, updateForm, apCreation }) {
  const boundaryScopeField = form.get('boundaryScope');

  return (
    <div>
      <FormGroup>
        <InboundOrAllCallsChoiceVertical
          boundaryScope={boundaryScopeField.value}
          onBoundaryStateChange={value => {
            applicationCreationBoundaryScopeSelect({ value });
            updateForm(form.updateIn(['boundaryScope'], field => field.setValue(value.boundaryScope).setTouched(true)));
          }}
          apCreation={apCreation}
        />
      </FormGroup>
    </div>
  );
}
