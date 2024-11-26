/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { CarbonForm, CarbonStack } from '@instana/components';

import { EvaluationGranularityInput } from 'in-applications/Forms/SubtraceConfiguration/components/EvaluationGranularityInput';
import { SubtraceNameInput } from 'in-applications/Forms/SubtraceConfiguration/components/SubtraceNameInput';
import { ApplicationQueryBuilderInput } from 'in-applications/Forms/shared/ApplicationQueryBuilderInput';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { SubtraceFormFields } from 'in-applications/types';
import { t } from 'in-i18n';

interface SubmitConfigFormProps {
  form: MapForm<SubtraceFormFields>;
  updateForm: React.Dispatch<React.SetStateAction<MapForm<SubtraceFormFields>>>;
}

export const SubtraceConfigForm = ({ form, updateForm }: SubmitConfigFormProps) => {
  const subtraceName = form.get('name').value;
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm(form.updateIn(['name'], field => field.setValue(e.target.value || '').setTouched(true)));

  const updateTagFilterExpression = (tagFilterExpression: FormModelElement[]) =>
    updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression).setTouched(true)));

  const updateEvaluationGranularity = (granularity: number) =>
    updateForm(form.updateIn(['evaluationGranularitySeconds'], field => field.setValue(granularity).setTouched(true)));

  return (
    <CarbonForm title="subtrace-config-form">
      <CarbonStack gap={6}>
        <SubtraceNameInput value={subtraceName} onChange={updateName} />
        <div>
          <ApplicationQueryBuilderInput
            label={t('in-applications:subtraces.configuration.subtraceFilter')}
            value={form.get('tagFilterExpression').value}
            onChange={updateTagFilterExpression}
          />
        </div>
        <EvaluationGranularityInput
          evaluationGranularity={form.get('evaluationGranularitySeconds').value}
          onChangeGranularity={value => updateEvaluationGranularity(value)}
        />
      </CarbonStack>
    </CarbonForm>
  );
};
