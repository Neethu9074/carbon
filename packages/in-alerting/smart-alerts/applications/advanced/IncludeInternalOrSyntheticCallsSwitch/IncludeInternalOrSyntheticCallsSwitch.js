/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import CheckboxFancy from 'in-components/form/CheckboxFancy';
import { Col, Row } from 'in-new-components/layout/Grid';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/applications/advanced/IncludeInternalOrSyntheticCallsSwitch/InboundOrAllCallsSwitch.mless';

export default function IncludeInternalOrSyntheticCallsSwitch({ form, updateForm }) {
  const includeInternal = form.get('includeInternal').value;
  const includeSynthetic = form.get('includeSynthetic').value;
  return (
    <div className={locals.container}>
      <Row>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={t(
              'in-alerting:smartAlerts.applications.advanced.includeInternalOrSynthethicCalls.includeInternalCalls'
            )}
            checked={includeInternal}
            onChange={() => updateField('includeInternal', !includeInternal)}
          />
        </Col>
        <Col lg={6} className={locals.column}>
          <CheckboxFancy
            label={t(
              'in-alerting:smartAlerts.applications.advanced.includeInternalOrSynthethicCalls.includeSyntethicCalls'
            )}
            checked={includeSynthetic}
            onChange={() => updateField('includeSynthetic', !includeSynthetic)}
          />
        </Col>
      </Row>
    </div>
  );

  function updateField(fieldName, newValue) {
    updateForm(form.updateIn([fieldName], f => f.setValue(newValue).setTouched(true)));
  }
}
