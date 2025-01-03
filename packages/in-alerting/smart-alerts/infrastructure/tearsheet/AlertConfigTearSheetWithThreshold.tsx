/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { TimeConfig, InfraAlertRuleUnion, TagCatalog } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/infrastructure/tearsheet/steps/TearSheetStepConfigs';
import { CreateBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/infrastructure/components/AlertQueryBuilder';
import useAlertConfigValidation from 'in-alerting/smart-alerts/infrastructure/hooks/useAlertConfigValidation';
import useThresholdSuggestion from 'in-alerting/smart-alerts/infrastructure/hooks/useThresholdSuggestion';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { t } from 'in-i18n';

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
  cancelTearSheet: string;
  tearSheetTitle: string;
}

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, updateForm, editMode, onCreate, tearSheetTitle } = props;

  const [tagFilterValid, setTagFilterValid] = useState(true);

  // this hook will validate each step and prevents navigation
  const navItems = useAlertConfigValidation(stepConfigsForCarbonTearSheet, form, tagFilterValid, updateForm);

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
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid
      isEditMode={editMode}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={thresholdResult}
      setTagFilterValid={setTagFilterValid}
      handleFormSubmit={() => handleFormSubmit(onCreate)}
      actionButtonLabel={getButtonLabel(editMode)}
    />
  );
}

function handleFormSubmit(onCreate: (simpleMode: boolean) => void): void {
  onCreate(true);
}

function getButtonLabel(editMode?: boolean): string {
  if (editMode) {
    return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonSave');
  }
  return t('in-alerting:smartAlerts.components.smartAlertDialog.buttonCreate');
}
