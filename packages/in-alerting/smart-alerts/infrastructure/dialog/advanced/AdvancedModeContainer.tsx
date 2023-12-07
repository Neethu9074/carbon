/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import { Stack } from '@instana/components';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
//@ts-expect-error
import ScopeGroup from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeGroup';
import ScopeAggregation from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeAggregation';
import ScopeMetric from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeMetric';
import ScopeFilter from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ScopeFilter';
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/ThresholdSelectionInteractiveChart';
import { fieldTouchedAndInvalid } from 'in-alerting/smart-alerts/components/utils/formUtils';
import StepsContainer from 'in-components/StepsContainer';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/infrastructure/dialog/advanced/AdvancedModeContainer.mless';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form, onChartViewConfigChange, selectedChartViewConfigIndex, updateForm, onChange } = props;

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.title'),
          valid: true,
          content: (
            <div className={locals.container}>
              <Stack gap="xsmall">
                <Sections>
                  <Section
                    title={t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.scope.metric.metric')}
                  >
                    <ScopeMetric form={form} updateForm={updateForm} onChange={onChange} />
                  </Section>
                  <ScopeAggregation form={form} updateForm={updateForm} />
                  <ScopeFilter form={form} updateForm={updateForm} />
                  <ScopeGroup form={form} updateForm={updateForm} />
                </Sections>
              </Stack>
            </div>
          )
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.threshold.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.threshold.title'),
          valid: isThresholdSectionValid(),
          content: (
            <>
              <ThresholdSelectionInteractiveChart
                form={form}
                onChartViewConfigChange={onChartViewConfigChange}
                selectedChartViewConfigIndex={selectedChartViewConfigIndex}
                // @ts-expect-error updateForm is required
                updateForm={updateForm}
              />
            </>
          )
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.timeThreshold.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.alertChannel.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.alertChannel.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.properties.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.customPayloads.label'),
          title: t('in-alerting:smartAlerts.infrastructure.advancedModeContainer.customPayloads.title'),
          valid: true,
          content: <></>
        }
      ]}
    />
  );

  function isThresholdSectionValid() {
    if (fieldTouchedAndInvalid(form.get('threshold'))) {
      return false;
    }
    return true;
  }
}
