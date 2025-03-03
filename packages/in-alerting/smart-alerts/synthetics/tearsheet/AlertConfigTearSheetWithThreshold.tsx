/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm } from 'formalistic';
import React, { useMemo } from 'react';

import {
  createBoundedAlertQueryBuilder,
  createIsAlertQueryValid
} from 'in-alerting/smart-alerts/synthetics/components/AlertQueryBuilder';
import { EnrichedError } from 'in-alerting/smart-alerts/components/utils/enrichSavingErrorWhenContainsLimitReachedOrMarkAsTechnicalError';
//@ts-expect-error
import { useIsTagFilterFormModelValid } from 'in-alerting/smart-alerts/synthetics/hooks/useIsTagFilterFormModelValid';
import { stepConfigsForCarbonTearSheet } from 'in-alerting/smart-alerts/synthetics/tearsheet/steps/TearSheetStepConfigs';
import useTagBasedPayloadConfigurator from 'in-alerting/smart-alerts/synthetics/hooks/useTagBasedPayloadConfigurator';
import useAlertConfigValidation from 'in-alerting/smart-alerts/synthetics/hooks/useAlertConfigValidation';
import AlertingFullScreenTearSheet from 'in-alerting/components/AlertingFullScreenTearSheet';
import { productAreas } from 'in-services/tracking/productAreas';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

export interface AlertConfigTearSheetWithThresholdProps {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  editMode: boolean;
  onCreate: (simpleMode: boolean) => void;
  isSaving: boolean;
  messages: EnrichedError[];
  withTrackClose: () => void;
  cancelTearSheet: string;
  tearSheetTitle: string;
}
/**
 * Timeframe used for the tag-suggestions in QB2.
 */
export const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: true
};

export default function AlertConfigTearSheetWithThreshold(props: AlertConfigTearSheetWithThresholdProps) {
  const { form, updateForm, editMode, onCreate, tearSheetTitle } = props;

  const { QueryBuilder: AlertQueryBuilder, isQueryValid } = useMemo(
    () => createBoundedAlertQueryBuilder(tagSuggestionTimeConfig),
    []
  );
  const alertConfigWithFormModel = form.toJS();
  const { tagFilterExpression } = alertConfigWithFormModel;
  const isAlertQueryValid = createIsAlertQueryValid(isQueryValid);

  const isTagFilterFormModelValid = useIsTagFilterFormModelValid(tagFilterExpression, isAlertQueryValid);

  const navItems = useAlertConfigValidation(stepConfigsForCarbonTearSheet, form, isTagFilterFormModelValid, updateForm);

  const TagBasedPayloadConfigurator = useTagBasedPayloadConfigurator(tagSuggestionTimeConfig);

  return (
    <AlertingFullScreenTearSheet
      {...props}
      isEditMode={editMode}
      tearSheetTitle={tearSheetTitle}
      stepConfigs={navItems}
      thresholdResult={null}
      handleFormSubmit={() => handleFormSubmit(onCreate)}
      actionButtonLabel={getButtonLabel(editMode)}
      QueryBuilderComponent={AlertQueryBuilder}
      TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
      productArea={productAreas.synthetic_monitoring}
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
