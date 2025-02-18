/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  SloAlertForm,
  createUnvalidatedSloBurnRateTimeWindowsForm,
  createValidatedSloBurnRateTimeWindowsForm
} from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';
import { percentageUpToTwoDecimalPlaces } from 'in-services/formatters/number';
import { t } from 'in-i18n';

function resetSelectedSloIds(form: SloAlertForm): SloAlertForm {
  if (!form.getIn(['entityType']).touched) return form;

  return form
    .updateIn(['sloIds'], field => field.setValue([]).setTouched(false))
    .updateIn(['triggering'], field => field.setValue(false).setTouched(false));
}

function updateThresholdOperator(form: SloAlertForm): SloAlertForm {
  const alertMetricValue = form.getIn(['rule', 'metric']).value;

  return form.updateIn(['operator'], operatorField =>
    operatorField.setValue(alertMetricValue === 'STATUS' ? '<=' : '>=')
  );
}

function updateAlertType(form: SloAlertForm): SloAlertForm {
  const alertMetric = form.getIn(['rule', 'metric']).value;

  return form.updateIn(['rule', 'alertType'], metricField =>
    metricField.setValue(alertMetric === 'STATUS' ? 'SERVICE_LEVELS_OBJECTIVE' : 'ERROR_BUDGET')
  );
}

function updateBurnRateTimeWindowsForm(form: SloAlertForm): SloAlertForm {
  const alertMetricValue = form.getIn(['rule', 'metric']).value;
  const burnRateFormReplacement =
    alertMetricValue === 'BURN_RATE'
      ? createValidatedSloBurnRateTimeWindowsForm()
      : createUnvalidatedSloBurnRateTimeWindowsForm();

  return form.put('burnRateTimeWindows', burnRateFormReplacement);
}

export function updateSloAlertNameAndDescription(form: SloAlertForm): SloAlertForm {
  const metric = form.getIn(['rule', 'metric']).value;
  const thresholdFormValue = form.getIn(['threshold']).value;
  const operator = form.getIn(['operator']).value;
  const threshold =
    metric === 'BURN_RATE' ? thresholdFormValue : percentageUpToTwoDecimalPlaces(form.getIn(['threshold']).value ?? 0);

  let updatedForm = form;

  if (!form.get('name').touched) {
    const titlePlaceholder = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
      context: metric
    });
    updatedForm = updatedForm.updateIn(['name'], nameField => nameField.setValue(titlePlaceholder));
  }

  if (!form.get('description').touched) {
    const descriptionPlaceholder = t(
      'in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder',
      {
        context: metric,
        percentage: threshold,
        operator
      }
    );
    updatedForm = updatedForm.updateIn(['description'], descriptionField =>
      descriptionField.setValue(descriptionPlaceholder)
    );
  }

  return updatedForm;
}

const formSideEffects: Effect<SloAlertForm>[] = [
  {
    path: ['entityType'],
    effects: [resetSelectedSloIds]
  },
  {
    path: ['rule', 'metric'],
    effects: [updateAlertType, updateThresholdOperator, updateSloAlertNameAndDescription, updateBurnRateTimeWindowsForm]
  },
  {
    path: ['threshold'],
    effects: [updateSloAlertNameAndDescription]
  },
  {
    path: ['operator'],
    effects: [updateSloAlertNameAndDescription]
  }
];

export type SloAlertFormSideEffectsReturnType = (form: SloAlertForm) => void;

export default function useSloAlertFormSideEffects(
  form: SloAlertForm,
  setForm: (field: SloAlertForm) => void
): SloAlertFormSideEffectsReturnType {
  return useFormSideEffects({
    form,
    setForm,
    effects: formSideEffects,
    changesToTrack: [CHANGE_TYPES.EDIT, CHANGE_TYPES.LIST_UPDATE, CHANGE_TYPES.INSERT]
  });
}
