/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import InboundOrAllCallsChoiceVertical from 'in-applications/Dashboards/commonComponents/inboundOrAllCalls/InboundOrAllCallsChoiceVertical';
import { APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import FormGroup from 'in-components/form/FormGroup';

import locals from './InboundAllCalls.mless';

interface InboundAllCallsProps {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}
export default function InboundAllCalls({ form, updateForm }: InboundAllCallsProps): JSX.Element {
  const boundaryScopeField = form.get('boundaryScope');
  const { trackCta } = useSegmentTracking();

  return (
    <div className={locals.inboundOrAllCallsSwitchContainer}>
      <FormGroup>
        <InboundOrAllCallsChoiceVertical
          boundaryScope={boundaryScopeField.value}
          onBoundaryStateChange={value => {
            trackCta(APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT, { value });
            updateForm(
              form.updateIn(['boundaryScope'], field =>
                (field as Field<string>).setValue(value.boundaryScope).setTouched(true)
              )
            );
          }}
        />
      </FormGroup>
    </div>
  );
}
