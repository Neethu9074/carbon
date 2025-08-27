/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { subDays } from 'date-fns';
import { useState } from 'react';

import {
  getTagFilterExpressionValidationMessage,
  getTimeRangeValidationMessage,
  validateStartWithinRetention
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import {
  DeleteLogsV3FormFields,
  InputValues,
  ValidationMessages
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/modalTypes';
import { validationLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { getTimeFormatValidation } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/utils';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { formatTimeWithoutSeconds } from 'in-services/formatters/date';

const getInitialFormState = () => {
  const form = createMapForm<any>();

  return form
    .put(
      'tagFilterExpression',
      createField({
        value: []
      })
    )
    .put(
      'validation',
      createField({
        value: '',
        validator: value =>
          value === 'LOGS' ? null : [{ severity: 'error', message: validationLocalisationStrings.typeValidation }]
      })
    )
    .put(
      'reason',
      createField({
        value: '',
        validator: value =>
          value !== '' ? null : [{ severity: 'error', message: validationLocalisationStrings.reasonValidationMessage }]
      })
    )
    .put(
      'deletionEndDate',
      createField({
        value: new Date()
      })
    )
    .put(
      'deletionEndTime',
      createField({
        value: formatTimeWithoutSeconds(new Date())
      })
    )
    .put(
      'deletionStartDate',
      createField({
        value: subDays(new Date(), 1)
      })
    )
    .put(
      'deletionStartTime',
      createField({
        value: formatTimeWithoutSeconds(new Date())
      })
    );
};

export default function useDeleteLogsV3Form() {
  const maxRetentionDays: number = 90;
  const [form, setForm] = useState(getInitialFormState());
  const updateField = (name: DeleteLogsV3FormFields, value: string | Date | FormModelElement[]) => {
    setForm(form.updateIn([name], field => field.setValue(value).setTouched(true)) as MapForm<any>);
  };

  const setInputValues = {
    reason: (value: string) => updateField('reason', value),
    startDate: (value: Date) => updateField('deletionStartDate', value),
    endDate: (value: Date) => updateField('deletionEndDate', value),
    validation: (value: string) => updateField('validation', value),
    startTime: (value: string) => updateField('deletionStartTime', value),
    endTime: (value: string) => updateField('deletionEndTime', value),
    tagFilterExpression: (value: FormModelElement[]) => updateField('tagFilterExpression', value)
  };

  const getFieldValue = (name: DeleteLogsV3FormFields) => form.get(name)?.value;

  let inputValues: InputValues = {
    reason: getFieldValue('reason'),
    endDate: getFieldValue('deletionEndDate'),
    endTime: getFieldValue('deletionEndTime'),
    startDate: getFieldValue('deletionStartDate'),
    startTime: getFieldValue('deletionStartTime'),
    validation: getFieldValue('validation'),
    tagFilterExpression: getFieldValue('tagFilterExpression')
  };

  const getValidationMessage = (
    field: DeleteLogsV3FormFields,
    additionalValidation?: (value: string) => string | null
  ) => {
    const fieldData = form.get(field);
    if (fieldData.valid || !fieldData.touched) return additionalValidation?.(fieldData.value) || null;
    return fieldData.messages[0]?.message;
  };

  const timeRangeValidationMessage = getTimeRangeValidationMessage(inputValues);
  const tagFilterExpressionValidationMessage = getTagFilterExpressionValidationMessage(inputValues);
  const retentionValidation = validateStartWithinRetention(
    inputValues.startDate,
    inputValues.startTime,
    maxRetentionDays
  );
  const timeFormat = getTimeFormatValidation(form, inputValues);

  let validationMessages: ValidationMessages & {
    startTime?: string | null;
    endTime?: string | null;
  } = {
    reason: getValidationMessage('reason'),
    validation: getValidationMessage('validation'),
    tagFilterExpression: tagFilterExpressionValidationMessage,
    timeRange: timeRangeValidationMessage,
    retention: retentionValidation,
    startTime: timeFormat.startTime,
    endTime: timeFormat.endTime,
    startDate: timeFormat.startDate,
    endDate: timeFormat.endDate
  };

  const canGoNextStep =
    !validationMessages.tagFilterExpression &&
    !validationMessages.timeRange &&
    !validationMessages.retention &&
    !validationMessages.startTime &&
    !validationMessages.endTime &&
    !validationMessages.startDate &&
    !validationMessages.endDate;

  const canSubmit =
    form.hierarchyValid &&
    !timeRangeValidationMessage &&
    !retentionValidation &&
    !timeFormat.startTime &&
    !timeFormat.endTime;

  const resetForm = () => setForm(getInitialFormState());
  const touchForm = () => setForm(form.setTouched(true, { recurse: true }));

  return {
    setInputValues,
    inputValues,
    validationMessages,
    canSubmit,
    resetForm,
    touchForm,
    canGoNextStep
  };
}
