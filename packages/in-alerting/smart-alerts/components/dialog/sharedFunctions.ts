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
  VersionedConfig,
  RuleWithThreshold,
  ApplicationAlertRuleUnion
} from 'in-types';
import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { InfraAlertType } from 'in-alerting/smart-alerts/infrastructure/data/blueprintConfig';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { t } from 'in-i18n';

export function updateThresholdInForm<
  ALERT_TYPE extends WebsitesAlertType | ApplicationAlertType | MobileAlertType | InfraAlertType
>(
  createThresholdForm: (
    threshold: ThresholdConfig | HistoricBaselineConfig | StaticThresholdConfig | AdaptiveBaselineConfig,
    alertType: ALERT_TYPE
  ) => MapForm<any>,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  data: { type: string; value: any },
  errors: string | any[],
  time: number,
  simpleMode: boolean
): void {
  thresholdOrBaselineLoadingSignal$.emit(false);

  const alertType = ((form.get('rule') as MapForm<any>).get('alertType') as Field<ALERT_TYPE>).value;
  const thresholdForm = form.get('threshold') as MapForm<any>;
  const currentThreshold = thresholdForm.toJS() as unknown as ThresholdConfig;

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
    // @ts-expect-error ts has problems with nested fields on MapForm<any>, because it cant know the contents
    .updateIn(['hiddenFields', 'suggestedThresholdValue'], f => (f as Field<number>).setValue(data?.value));

  updateForm(newForm);
}

export function updateMultiThresholdInForm(
  createThresholdForm: (
    ruleWithThreshold: RuleWithThreshold<ApplicationAlertRuleUnion> | undefined,
    alertType: ApplicationAlertType,
    editMode?: boolean,
    simpleMode?: boolean
  ) => MapForm<any>,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  data: { type: string; value: any },
  errors: string | any[],
  simpleMode: boolean
): void {
  thresholdOrBaselineLoadingSignal$.emit(false);
  const currentThresholdForm = form.get('threshold') as MapForm<any>;
  const warningThresholdField = currentThresholdForm.get('warningThreshold');
  const criticalThresholdField = currentThresholdForm.get('criticalThreshold');
  const alertType = ((form.get('rule') as MapForm<any>)!.get('alertType') as Field<ApplicationAlertType>)!.value;

  let ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: {
      WARNING: createThresholdByType(warningThresholdField),
      CRITICAL: createThresholdByType(criticalThresholdField)
    }
  };

  function createThresholdByType(thresholdField: MapForm<any>): any {
    const currentThreshold = thresholdField.toJS();

    let thresholdData;
    if (errors.length === 0) {
      thresholdData = {
        ...currentThreshold,
        ...data
      };
      if (thresholdField === criticalThresholdField) {
        thresholdData.value = simpleMode ? null : currentThreshold?.value ?? null;
      }
    } else {
      thresholdData = {
        ...currentThreshold,
        value: null,
        isCheckboxSelected: currentThreshold.type === STATIC_THRESHOLD ? false : currentThreshold.isCheckboxSelected,
        baseline: []
      };
    }

    return thresholdData;
  }

  let updatedThresholdForm = createThresholdForm(ruleWithThreshold, alertType, true, simpleMode);
  updatedThresholdForm = shouldAddNewMultiThresholdData(simpleMode, currentThresholdForm)
    ? updatedThresholdForm
    : currentThresholdForm;
  // preserve touched state on staticThreshold types
  // we need to do this because, createThresholdForm discards all touched states from the threshold form
  // and because we use the touched state to decide if we should overwrite the current threshold input with new suggestions
  // automatically
  if (data?.type === STATIC_THRESHOLD && warningThresholdField.containsKey('value')) {
    const staticThresholdValue = warningThresholdField.get('value');
    const oldState = (staticThresholdValue as Field<string>).touched;
    updatedThresholdForm = updatedThresholdForm!.updateIn(['warningThreshold', 'value'], f =>
      (f as Field<any>).setTouched(oldState)
    );
  }

  let newForm = form
    .put('threshold', updatedThresholdForm!)
    .updateIn(['hiddenFields', 'calculateThresholdOnBackend'], f => (f as Field<boolean>).setValue(false))
    // @ts-expect-error ts has problems with nested fields on MapForm<any>, because it cant know the contents
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
    duplicateFrom: id,
    name: t('in-alerting:smartAlerts.titleCopyOf', { smartAlertTitle: config.name }),
    builtIn: false
  };
}

/**
 * Apply editMode to form state. We use the touched state of the value and baseline fields to indicate if they should be
 * updated with new suggestions.
 */
export function applyEditMode(form: MapForm<any>, editMode: boolean): MapForm<any> {
  if (!editMode) return form;

  const type = ((form.get('threshold') as MapForm<any>).get('type') as Field<ThresholdType>).value;

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

function shouldAddNewThresholdData(simpleMode: boolean, thresholdForm: MapForm<any>): boolean {
  if (simpleMode) return true;

  const type = (thresholdForm?.get('type') as Field<ThresholdType>)?.value;

  if (type === STATIC_THRESHOLD) {
    return !thresholdForm?.get('value')?.touched;
  }

  return !thresholdForm?.get('baseline')?.touched;
}

function shouldAddNewMultiThresholdData(simpleMode: boolean, thresholdForm: MapForm<any>): boolean {
  if (simpleMode) return true;

  const type = (thresholdForm?.get('warningThreshold')?.get('type') as Field<ThresholdType>)?.value;

  if (type === STATIC_THRESHOLD) {
    return !thresholdForm?.hierarchyTouched;
  }
  if (type === HISTORIC_BASELINE) {
    return !thresholdForm?.get('warningThreshold')?.get('baseline')?.touched;
  }
  if (type === ADAPTIVE_BASELINE) {
    return !thresholdForm?.get('baseline')?.touched;
  }
  return true;
}

export function isEmpty(value: any) {
  return (
    value === undefined ||
    value === null ||
    isNaN(value) ||
    (typeof value === 'object' && Object.keys(value).length === 0) ||
    (typeof value === 'string' && value.trim().length === 0)
  );
}
