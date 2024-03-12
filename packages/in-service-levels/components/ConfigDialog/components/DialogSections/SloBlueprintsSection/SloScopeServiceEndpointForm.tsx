/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useContext } from 'react';

import EndpointSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/EndpointSelectBox';
import ServiceSelectBox from 'in-service-levels/components/ConfigDialog/components/DialogSections/SloScopeSection/ServiceSelectBox';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

// type Props = {}

export default function SloScopeServiceEndpointForm() {
  const { form, mode, onChange } = useContext(SloFormContext);
  const applicationIdField = form.getIn(['entity', 'entityId']);
  const endpointIdField = form.getIn(['scope', 'endpointId']);
  const boundaryField = form.getIn(['scope', 'boundaryScope']);
  const isFormInEditMode = mode === 'EDIT';
  const serviceIdField = form.getIn(['scope', 'serviceId']);

  return (
    <>
      <ServiceSelectBox
        applicationId={applicationIdField.value}
        boundaryScope={boundaryField.value}
        disabled={isFormInEditMode}
        hasError={!serviceIdField.valid && serviceIdField.touched}
        onChange={value => onChange(['scope', 'serviceId'], () => serviceIdField.setValue(value!).setTouched(true))}
        value={serviceIdField.value}
      />
      <EndpointSelectBox
        applicationId={applicationIdField.value}
        boundaryScope={boundaryField.value}
        disabled={isFormInEditMode}
        hasError={!endpointIdField.valid && endpointIdField.touched}
        onChange={value => onChange(['scope', 'endpointId'], () => endpointIdField.setValue(value).setTouched(true))}
        serviceId={serviceIdField.value}
        value={endpointIdField.value}
      />
    </>
  );
}
