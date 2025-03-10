/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { InfraAlertEvaluationType } from '@instana/types/typeDefinitions';

import CustomOrPerEntityOption from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CustomOrPerEntityOption';
import { perEntityInfraSmartAlertsEnabled } from 'in-services/featureFlags';
import Section from 'in-components/workspace/Section';
import { Col, Row } from 'in-components/layout/Grid';
import { t } from 'in-i18n';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

export default function ScopeAlertEvaluation({ form, updateForm }: Props) {
  if (!perEntityInfraSmartAlertsEnabled) {
    return null;
  }

  const evaluationType = (form.get('evaluationType') as Field<InfraAlertEvaluationType>).value;

  const onEvaluationTypeChange = (evaluationType: InfraAlertEvaluationType) => {
    updateForm(
      form.updateIn(['evaluationType'], f =>
        (f as Field<InfraAlertEvaluationType>).setValue(evaluationType).setTouched(true)
      )
    );
  };

  return (
    <Section title={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.evaluationType.title')}>
      <div>
        <Row>
          <Col lg={6} md={6}>
            <CustomOrPerEntityOption
              evaluationType="CUSTOM"
              selectedEvaluationType={evaluationType}
              onChange={() => onEvaluationTypeChange('CUSTOM')}
            />
          </Col>
          <Col lg={6} md={6}>
            <CustomOrPerEntityOption
              evaluationType="PER_ENTITY"
              selectedEvaluationType={evaluationType}
              onChange={() => onEvaluationTypeChange('PER_ENTITY')}
            />
          </Col>
        </Row>
      </div>
    </Section>
  );
}
