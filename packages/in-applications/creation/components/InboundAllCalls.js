/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import { applicationCreationBoundaryScopeSelect } from 'in-applications/creation/tracker';
import FormGroup from 'in-components/form/FormGroup';

import locals from './InboundAllCalls.mless';

export default function InboundAllCalls({ form, updateForm }) {
  const boundaryScopeField = form.get('boundaryScope');

  return (
    <div className={locals.inboundOrAllCallsSwitchContainer}>
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
