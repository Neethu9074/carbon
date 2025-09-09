/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import { areFieldsValid } from 'in-automation/utils/form';

export function useValidateSelectManual({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  return () =>
    new Promise<void>((resolve, reject) => {
      const updatedForm = form.updateIn(['prompt', 'selectedManualStep'], item => item.setTouched(true));
      setForm(updatedForm);
      // const promptForm = updatedForm.getIn(['prompt', 'selectedManualStep']);
      const disableSubmit = !areFieldsValid(updatedForm, [['prompt', 'selectedManualStep']]);
      if (disableSubmit) reject();
      else resolve();
    });
}
