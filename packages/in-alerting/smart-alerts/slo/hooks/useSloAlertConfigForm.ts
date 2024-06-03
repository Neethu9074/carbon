/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { useEffect, useState } from 'react';

import { ServiceLevelsAlertConfig } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import useSloAlertFormSideEffects, {
  SloAlertFormSideEffectsReturnType
} from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormSideEffects';
import { SloAlertForm, createSloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import useSloAlertEntityType from 'in-alerting/smart-alerts/slo/hooks/useSloAlertEntityType';

export default function useSloAlertConfigForm(
  alertConfig: ServiceLevelsAlertConfig
): [SloAlertForm, SloAlertFormSideEffectsReturnType] {
  const [entityType, , , progress] = useSloAlertEntityType(alertConfig.sloIds);
  const [form, setForm] = useState(() => createSloAlertForm(alertConfig));
  const updateForm = useSloAlertFormSideEffects(form, setForm);

  useEffect(() => {
    if (progress.loading) return;

    updateForm(form.updateIn(['entityType'], field => field.setValue(entityType ?? 'application')));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [generateStableHash({ progress, entityType })]);

  return [form, updateForm];
}
