/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { t } from '@instana/i18n-react';

import { getSloAlertOperatorContext } from 'in-alerting/smart-alerts/slo/components/OperatorDropdown';
import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';
import { SloAlertForm } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import { percentageUpToTwoDecimalPlaces } from 'in-services/formatters/number';

function resetSelectedSloIds(form: SloAlertForm): SloAlertForm {
  if (!form.getIn(['entityType']).touched) return form;

  return form
    .updateIn(['sloIds'], field => field.setValue([]).setTouched(false))
    .updateIn(['triggering'], field => field.setValue(false).setTouched(false));
}

function updateThresholdOperator(form: SloAlertForm): SloAlertForm {
  const alertType = form.getIn(['rule', 'alertType']).value;

  return form.updateIn(['operator'], operatorField =>
    operatorField.setValue(alertType === 'ERROR_BUDGET' ? '>=' : '<=')
  );
}

function updateMetricType(form: SloAlertForm): SloAlertForm {
  const alertType = form.getIn(['rule', 'alertType']).value;

  return form.updateIn(['rule', 'metric'], metricField =>
    metricField.setValue(alertType === 'ERROR_BUDGET' ? 'BURNED_PERCENTAGE' : 'STATUS')
  );
}

export function updateSloAlertNameAndDescription(form: SloAlertForm): SloAlertForm {
  const alertType = form.getIn(['rule', 'alertType']).value;
  const operator = form.getIn(['operator']).value;
  const threshold = percentageUpToTwoDecimalPlaces(form.getIn(['threshold']).value ?? 0);
  const operatorContext = getSloAlertOperatorContext(operator);

  let updatedForm = form;

  if (!form.get('name').touched) {
    const titlePlaceholder = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
      context: alertType
    });
    updatedForm = updatedForm.updateIn(['name'], nameField => nameField.setValue(titlePlaceholder));
  }

  if (!form.get('description').touched) {
    const descriptionPlaceholder = t(
      'in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder',
      {
        context: alertType,
        percentage: threshold,
        operator: operatorContext
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
    path: ['rule', 'alertType'],
    effects: [updateMetricType, updateThresholdOperator, updateSloAlertNameAndDescription]
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
