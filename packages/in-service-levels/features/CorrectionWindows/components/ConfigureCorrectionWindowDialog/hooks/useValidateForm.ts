/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useContext } from 'react';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';

export default function useValidateForm() {
  const { form, updateForm } = useContext(CorrectionWindowFormContext);
  return () =>
    new Promise<void>((resolve, reject) => {
      const validatedForm = form.setTouched(true, { recurse: true });
      updateForm(validatedForm);
      const disableSubmit = !validatedForm.hierarchyValid && validatedForm.hierarchyTouched;
      if (disableSubmit) reject();
      else resolve();
    });
}
