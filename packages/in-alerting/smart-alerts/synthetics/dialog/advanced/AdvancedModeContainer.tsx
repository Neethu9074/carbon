/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Item, MapForm } from 'formalistic';
import React from 'react';

import {
  SliderState,
  AlertConfigDialogPresenterProps,
  MainDialogControl,
  SlideInConfig
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/synthetics/components/AlertTagFilterExpressionConfig';
import SimpleModeDialogThreshold from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleModeDialogThreshold';
import SyntheticsAlertProperties from 'in-alerting/smart-alerts/synthetics/dialog/SyntheticsAlertProperties';
import GlobalCustomPayloadCard from 'in-alerting/smart-alerts/components/details/GlobalCustomPayloadCard';
import GracePeriodWrapper from 'in-alerting/smart-alerts/components/dialog/advanced/GracePeriodWrapper';
import { isCustomPayloadValidOrUntouched } from 'in-alerting/smart-alerts/components/utils/formUtils';
import AlertConfigCustomPayload from 'in-alerting/components/CustomPayload/AlertConfigCustomPayload';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import ConfigureAlertTest from 'in-alerting/smart-alerts/synthetics/components/ConfigureAlertTest';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import StepsContainer from 'in-components/StepsContainer';
import { MessageType } from 'in-components/MessageStack';
import Section from 'in-settings/components/Section';
import { t } from 'in-i18n';

interface AdvancedModeContainerProp {
  form: MapForm<any>;
  updateForm?: (form: MapForm<any>) => void;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  messages?: MessageType[];
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
  QueryBuilderComponent: QueryBuilderComponent;
  TagBasedPayloadConfigurator: React.ReactNode;
  headerTransparent?: boolean;
}

export default function AdvancedModeContainer(
  props: AdvancedModeContainerProp & AlertConfigDialogPresenterProps & MainDialogControl & SlideInConfig
) {
  const {
    form,
    updateForm,
    onChange,
    setSliderState,
    setCustomSlideInHeaderConfig,
    TagBasedPayloadConfigurator,
    messages,
    headerTransparent = false,
    isTagFilterFormModelValid
  } = props;

  return (
    <StepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.synthetics.advanced.alertTestsLabel'),
          title: t('in-alerting:smartAlerts.synthetics.advanced.alertTestsTitle'),
          titleToolTipText: t('in-alerting:smartAlerts.synthetics.simple.simpleAlertConfigDialogStep1Tooltip'),
          valid: true,
          content: <ConfigureAlertTest {...props} />
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.synthetics.advanced.scopeFilterLabel'),
          title: t('in-alerting:smartAlerts.synthetics.simple.scopeHeadline'),
          titleToolTipText: t('in-alerting:smartAlerts.synthetics.simple.scopeDescription'),
          valid: isTagFilterFormModelValid,
          content: <AlertTagFilterExpressionConfig {...props} headerTransparent={headerTransparent} />
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.synthetics.advanced.failureThresholdLabel'),
          title: t('in-alerting:smartAlerts.synthetics.advanced.failureThresholdTitle'),
          titleToolTipText: t('in-alerting:smartAlerts.synthetics.simple.thresholdTitleHelpText'),
          valid: true,
          content: (
            <>
              <LightCard
                title={t('in-alerting:smartAlerts.synthetics.advanced.failureThreshold')}
                withoutPadding={false}
                darkFrame
              >
                <SimpleModeDialogThreshold
                  {...props}
                  subTitleToolTipText={t('in-alerting:smartAlerts.synthetics.simple.thresholdSubTitleHelpText')}
                />
              </LightCard>
              <GracePeriodWrapper form={form} updateForm={updateForm} />
            </>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.synthetics.advanced.alertChannelsLabel'),
          title: t('in-alerting:smartAlerts.synthetics.advanced.alertChannelsTitle'),
          valid: true,
          content: (
            <ConfigureAlertChannel
              form={form}
              onChange={onChange}
              setSliderState={setSliderState}
              setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
              numberOfAlertChannelListRows={5}
            />
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.synthetics.advanced.propertiesLabel'),
          title: t('in-alerting:smartAlerts.synthetics.advanced.propertiesTitle'),
          valid: true,
          content: (
            <Section>
              <SyntheticsAlertProperties form={form} onChange={onChange} />
            </Section>
          )
        },
        {
          scrollId: '6',
          label: t('in-alerting:smartAlerts.websites.advanced.payloadsLabel'),
          title: t('in-alerting:smartAlerts.websites.advanced.payloadsTitle'),
          valid: isCustomPayloadValidOrUntouched(form),
          content: (
            <>
              <GlobalCustomPayloadCard context="SYNTHETIC" />

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
}
