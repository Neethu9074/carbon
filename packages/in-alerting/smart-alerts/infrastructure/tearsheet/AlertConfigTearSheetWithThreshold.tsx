/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { TimeConfig, InfraAlertRuleUnion, TagCatalog } from '@instana/types';

import {
  infraStepRenderers,
  stepConfigs,
  getFooterActions,
  stepRendersType
} from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/TearSheetStepConfigs';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { useSimpleModePageNavigation } from 'in-alerting/smart-alerts/components/dialog/simple/useSimpleModePageNavigation';
import { CreateBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import useAlertConfigValidation from 'in-alerting/smart-alerts/infrastructure/hooks/useAlertConfigValidation';
import useThresholdSuggestion from 'in-alerting/smart-alerts/infrastructure/hooks/useThresholdSuggestion';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import AlertingTearSheet from 'in-alerting/components/AlertingTearSheet';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { productAreas } from 'in-services/tracking/productAreas';
import { Nullish } from 'in-types';

const FORM_ID = 'smart-alert-editor';

export interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  onChartViewConfigChange: (arg: number) => void;
  selectedChartViewConfigIndex: number;
  editMode: boolean;
  timeConfig: TimeConfig;
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
  withTrackClose: () => void;
  cancelTearSheet: () => string | Nullish;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, updateForm, editMode, withTrackClose, isSaving, cancelTearSheet, onCreate } = props;

  const { step, setStep, backOrCancel, handleSubmit } = useSimpleModePageNavigation({
    stepConfigs,
    form,
    setForm: updateForm,
    onCreate: () => onCreate(true),
    onClose: withTrackClose
  });

  const [tagFilterValid, setTagFilterValid] = useState(true);

  const actions = getFooterActions(backOrCancel, cancelTearSheet, handleSubmit, editMode);

  // this hook will validate each step and prevents navigation
  const navItems = useAlertConfigValidation(stepConfigs, form, tagFilterValid, updateForm);

  const alertConfigWithFormModel = form.toJS();
  const { rule, tagFilterExpression } = alertConfigWithFormModel;
  const { metricName, entityType, regex } = rule as InfraAlertRuleUnion;

  const tagCatalog = useTagCatalog({
    ownerType: entityType,
    metric: metricName,
    regex: regex
  });

  const { getTagCatalog } = useMemo(() => CreateBoundedAlertQueryBuilder(tagCatalog as TagCatalog), [tagCatalog]);

  const updateTagFilterExpression = (filteredTagFilterExpression: FormModelElement[]) => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  const isMetricAndEntityValid = metricName != '' || entityType != '';

  useRemoveInvalidTagsFromFilterExpression(
    getTagCatalog,
    tagFilterExpression as FormModelElement[],
    updateTagFilterExpression
  );

  const isValid = isMetricAndEntityValid && tagFilterValid;

  const [thresholdResult, setThresholdResult] = useState();

  useThresholdSuggestion(form, updateForm, setThresholdResult, editMode, {
    isValid,
    alertConfigWithFormModel
  });

  return (
    <AlertingTearSheet
      step={step}
      setStep={setStep}
      actions={actions}
      stepConfigs={navItems}
      isSaving={isSaving}
      formId={FORM_ID}
      form={form}
      setForm={updateForm}
      sideNavigationEnabled={editMode}
      productArea={productAreas.infrastructure}
      headerWithMsg={false}
      additionalValidationCheck={additionalValidationCheck(step, tagFilterValid)}
    >
      {infraStepRenderers.map((Renderer: (props: stepRendersType) => JSX.Element, idx: number) => {
        return (
          step === idx && (
            <Renderer
              {...props}
              key={`key-${idx}`}
              isTagFilterFormModelValid
              thresholdResult={thresholdResult}
              setStep={setStep}
              setTagFilterValid={setTagFilterValid}
            />
          )
        );
      })}
    </AlertingTearSheet>
  );
}

function additionalValidationCheck(step: number, tagFilterValid: boolean) {
  // TODO remove this
  if (step == 0) {
    return tagFilterValid;
  }
  return true;
}
