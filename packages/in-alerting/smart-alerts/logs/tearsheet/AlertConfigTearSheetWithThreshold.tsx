/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useMemo, useState } from 'react';
import { Item, MapForm } from 'formalistic';

import { TimeConfig, TagCatalog } from '@instana/types';

import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/logs/tearsheet/steps/TearSheetStepConfigs';
import useAlertConfigValidation from 'in-alerting/smart-alerts/logs/hooks/useAlertConfigValidation';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { getQueryBuilder } from 'in-alerting/smart-alerts/logs/components/AlertQueryBuilder';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
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

  const [, setTagFilterValid] = useState(true);

  const navItems = useAlertConfigValidation(stepConfigsForCarbonTearSheet);

  const alertConfigWithFormModel = form.toJS();
  const { tagFilterExpression } = alertConfigWithFormModel;

  const tagCatalog = useTagCatalog('SMART_ALERTS');
  const { getTagCatalog } = useMemo(() => getQueryBuilder(tagCatalog as TagCatalog), [tagCatalog]);

  const updateTagFilterExpression = (filteredTagFilterExpression: FormModelElement[]) => {
    updateForm(form.updateIn(['tagFilterExpression'], f => f.setValue(filteredTagFilterExpression)));
  };

  useRemoveInvalidTagsFromFilterExpression(
    getTagCatalog,
    tagFilterExpression as FormModelElement[],
    updateTagFilterExpression
  );

  return (
    <AlertingFullScreenTearSheet
      {...props}
      isTagFilterFormModelValid
      isEditMode={editMode}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={null}
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
