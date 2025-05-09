/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { useState } from 'react';

import {
  DeleteLogsFormFields,
  InputValues,
  ValidationMessages
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/modalTypes';
import {
  createInitialForm,
  validateEndTimeLogic
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/utils';

export default function useDeleteLogsForm() {
  const [form, setForm] = useState(createInitialForm());

  const updateField = (name: DeleteLogsFormFields, value: string) => {
    setForm(prev => prev.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<any>);
  };

  const getFieldValue = (field: DeleteLogsFormFields) => form.get(field).value;

  const inputValues: InputValues = {
    reason: getFieldValue('reason'),
    endDate: getFieldValue('deletionEndDate'),
    endTime: getFieldValue('deletionEndTime'),
    validation: getFieldValue('validation')
  };

  const getMessage = (field: DeleteLogsFormFields, custom?: (v: string) => string | null) => {
    const data = form.get(field);
    if (data.valid || !data.touched) return custom?.(data.value) || null;
    return data.messages[0]?.message;
  };

  const validationMessages: ValidationMessages = {
    reason: getMessage('reason') as string,
    endDate: getMessage('deletionEndDate') as string,
    endTime: getMessage('deletionEndTime', () =>
      validateEndTimeLogic(inputValues.endDate as string, inputValues.endTime)
    ) as string,
    validation: getMessage('validation') as string
  };

  const isValidTime = !validateEndTimeLogic(inputValues.endDate as string, inputValues.endTime);
  const canSubmit = form.hierarchyValid && isValidTime;

  return {
    setInputValues: {
      reason: (val: string) => updateField('reason', val),
      endDate: (val: string) => updateField('deletionEndDate', val),
      validation: (val: string) => updateField('validation', val),
      endTime: (val: string) => updateField('deletionEndTime', val)
    },
    inputValues,
    validationMessages,
    canSubmit,
    resetForm: () => setForm(createInitialForm()),
    touchForm: () => setForm(form.setTouched(true, { recurse: true }))
  };
}
