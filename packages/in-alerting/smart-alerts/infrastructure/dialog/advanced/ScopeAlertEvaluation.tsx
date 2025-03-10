/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, MapForm } from 'formalistic';
import React from 'react';

import { InfraAlertEvaluationType } from '@instana/types/typeDefinitions';
import { Stack } from '@instana/components';

import CustomOrPerEntityOption from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/CustomOrPerEntityOption';
import { perEntityInfraSmartAlertsEnabled } from 'in-services/featureFlags';
import AlertTypography from 'in-alerting/components/AlertTypography';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

interface Props {
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
  SectionWrapper?: React.FunctionComponent<any>;
}

export default function ScopeAlertEvaluation({ form, updateForm, SectionWrapper = Section }: Props) {
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
    <SectionWrapper
      title={
        <AlertTypography
          variant="body-regular"
          color="color900"
          content={t('in-alerting:smartAlerts.infrastructure.evaluationType.title')}
        />
      }
    >
      <Stack direction="horizontal">
        <CustomOrPerEntityOption
          evaluationType="CUSTOM"
          selectedEvaluationType={evaluationType}
          onChange={() => onEvaluationTypeChange('CUSTOM')}
        />
        <CustomOrPerEntityOption
          evaluationType="PER_ENTITY"
          selectedEvaluationType={evaluationType}
          onChange={() => onEvaluationTypeChange('PER_ENTITY')}
        />
      </Stack>
    </SectionWrapper>
  );
}
