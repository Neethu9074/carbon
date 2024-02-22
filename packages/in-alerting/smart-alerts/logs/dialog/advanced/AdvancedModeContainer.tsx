/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Stack } from '@instana/components';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { isCustomPayloadValidOrUntouched } from 'in-alerting/smart-alerts/components/utils/formUtils';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import ScopeFilter from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeFilter';
import ScopeGroup from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeGroup';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import TimeThreshold from 'in-alerting/smart-alerts/aggregated/TimeThreshold';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import StepsContainer from 'in-components/StepsContainer';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/dialog/advanced/AdvancedModeContainer.mless';

export default function AdvancedModeContainer(props: AlertConfigDialogPresenterProps & MainDialogControl) {
  const { form, updateForm, onChange, setTagFilterValid, tagFilterValid, timeConfig } = props;
  const thresholdType = form.get('threshold').get('type').value;
  const tagCatalog = useTagCatalog('SMART_ALERTS');

  return (
    <StepsContainer
      messages={[]}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.title'),
          valid: tagFilterValid,
          content: (
            <div className={locals.container}>
              <Stack gap="small">
                <Sections>
                  <ScopeFilter
                    form={form}
                    updateForm={updateForm}
                    tagCatalog={tagCatalog}
                    timeConfig={timeConfig}
                    setTagFilterValid={setTagFilterValid}
                  />
                  <ScopeGroup form={form} updateForm={updateForm} />
                </Sections>
              </Stack>
            </div>
          )
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.threshold.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.threshold.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.timeThreshold.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.timeThreshold.title'),
          valid: true,
          content: (
            <>
              <TimeThreshold
                form={form}
                updateForm={updateForm}
                onChange={onChange}
                oneMinuteGranularityAllowed={
                  thresholdType === STATIC_THRESHOLD && oneMinuteGranularityForStaticThresholdEnabled
                }
              />
            </>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.alertChannel.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.alertChannel.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.title'),
          valid: true,
          content: <></>
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.customPayloads.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.customPayloads.title'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: <></>
        }
      ]}
    />
  );
}
