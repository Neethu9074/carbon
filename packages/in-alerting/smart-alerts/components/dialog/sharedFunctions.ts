/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { Field, MapForm } from 'formalistic';

import {
  AdaptiveBaselineConfig,
  HistoricBaselineConfig,
  StaticThresholdConfig,
  ThresholdConfig,
  ThresholdType,
  VersionedConfig
} from 'in-types';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { ADAPTIVE_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { t } from 'in-i18n';

export function updateThresholdInForm<ALERT_TYPE extends WebsitesAlertType | ApplicationAlertType>(
  createThresholdForm: (
    threshold: ThresholdConfig | HistoricBaselineConfig | StaticThresholdConfig | AdaptiveBaselineConfig,
    alertType: ALERT_TYPE
  ) => MapForm,
  form: MapForm,
  updateForm: (form: MapForm) => void,
  data: { type: string; value: any },
  errors: string | any[],
  time: number,
  simpleMode: boolean
): void {
  thresholdOrBaselineLoadingSignal$.emit(false);

  const alertType = ((form.get('rule') as MapForm).get('alertType') as Field<ALERT_TYPE>).value;
  const thresholdForm = form.get('threshold') as MapForm;
  const currentThreshold = thresholdForm.toJS() as ThresholdConfig;

  let thresholdData;
  if (errors.length === 0) {
    thresholdData = {
      ...currentThreshold,
      ...data
    };
  } else {
    // set empty baseline in case of error
    thresholdData = {
      ...currentThreshold,
      baseline: []
    };
  }

  let updatedThresholdForm = createThresholdForm(
    {
      // @ts-expect-error
      lastUpdated: time,
      ...(shouldAddNewThresholdData(simpleMode, thresholdForm) ? thresholdData : currentThreshold)
    },
    alertType
  );

  // preserve touched state on staticThreshold types
  // we need to do this because, createThresholdForm discards all touched states from the threshold form
  // and because we use the touched state to decide if we should overwrite the current threshold input with new suggestions
  // automatically
  if (data?.type === STATIC_THRESHOLD && thresholdForm.containsKey('value')) {
    const oldState = (thresholdForm.get('value') as Field<string>).touched;
    updatedThresholdForm = updatedThresholdForm!.updateIn(['value'], f => (f as Field<any>).setTouched(oldState));
  }

  let newForm = form
    .put('threshold', updatedThresholdForm!)
    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(false))
    .updateIn(['hiddenFields', 'suggestedThresholdValue'], f => (f as Field<number>).setValue(data?.value));

  updateForm(newForm);
}

export function duplicateAlertConfig<
  T extends VersionedConfig & {
    name: string;
  }
>({ ...config }: T) {
  const { id, ...withoutId } = config;

  return {
    ...withoutId,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name }),
    builtIn: false
  };
}

/**
 * Apply editMode to form state. We use the touched state of the value and baseline fields to indicate if they should be
 * updated with new suggestions.
 */
export function applyEditMode(form: MapForm, editMode: boolean): MapForm {
  if (!editMode) return form;

  const type = ((form.get('threshold') as MapForm).get('type') as Field<ThresholdType>).value;

  if (type === STATIC_THRESHOLD) {
    return form
      .updateIn(['threshold', 'value'], f => f.setTouched(true))
      .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(true)); // request update to show a new suggestion
  } else if (type === ADAPTIVE_BASELINE) {
    // In case of adaptive baseline, we don't store it as part of alert config so when we are in edit mode, we need
    // to request for threshold from the back-end.
    return form.updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(true));
  }

  return form.updateIn(['threshold', 'baseline'], f => f.setTouched(true));
}

function shouldAddNewThresholdData(simpleMode: boolean, thresholdForm: MapForm): boolean {
  if (simpleMode) return true;

  const type = (thresholdForm?.get('type') as Field<ThresholdType>)?.value;

  if (type === STATIC_THRESHOLD) {
    return !thresholdForm?.get('value')?.touched;
  }

  return !thresholdForm?.get('baseline')?.touched;
}
