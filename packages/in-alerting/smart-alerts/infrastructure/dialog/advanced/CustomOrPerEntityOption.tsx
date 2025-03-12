/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { InfraAlertEvaluationType } from '@instana/types/typeDefinitions';
import { RadioButton } from '@instana/components';

import LabelDescriptionWithIcon from 'in-alerting/smart-alerts/applications/dialog/advanced/InboundOutboundCallsSwitch/LabelDescriptionWithIcon';
import { t } from 'in-i18n';

interface Props {
  evaluationType: InfraAlertEvaluationType;
  selectedEvaluationType: InfraAlertEvaluationType;
  onChange: (evaluationType: InfraAlertEvaluationType) => void;
}

export default function CustomOrPerEntityOption({ evaluationType, selectedEvaluationType, onChange }: Props) {
  const { title, description } = evaluationTypes.info[evaluationType];

  return (
    <RadioButton
      key={title}
      label={<LabelDescriptionWithIcon label={title} description={description} />}
      checked={selectedEvaluationType === evaluationType}
      onChange={() => onChange(evaluationType)}
    />
  );
}

export const customEvaluationType: InfraAlertEvaluationType = 'CUSTOM';
export const perEntityEvaluationType: InfraAlertEvaluationType = 'PER_ENTITY';

export const evaluationTypes = {
  custom: customEvaluationType,
  perEntity: perEntityEvaluationType,

  info: {
    CUSTOM: {
      title: t('in-alerting:smartAlerts.infrastructure.evaluationType.custom.title'),
      description: t('in-alerting:smartAlerts.infrastructure.evaluationType.custom.description')
    },
    PER_ENTITY: {
      title: t('in-alerting:smartAlerts.infrastructure.evaluationType.perEntity.title'),
      description: t('in-alerting:smartAlerts.infrastructure.evaluationType.perEntity.description')
    }
  }
};
