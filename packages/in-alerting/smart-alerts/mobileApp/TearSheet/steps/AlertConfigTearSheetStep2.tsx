/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Field, Item, MapForm } from 'formalistic';
import React, { useMemo } from 'react';

import { Stack } from '@instana/components';

import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/mobileApp/components/AlertQueryBuilder';
import { MobileAppAlertRuleUnion, ThresholdConfigUnion, ThresholdOperator, ThresholdType } from 'in-types';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MetricName } from 'in-alerting/smart-alerts/mobileApp/data/blueprintConfig';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/mobileApp/TearSheet/steps/AlertConfigTearSheetStep2.mless';

/**
 * Timeframe used for the tag-suggestions in QB2.
 */
const tagSuggestionTimeConfig = {
  windowSize: days.toMillis(1),
  autoRefresh: false
};

interface AlertConfigTearSheetStep2Props {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  tagFilterExpression: FormModelElement[];
}

interface MultiThresholdProps {
  criticalThreshold: ThresholdConfigUnion;
  operator: ThresholdOperator;
  warningThreshold: ThresholdConfigUnion;
}

export default function AlertConfigTearSheetStep2({
  form,
  updateForm,
  tagFilterExpression
}: AlertConfigTearSheetStep2Props) {
  const alertConfigWithFormModel = form.toJS();

  const { rule, threshold, mobileAppId } = alertConfigWithFormModel;
  const { metricName, alertType } = rule as MobileAppAlertRuleUnion;

  const validThreshold =
    (threshold as unknown as MultiThresholdProps)?.warningThreshold ??
    (threshold as unknown as MultiThresholdProps)?.criticalThreshold;
  const thresholdType = validThreshold?.type as ThresholdType;

  const blueprintConfig = getBlueprintConfig(alertType);

  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const { getTagCatalog, QueryBuilder: AlertQueryBuilder } = useMemo(
    //@ts-expect-error TODO fix it
    () => createBoundedAlertQueryBuilder(mobileAppId, beaconType, thresholdType, tagSuggestionTimeConfig),
    [mobileAppId, beaconType, thresholdType]
  );

  const updateTagFilterExpression = (filteredTagFilterExpression: FormModelElement[]) => {
    updateForm(
      form.updateIn(['tagFilterExpression'], (f: Item) => (f as Field<any>).setValue(filteredTagFilterExpression))
    );
  };

  useRemoveInvalidTagsFromFilterExpression(getTagCatalog, tagFilterExpression, updateTagFilterExpression);

  return (
    <Stack gap="normal">
      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.mobileApp.tearSheet.filter')} hideSpace />
      {/* Filter */}

      <div className={locals.wrapper}>
        <Stack direction="horizontal" gap="small">
          <AlertFilterConfigurator QueryBuilderComponent={AlertQueryBuilder} form={form} updateForm={updateForm} />
        </Stack>
      </div>
    </Stack>
  );
}
