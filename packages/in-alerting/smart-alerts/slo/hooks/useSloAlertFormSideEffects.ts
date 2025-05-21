/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { createListForm } from 'formalistic';

import { ServiceLevelsBurnRateConfig } from '@instana/types';

import { defaultOperator, defaultSloAlertConfig } from 'in-alerting/smart-alerts/slo/data/sloAlertConfig';
import { createBurnRateAlertConfig } from 'in-alerting/smart-alerts/slo/form/alertFormDefinition';
import useFormSideEffects, { CHANGE_TYPES, Effect } from 'in-hooks/useFormSideEffects';
import { BurnRateAlertType, SloAlertForm } from 'in-alerting/smart-alerts/slo/types';
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

function updateBurnRateConfigForm(form: SloAlertForm): SloAlertForm {
  const alertMetricValue = form.getIn(['rule', 'metric']).value;
  const burnRateAlertType = form.getIn(['burnRateAlertType']).value;

  const burnRateFormReplacement =
    alertMetricValue === 'BURN_RATE_V2'
      ? createBurnRateAlertConfig(
          defaultSloAlertConfig.burnRateConfig as ServiceLevelsBurnRateConfig[],
          burnRateAlertType,
          true
        )
      : createListForm({ items: [] });

  return form.put('burnRateConfig', burnRateFormReplacement);
}

export function updateSloAlertNameAndDescription(form: SloAlertForm): SloAlertForm {
  const metric = form.getIn(['rule', 'metric']).value;
  const thresholdFormValue = form.getIn(['threshold']).value;
  const operator = form.getIn(['operator']).value;
  const threshold =
    metric === 'BURN_RATE_V2' || metric === 'BURN_RATE'
      ? thresholdFormValue
      : percentageUpToTwoDecimalPlaces(form.getIn(['threshold']).value ?? 0);

  let updatedForm = form;

  if (!form.get('name').touched) {
    const titlePlaceholder = t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesTitlePlaceholder', {
      context: metric
    });
    updatedForm = updatedForm.updateIn(['name'], nameField => nameField.setValue(titlePlaceholder));
  }
  let descriptionPlaceholder = '';

  if (!form.get('description').touched) {
    if (metric === 'BURN_RATE_V2') {
      descriptionPlaceholder = getBurnRateDescriptionPlaceholder(updatedForm);
    } else {
      descriptionPlaceholder = t(
        'in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder',
        {
          context: metric,
          percentage: threshold,
          operator
        }
      );
    }
    updatedForm = updatedForm.updateIn(['description'], descriptionField =>
      descriptionField.setValue(descriptionPlaceholder)
    );
  }

  return updatedForm;
}

export function getBurnRateDescriptionPlaceholder(form: SloAlertForm) {
  const metric = form.getIn(['rule', 'metric']).value;
  const burnRateAlertType = form.getIn(['burnRateAlertType']).value as BurnRateAlertType;
  const burnRateConfig = (form.getIn(['burnRateConfig']).toJS() as ServiceLevelsBurnRateConfig[]) || [];

  const burnRateContext = `${metric}_${burnRateAlertType.toUpperCase()}`;

  const singleWindowConfig = burnRateConfig.find(({ alertWindowType }) => alertWindowType === 'SINGLE');
  const longWindowConfig = burnRateConfig.find(({ alertWindowType }) => alertWindowType === 'LONG');
  const shortWindowConfig = burnRateConfig.find(({ alertWindowType }) => alertWindowType === 'SHORT');

  if (burnRateAlertType === 'single') {
    return t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder', {
      context: burnRateContext,
      singleWindowOperator: singleWindowConfig?.threshold?.operator ?? defaultOperator,
      singleWindowPercentage: singleWindowConfig?.threshold?.value ?? 0
    });
  } else if (burnRateAlertType === 'multi') {
    return t('in-alerting:smartAlerts.slo.advancedModeContainer.alertPropertiesDescriptionPlaceholder', {
      context: burnRateContext,
      longWindowPercentage: longWindowConfig?.threshold?.value ?? 0,
      shortWindowPercentage: shortWindowConfig?.threshold?.value ?? 0,
      longWindowOperator: longWindowConfig?.threshold?.operator ?? defaultOperator,
      shortWindowOperator: shortWindowConfig?.threshold?.operator ?? defaultOperator
    });
  }
  return '';
}

const formSideEffects: Effect<SloAlertForm>[] = [
  {
    path: ['entityType'],
    effects: [resetSelectedSloIds]
  },
  {
    path: ['rule', 'metric'],
    effects: [updateAlertType, updateThresholdOperator, updateSloAlertNameAndDescription, updateBurnRateConfigForm]
  },
  {
    path: ['burnRateAlertType'],
    effects: [updateSloAlertNameAndDescription]
  },
  {
    path: ['burnRateConfig', /^(0|1)$/],
    effects: [updateSloAlertNameAndDescription]
  },
  {
    path: ['operator'],
    effects: [updateSloAlertNameAndDescription]
  },
  {
    path: ['threshold'],
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
