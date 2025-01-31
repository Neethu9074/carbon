/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { Dispatch, SetStateAction } from 'react';
import { MapForm } from 'formalistic';

import { Spacer, Stack } from '@instana/components';
import { Select } from '@instana/components';
import { TimeConfig } from '@instana/types';

import { ScopeWrapper, SectionWrapper } from 'in-alerting/smart-alerts/components/tearSheet/CustomWrappers/Wrapper';
import TearSheetStepTitleWrapper from 'in-alerting/components/TearSheetStepTitleWrapper';
import ScopeFilter from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeFilter';
import Section from 'in-alerting/smart-alerts/components/tearSheet/Section/Section';
import ScopeGroup from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeGroup';
import AlertTypography from 'in-alerting/components/AlertTypography';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import { t } from 'in-i18n';

interface AlertConfigTearSheetStep1Props {
  form: MapForm<any>;
  updateForm: ((form: MapForm<any>, setForm?: (form: MapForm<any>) => void) => void) | ((form: MapForm<any>) => void);
  setTagFilterValid: Dispatch<SetStateAction<boolean>>;
  timeConfig?: TimeConfig;
}

export default function AlertConfigTearSheetStep1({
  form,
  updateForm,
  timeConfig,
  setTagFilterValid
}: AlertConfigTearSheetStep1Props) {
  const tagCatalog = useTagCatalog('SMART_ALERTS');
  return (
    <>
      <TearSheetStepTitleWrapper headline="">
        <Stack direction="vertical" gap={'gutter'}>
          <Section
            title={
              <AlertTypography
                variant="body-regular"
                color="color900"
                content={t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.metric')}
              />
            }
          >
            <Select disabled>
              <option key="metric-log-count">{t('in-alerting:smartAlerts.logs.alertDetails.metricName')}</option>
            </Select>
          </Section>
        </Stack>
      </TearSheetStepTitleWrapper>

      <Spacer size="gutter" />

      <TearSheetStepTitleWrapper headline={t('in-alerting:smartAlerts.logs.tearSheet.scopeFilter.title')}>
        <Stack direction="vertical" gap="normal">
          <ScopeWrapper
            title={t('in-alerting:smartAlerts.logs.tearSheet.scopeFilter.filter')}
            description={t('in-alerting:smartAlerts.logs.tearSheet.scopeFilter.filterDescription')}
            gap="normal"
          >
            <ScopeFilter
              form={form}
              updateForm={updateForm}
              tagCatalog={tagCatalog}
              timeConfig={timeConfig}
              setTagFilterValid={setTagFilterValid}
              SectionWrapper={SectionWrapper}
            />
          </ScopeWrapper>
          <ScopeWrapper
            title={t('in-alerting:smartAlerts.logs.tearSheet.scopeGroupBy.group')}
            description={t('in-alerting:smartAlerts.logs.tearSheet.scopeGroupBy.groupByDescription')}
            gap={'normal'}
          >
            <ScopeGroup form={form} updateForm={updateForm} SectionWrapper={SectionWrapper} />
          </ScopeWrapper>
        </Stack>
      </TearSheetStepTitleWrapper>
    </>
  );
}
