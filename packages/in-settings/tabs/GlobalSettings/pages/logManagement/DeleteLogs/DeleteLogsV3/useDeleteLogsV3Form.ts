/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { createField, createMapForm, MapForm } from 'formalistic';
import { subDays } from 'date-fns';
import { useState } from 'react';

import {
  DeleteLogsV3FormFields,
  InputValues,
  ValidationMessages
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsV3/modalTypes';
import {
  getTagFilterExpressionValidationMessage,
  getTimeRangeValidationMessage
} from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/utils';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { formatTimeWithoutSeconds } from 'in-services/formatters/date';
import { t } from 'in-i18n';

const localisationStrings = {
  typeValidation: t('in-settings:tabs.deleteLogs.typeToContinue', { logs: t('in-settings:tabs.deleteLogs.logs') }),
  untilDateValidationMessage: t('in-settings:tabs.deleteLogs.untilDateValidationMessage'),
  reasonValidationMessage: t('in-settings:tabs.deleteLogs.reasonValidationMessage'),
  untilTimeValidationMessage: t('in-settings:tabs.deleteLogs.untilTimeValidationMessage'),
  correctTimeFormat: t('in-settings:tabs.deleteLogs.correctTimeFormat')
};

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
          value === 'LOGS' ? null : [{ severity: 'error', message: localisationStrings.typeValidation }]
      })
    )
    .put(
      'reason',
      createField({
        value: '',
        validator: value =>
          value !== '' ? null : [{ severity: 'error', message: localisationStrings.reasonValidationMessage }]
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

  let validationMessages: ValidationMessages = {
    reason: getValidationMessage('reason'),
    validation: getValidationMessage('validation'),
    tagFilterExpression: tagFilterExpressionValidationMessage,
    timeRange: timeRangeValidationMessage
  };

  const canGoNextStep = !validationMessages.tagFilterExpression && !validationMessages.timeRange;

  const canSubmit = form.hierarchyValid && !timeRangeValidationMessage;

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
