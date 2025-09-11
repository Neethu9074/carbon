/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */
import { GenerateAIScriptActionForm } from 'in-automation/AutomationCard/GenerateAI/GenerateScriptAction/useGenerateAIScriptActionForm';
import { areFieldsValid } from 'in-automation/utils/form';

export function useValidateCopyActionStep({
  form,
  setForm
}: {
  form: GenerateAIScriptActionForm;
  setForm: React.Dispatch<React.SetStateAction<GenerateAIScriptActionForm>>;
}) {
  return () =>
    new Promise<void>((resolve, reject) => {
      const exportType = form.get('export').get('exportType').value;
      if (exportType === 'internal') {
        const updatedForm = form
          .updateIn(['action', 'name'], item => item.setTouched(true))
          .updateIn(['action', 'description'], item => item.setTouched(true))
          .updateIn(['action', 'script'], item => item.setTouched(true));
        setForm(updatedForm);
        const disableSubmit = !areFieldsValid(updatedForm, [
          ['action', 'name'],
          ['action', 'description'],
          ['action', 'script']
        ]);
        if (disableSubmit) reject();
        else resolve();
      } else if (exportType === 'github' || exportType === 'gitlab') {
        const updatedForm = form
          .updateIn(['export', 'agent'], item => item.setTouched(true))
          .updateIn(['export', 'repository'], item => item.setTouched(true))
          .updateIn(['export', 'branch'], item => item.setTouched(true))
          .updateIn(['export', 'file_path'], item => item.setTouched(true))
          .updateIn(['export', 'message'], item => item.setTouched(true))
          .updateIn(['action', 'script'], item => item.setTouched(true));
        setForm(updatedForm);
        const disableSubmit = !areFieldsValid(updatedForm, [
          ['export', 'agent'],
          ['export', 'repository'],
          ['export', 'branch'],
          ['export', 'file_path'],
          ['export', 'message'],
          ['action', 'script']
        ]);
        if (disableSubmit) reject();
        else resolve();
      }
    });
}
