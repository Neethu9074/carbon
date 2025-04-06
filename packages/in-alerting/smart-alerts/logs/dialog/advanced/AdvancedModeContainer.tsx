/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { Stack } from '@instana/components';

import {
  AlertConfigDialogPresenterProps,
  MainDialogControl
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
import ThresholdSelectionInteractiveChart from 'in-alerting/smart-alerts/logs/dialog/advanced/ThresholdSelectionInteractiveChart';
import {
  isCustomPayloadValidOrUntouched,
  fieldTouchedAndInvalid
} from 'in-alerting/smart-alerts/components/utils/formUtils';
import { LogMultiThresholdAlertPreview } from 'in-alerting/smart-alerts/logs/dialog/advanced/LogMultiThresholdAlertPreview';
import ConfigureAlertChannelMT from 'in-alerting/smart-alerts/components/multiThresholdAlertChannels/ConfigureAlertChannel';
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import { getDescriptionPlaceholder, getTitlePlaceholder } from 'in-alerting/smart-alerts/logs/form/formUtils';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/dialog/advanced/GracePeriodWrapper';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/eum/components/AlertPropertiesTitleRow';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import { oneMinuteGranularityForStaticThresholdEnabled } from 'in-services/featureFlags';
import ScopeFilter from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeFilter';
import ScopeGroup from 'in-alerting/smart-alerts/logs/dialog/advanced/ScopeGroup';
import { STATIC_THRESHOLD } from 'in-alerting/smart-alerts/data/thresholdTypes';
import { alertChannelPerSeverityLogSaEnabled } from 'in-services/featureFlags';
import TimeThreshold from 'in-alerting/smart-alerts/aggregated/TimeThreshold';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import useTagCatalog from 'in-logging/hooks/useTagCatalog';
import StepsContainer from 'in-components/StepsContainer';
import { MessageType } from 'in-components/MessageStack';
import Sections from 'in-components/workspace/Sections';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/logs/dialog/advanced/AdvancedModeContainer.mless';

interface AdvancedModeContainerProp {
  updateForm?: (form: MapForm<any>) => void;
  messages?: MessageType[];
}

export default function AdvancedModeContainer(
  props: AdvancedModeContainerProp & AlertConfigDialogPresenterProps & MainDialogControl
) {
  const {
    form,
    updateForm,
    onChange,
    setTagFilterValid,
    tagFilterValid,
    timeConfig,
    setSliderState,
    setCustomSlideInHeaderConfig,
    onChartViewConfigChange,
    selectedChartViewConfigIndex,
    TagBasedPayloadConfigurator,
    messages
  } = props;
  const thresholdType = form.get('threshold').get('warningThreshold').get('type').value;
  const tagCatalog = useTagCatalog('SMART_ALERTS');

  return (
    <StepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.title'),
          valid: tagFilterValid,
          content: (
            <div className={locals.container}>
              <Stack gap="small">
                <SelectInSection
                  label={t('in-alerting:smartAlerts.logs.advancedModeContainer.scope.metric')}
                  id="metric-selector"
                  useAlternateBg
                  disabled
                >
                  <option key="metric-log-count">{t('in-alerting:smartAlerts.logs.alertDetails.metricName')}</option>
                </SelectInSection>
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
          valid: isThresholdSectionValid(),
          content: (
            <ThresholdSelectionInteractiveChart
              form={form}
              onChartViewConfigChange={onChartViewConfigChange}
              selectedChartViewConfigIndex={selectedChartViewConfigIndex}
              updateForm={updateForm}
              tagCatalog={tagCatalog}
            />
          )
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
              <GracePeriodWrapper form={form} updateForm={updateForm} />
            </>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.alertChannel.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.alertChannel.title'),
          valid: true,
          content: (
            <>
              {alertChannelPerSeverityLogSaEnabled ? (
                <ConfigureAlertChannelMT
                  form={form}
                  onChange={onChange}
                  updateForm={updateForm}
                  setSliderState={setSliderState}
                  setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                  numberOfAlertChannelListRows={5}
                />
              ) : (
                <ConfigureAlertChannel
                  form={form}
                  onChange={onChange}
                  setSliderState={setSliderState}
                  setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                  numberOfAlertChannelListRows={5}
                />
              )}
            </>
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.properties.title'),
          valid: true,
          content: (
            <AlertPropertiesContainer
              renderAlertProperties={() => (
                <AlertProperties
                  form={form}
                  onChange={onChange}
                  getDescriptionPlaceholder={getDescriptionPlaceholder}
                  renderAlertPropertiesTitleRow={() => (
                    <AlertPropertiesTitleRow
                      form={form}
                      onChange={onChange}
                      getTitlePlaceholder={getTitlePlaceholder}
                    />
                  )}
                  shouldDisplayAlertLevelSelection={false}
                />
              )}
              renderAlertPreview={() => (
                <LogMultiThresholdAlertPreview form={form} getDescriptionPlaceholder={getDescriptionPlaceholder} />
              )}
            />
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.logs.advancedModeContainer.customPayloads.label'),
          title: t('in-alerting:smartAlerts.logs.advancedModeContainer.customPayloads.title'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: (
            <>
              <GlobalCustomPayloadCard context="LOG" />
              <AlertConfigCustomPayload
                form={form}
                setForm={updateForm}
                TagBasedPayloadConfigurator={TagBasedPayloadConfigurator}
                supportDynamicTypes
              />
            </>
          )
        }
      ]}
    />
  );
  function isThresholdSectionValid(): boolean {
    return !fieldTouchedAndInvalid(form.get('threshold'));
  }
}
