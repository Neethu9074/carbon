/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import { Item, MapForm } from 'formalistic';

import { Spacer, Stack } from '@instana/components';

//@ts-expect-error TS migration
import ScopeGroup from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeGroup';
import { ScopeWrapper, SectionWrapper } from 'in-alerting/smart-alerts/components/tearSheet/CustomWrappers/Wrapper';
import ScopeAlertEvaluation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAlertEvaluation';
import { ThresholdChart } from 'in-alerting/smart-alerts/infrastructure/tearsheet/components/ThresholdChart';
import ScopeAggregation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation';
import ScopeMetric from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeMetric';
import ScopeFilter from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeFilter';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import AlertTypography from 'in-alerting/components/AlertTypography';
import useTagCatalog from 'in-infrastructure/hooks/useTagCatalog';
import { t } from 'in-i18n';

interface AlertConfigTearSheetStep1Props {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  setTagFilterValid: Dispatch<SetStateAction<boolean>>;
  onChartViewConfigChange?: (arg: number) => void;
  selectedChartViewConfigIndex?: number;
}

export default function AlertConfigTearSheetStep1({
  form,
  updateForm,
  onChange,
  setTagFilterValid,
  onChartViewConfigChange,
  selectedChartViewConfigIndex
}: AlertConfigTearSheetStep1Props) {
  const entityType = form.get('rule')?.get('entityType')?.value;
  const metric = form.get('rule')?.get('metricName')?.value;
  const isRegex = form.get('rule').get('regex')?.value;
  const tagCatalog = useTagCatalog({ ownerType: entityType, metric, regex: isRegex });

  return (
    <>
      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.step1.header')}>
        <div>
          <Stack direction="vertical" gap={'gutter'}>
            {/* select Metric */}
            <Section
              title={
                <AlertTypography
                  variant="body-regular"
                  color="color900"
                  content={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.metric.metric')}
                />
              }
            >
              <ScopeMetric form={form} updateForm={updateForm} onChange={onChange} isRegex={isRegex} isTearsheet />
            </Section>

            {/* select aggregation  */}
            <ScopeAggregation form={form} updateForm={updateForm} isTearSheet />

            {/* select alerting method */}
            <ScopeAlertEvaluation form={form} updateForm={updateForm} SectionWrapper={Section} />
          </Stack>
        </div>
      </TearSheetStepTitleWrapper>

      <Spacer size="gutter" />

      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeFilter.title')}>
        <div>
          <Stack gap="normal">
            <ScopeWrapper
              title={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeFilter.filter')}
              description={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeFilter.filterDescription')}
              gap="normal"
            >
              {/* add filter */}
              <ScopeFilter
                form={form}
                updateForm={updateForm}
                tagCatalog={tagCatalog}
                setTagFilterValid={setTagFilterValid}
                SectionWrapper={SectionWrapper}
              />
            </ScopeWrapper>

            {/* add grouping */}
            <ScopeWrapper
              title={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeGroupBy.group')}
              description={t('in-alerting:smartAlerts.infrastructure.tearSheet.scopeGroupBy.groupByDescription')}
              gap={'normal'}
            >
              <ScopeGroup form={form} updateForm={updateForm} tagCatalog={tagCatalog} SectionWrapper={SectionWrapper} />
            </ScopeWrapper>
          </Stack>
        </div>
      </TearSheetStepTitleWrapper>
      <ThresholdChart
        form={form}
        onChartViewConfigChange={onChartViewConfigChange}
        selectedChartViewConfigIndex={selectedChartViewConfigIndex}
      />
    </>
  );
}
