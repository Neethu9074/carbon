/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Col, Row } from 'in-new-components/layout/Grid';

import locals from './InboundOrAllCallsSwitch.mless';

export default function IncludeInternalOrSyntheticCallsSwitch({ form, updateForm }) {
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  return (
    <div className={locals.container}>
      <Row>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={'Include Internal Calls'}
            checked={includeInternal}
            onChange={() => updateFieldAndTriggerThresholdCalculation('includeInternal', !includeInternal)}
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={'Include Synthetic Calls'}
            checked={includeSynthetic}
            onChange={() => updateFieldAndTriggerThresholdCalculation('includeSynthetic', !includeSynthetic)}
          />
        </Col>
      </Row>
    </div>
  );

  function updateFieldAndTriggerThresholdCalculation(fieldName, newValue) {
    updateForm(
      form
        .updateIn([fieldName], f => f.setValue(newValue).setTouched(true))
        .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => f.setValue(true))
    );
  }
}
