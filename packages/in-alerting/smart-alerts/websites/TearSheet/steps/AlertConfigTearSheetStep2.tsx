/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { Item, MapForm, Field } from 'formalistic';
import React, { useMemo } from 'react';

import { Spacer, Stack } from '@instana/components';

import { useRemoveInvalidTagsFromFilterExpression } from 'in-alerting/smart-alerts/hooks/useRemoveInvalidTagsFromFilterExpression';
import { createBoundedAlertQueryBuilder } from 'in-alerting/smart-alerts/websites/components/AlertQueryBuilder';
import { WebsiteSmartAlertConfigWithMetadata } from 'in-alerting/smart-alerts/eum/data/eumAlertConfigTypes';
import AlertFilterConfigurator from 'in-alerting/smart-alerts/components/dialog/AlertFilterConfigurator';
import { ScopeWrapper } from 'in-alerting/smart-alerts/components/tearSheet/CustomWrappers/Wrapper';
import { getBlueprintConfig } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import { FormModelElement } from 'in-components/QueryBuilder/transformation/formModel';
import { MetricName } from 'in-alerting/smart-alerts/websites/data/blueprintConfig';
import { days } from 'in-services/time';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/TearSheet/steps/AlertConfigTearSheetStep2.mless';

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

export default function AlertConfigTearSheetStep2({
  form,
  updateForm,
  tagFilterExpression
}: AlertConfigTearSheetStep2Props) {
  const alertConfigWithFormModel = form.toJS();

  const { rule, threshold, websiteId } = alertConfigWithFormModel as unknown as WebsiteSmartAlertConfigWithMetadata;
  const { metricName, alertType } = rule;

  const blueprintConfig = getBlueprintConfig(alertType);

  const beaconType = blueprintConfig.getBeaconType(metricName as MetricName);

  const validThreshold = (threshold as any)?.warningThreshold?.type
    ? (threshold as any).warningThreshold
    : (threshold as any)?.criticalThreshold;

  const { getTagCatalog, QueryBuilder: AlertQueryBuilder } = useMemo(
    () => createBoundedAlertQueryBuilder(websiteId, beaconType, validThreshold?.type, tagSuggestionTimeConfig),
    [websiteId, beaconType, validThreshold?.type]
  );

  const updateTagFilterExpression = (filteredTagFilterExpression: FormModelElement[]) => {
    updateForm(
      form.updateIn(['tagFilterExpression'], (f: Item) => (f as Field<any>).setValue(filteredTagFilterExpression))
    );
  };

  useRemoveInvalidTagsFromFilterExpression(getTagCatalog, tagFilterExpression, updateTagFilterExpression);

  return (
    <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.websites.tearSheet.step2.description')} hideSpace>
      {/* Filter */}
      <Stack gap="normal">
        <Spacer size="small" />
        <ScopeWrapper
          title={t('in-alerting:smartAlerts.websites.tearSheet.filter')}
          description={t('in-alerting:smartAlerts.websites.tearSheet.filterDescription')}
          gap="normal"
        >
          <div className={locals.wrapper}>
            <Stack direction="horizontal" gap="small">
              <AlertFilterConfigurator QueryBuilderComponent={AlertQueryBuilder} form={form} updateForm={updateForm} />
            </Stack>
          </div>
        </ScopeWrapper>
      </Stack>
    </TearSheetStepTitleWrapper>
  );
}
