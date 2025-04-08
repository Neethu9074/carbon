/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer } from '@instana/components';
import { Result } from '@instana/types';

import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import ErroneousResultPresenter from 'in-components/Errors/ErroneousResultPresenter/ErroneousResultPresenter';
import CopyActionStepForm from 'in-automation/AutomationCard/GenerateAI/CopyActionStepForm';

export default function CopyActionStep({
  form,
  setForm,
  result,
  resultUrl,
  setResultUrl
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
  result: Result<any> | null;
  resultUrl: Result<any> | null;
  setResultUrl: React.Dispatch<React.SetStateAction<Result<any> | null>>;
}) {
  const actionForm = form.get('action');
  const exportForm = form.get('export');

  return (
    <div>
      <ErroneousResultPresenter errors={result?.errors} />

      {resultUrl?.errors && (
        <>
          <Spacer vertical="small" />
          <ErroneousResultPresenter errors={resultUrl?.errors} />
        </>
      )}
      <Spacer vertical="small" />
      <CopyActionStepForm
        form={actionForm}
        exportForm={exportForm}
        setExportForm={exportForm => setForm(form => form.updateIn(['export'], exportForm))}
        setForm={actionForm => setForm(form => form.updateIn(['action'], actionForm))}
        setResultUrl={setResultUrl}
      />
    </div>
  );
}
