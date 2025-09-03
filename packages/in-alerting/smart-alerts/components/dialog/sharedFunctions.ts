/*
 * (c) Copyright IBM Corp. 2025
 * (c) Copyright Instana Inc. 2025
 */

import { Field, MapForm } from 'formalistic';

import {
  ThresholdType,
  VersionedConfig,
  RuleWithThreshold,
  ApplicationAlertRuleUnion,
  InfraAlertRuleUnion,
  WebsiteAlertRuleUnion,
  MobileAppAlertRuleUnion,
  LogAlertRuleUnion
} from '@instana/types';

import { ADAPTIVE_BASELINE, HISTORIC_BASELINE, STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { thresholdOrBaselineLoadingSignal$ } from 'in-alerting/components/Chart/AlertingChartWrapper';
import { ApplicationAlertType } from 'in-alerting/smart-alerts/applications/data/blueprintConfig';
import { InfraAlertType } from 'in-alerting/smart-alerts/infrastructure/data/blueprintConfig';
import { WebsitesAlertType } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { MobileAlertType } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { LogAlertType } from 'in-alerting/smart-alerts/logs/data/blueprintConfig';
import { t } from 'in-i18n';

type MultithresholdAlertRuleUnion =
  | ApplicationAlertRuleUnion
  | InfraAlertRuleUnion
  | WebsiteAlertRuleUnion
  | MobileAppAlertRuleUnion
  | LogAlertRuleUnion;

type MultithresholdAlertType =
  | ApplicationAlertType
  | InfraAlertType
  | WebsitesAlertType
  | MobileAlertType
  | LogAlertType;

export function updateMultiThresholdInForm<R extends MultithresholdAlertRuleUnion, T extends MultithresholdAlertType>(
  createThresholdForm: (
    ruleWithThreshold: RuleWithThreshold<R> | undefined,
    alertType: T,
    editMode?: boolean
  ) => MapForm<any>,
  form: MapForm<any>,
  updateForm: (form: MapForm<any>) => void,
  data: { type: string; value?: any; baseline?: number[] },
  errors: string | any[],
  simpleMode: boolean,
  editMode: boolean
): void {
  thresholdOrBaselineLoadingSignal$.emit(false);
  const currentThresholdForm = form.get('threshold') as MapForm<any>;
  const warningThresholdField = currentThresholdForm.get('warningThreshold');
  const criticalThresholdField = currentThresholdForm.get('criticalThreshold');
  const alertType = ((form.get('rule') as MapForm<any>)!.get('alertType') as Field<T>)!.value;

  let ruleWithThreshold = {
    rule: form.get('rule').toJS(),
    thresholdOperator: form.get('threshold').get('operator').value,
    thresholds: {
      WARNING: getMultithresholdThresholdRule(warningThresholdField, errors, data, simpleMode, false),
      CRITICAL: getMultithresholdThresholdRule(criticalThresholdField, errors, data, simpleMode, true)
    }
  };

  let updatedThresholdForm = createThresholdForm(ruleWithThreshold, alertType, editMode);
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

  if (data?.type === HISTORIC_BASELINE && warningThresholdField.containsKey('baseline')) {
    const thresholdValue = warningThresholdField.get('baseline');
    const oldState = (thresholdValue as Field<string>).touched;
    updatedThresholdForm = updatedThresholdForm!.updateIn(['warningThreshold', 'baseline'], f =>
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

function getMultithresholdThresholdRule(
  thresholdField: MapForm<any>,
  errors: string | any[],
  data: { type: string; value?: any },
  simpleMode: boolean,
  isCriticalThreshold: boolean
): any {
  const currentThreshold = thresholdField.toJS();

  let thresholdData;
  if (errors.length === 0) {
    thresholdData = {
      ...currentThreshold,
      ...data,
      isCheckboxSelected: simpleMode
        ? data != null || currentThreshold?.isCheckboxSelected
        : data?.value !== undefined || currentThreshold?.isCheckboxSelected
    };
    if (isCriticalThreshold) {
      thresholdData.value = simpleMode ? null : currentThreshold?.value ?? null;
      thresholdData.isCheckboxSelected =
        thresholdData?.value != null ? true : Boolean(currentThreshold?.isCheckboxSelected);
    }
  } else {
    thresholdData = {
      ...currentThreshold,
      value: null,
      isCheckboxSelected: currentThreshold.type === STATIC_THRESHOLD ? false : currentThreshold?.isCheckboxSelected,
      baseline: []
    };
  }

  return thresholdData;
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

export function applyEditModeForMultiThreshold(form: MapForm<any>, editMode: boolean): MapForm<any> {
  if (!editMode) return form;

  const type = ((form.get('threshold') as MapForm<any>).get('warningThreshold').get('type') as Field<ThresholdType>)
    .value;
  if (type === HISTORIC_BASELINE) {
    return form
      .updateIn(['threshold', 'warningThreshold'], thresholdMapForm =>
        (thresholdMapForm as unknown as MapForm<any>).updateIn(['baseline'], item =>
          (item as Field<any>).setTouched(true)
        )
      )
      .updateIn(['threshold', 'criticalThreshold'], thresholdMapForm =>
        (thresholdMapForm as unknown as MapForm<any>).updateIn(['baseline'], item =>
          (item as Field<any>).setTouched(true)
        )
      );
  }
  return form;
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
