/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import { areFieldsValid } from 'in-automation/utils/form';

export function useGenerateScript({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  return () =>
    new Promise<void>((resolve, reject) => {
      const updatedForm = form
        .updateIn(['prompt', 'interpreterType'], item => item.setTouched(true))
        .updateIn(['prompt', 'promptStep'], item => item.setTouched(true))
        .updateIn(['action', 'aiGeneratedContent'], item => item.setTouched(true));
      setForm(updatedForm);
      const disableSubmit = !areFieldsValid(updatedForm, [
        ['prompt', 'interpreterType'],
        ['prompt', 'promptStep'],
        ['action', 'aiGeneratedContent']
      ]);
      if (disableSubmit) reject();
      else resolve();
    });
}
