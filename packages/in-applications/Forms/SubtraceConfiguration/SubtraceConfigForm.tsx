/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import classNames from 'classnames';
import React from 'react';

import { FormGroup, Spacer } from '@instana/components';

import { EvaluationGranularityInput } from 'in-applications/Forms/SubtraceConfiguration/components/EvaluationGranularityInput';
import FormFooter, { CancelButton, DeleteButton, SaveButton } from 'in-components/form/FormFooter/FormFooter';
import { SubtraceNameInput } from 'in-applications/Forms/SubtraceConfiguration/components/SubtraceNameInput';
import { ApplicationQueryBuilderInput } from 'in-applications/Forms/shared/ApplicationQueryBuilderInput';
import { toBackendQueryModel } from 'in-components/QueryBuilder/transformation/backendQueryModel';
import { NewSubtraceConfig, SubtraceConfig, SubtraceFormFields } from 'in-applications/types';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { createSubtrace, updateSubtrace } from 'in-applications/api/subtraces';
import { addMessage } from 'in-components/MessageFlyout/stores/messages';
import { useSubtraceForm } from 'in-applications/hooks/useSubtraceForm';
import { Subtrace } from 'in-applications/lists/SubtracesList';
import { close } from 'in-components/DialogPresenter/store';
import useFormSubmission from 'in-hooks/useFormSubmission';
import Form from 'in-components/form/binding/Form';
import { t } from 'in-i18n';

import locals from 'in-applications/Forms/SubtraceConfiguration/SubtraceConfigForm.mless';

interface SubmitConfigForm {
  subtrace?: Subtrace;
}

export const SubtraceConfigForm = ({ subtrace }: SubmitConfigForm) => {
  const isNew = !subtrace;
  const { form, updateForm, resetForm, isFormValid } = useSubtraceForm(subtrace);
  const submitAction = isNew ? createSubtrace : updateSubtrace;
  const [formSubmitStatus, doSubmit] = useFormSubmission(submitAction);

  const subtraceName = form.get('name').value;
  const disabled = !form.hierarchyTouched || formSubmitStatus === 'pending';

  const onSubmit = () => {
    const payload: any = normalizeFormData(form, subtrace?.id);

    doSubmit({
      payload,
      onSuccess: () => onSaveSuccess(subtraceName, isNew),
      onError: () => onSaveFailure(subtraceName, isNew)
    });
  };
  const updateName = (e: React.ChangeEvent<HTMLInputElement>) =>
    updateForm(form.updateIn(['name'], field => field.setValue(e.target.value || '').setTouched(true)));

  const updateTagFilterExpression = (tagFilterExpression: FormModelElement[]) =>
    updateForm(form.updateIn(['tagFilterExpression'], field => field.setValue(tagFilterExpression).setTouched(true)));

  const updateEvaluationGranularity = (granularity: number) =>
    updateForm(form.updateIn(['evaluationGranularitySeconds'], field => field.setValue(granularity).setTouched(true)));

  return (
    <>
      <div className={classNames({ [locals.dialog]: isNew })}>
        <Form form={form} setForm={() => updateForm(form)} onSubmit={onSubmit}>
          <FormGroup>
            <SubtraceNameInput value={subtraceName} onChange={updateName} />
            <Spacer vertical="large" />
            <ApplicationQueryBuilderInput
              label={t('in-applications:subtraces.configuration.subtraceFilter')}
              value={form.get('tagFilterExpression').value}
              onChange={updateTagFilterExpression}
            />
            <Spacer vertical="large" />
            <EvaluationGranularityInput
              value={form.get('evaluationGranularitySeconds').value}
              onChangeGranularity={updateEvaluationGranularity}
            />
          </FormGroup>
        </Form>
      </div>
      <FormFooter withoutCarbonLayer className={classNames({ [locals.formFooter]: !isNew })}>
        {!isNew && (
          <DeleteButton
            onClick={() => {
              // TODO: implement delete with redirection to ???
            }}
            form={form}
            isDeleting={false}
            icon="lib_actions_delete"
          />
        )}
        <div>
          <CancelButton onClick={() => (!isNew ? resetForm() : close())} disabled={!isNew && disabled} />
          <SaveButton
            form={form}
            isSaving={formSubmitStatus === 'pending'}
            disabled={!isFormValid || disabled}
            onClick={onSubmit}
          />
        </div>
      </FormFooter>
    </>
  );
};

function onSaveSuccess(subtraceName: string, isNew: boolean) {
  const action = isNew ? 'created' : 'updated';
  addMessage(
    {
      type: 'info',
      timeout: 4000,
      title: t('in-applications:subtraces.configuration.success.title'),
      content: t('in-applications:subtraces.configuration.success.message', { subtraceName, action })
    },
    'save-subtrace-success'
  );
  if (isNew) close();
}

function onSaveFailure(subtraceName: string, isNew: boolean) {
  const action = isNew ? 'create' : 'update';
  addMessage(
    {
      type: 'danger',
      timeout: 4000,
      title: t('in-applications:subtraces.configuration.failure.title'),
      content: t('in-applications:subtraces.configuration.failure.message', { subtraceName, action })
    },
    'save-subtrace-failure'
  );
}

function normalizeFormData(form: MapForm<SubtraceFormFields>, subtraceId?: string): SubtraceConfig | NewSubtraceConfig {
  const subtrace = form.toJS();
  const normalizedSubtrace = { ...subtrace, tagFilterExpression: toBackendQueryModel(subtrace.tagFilterExpression) };

  if (!subtraceId) return normalizedSubtrace as NewSubtraceConfig;

  (normalizedSubtrace as SubtraceConfig).id = subtraceId;
  return normalizedSubtrace;
}
