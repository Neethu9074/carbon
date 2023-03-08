/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

import {
  SliderState,
  AlertConfigDialogPresenterProps,
  MainDialogControl,
  SlideInConfig
} from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
// @ts-expect-error needs migration
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
// @ts-expect-error needs migration
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import AlertTagFilterExpressionConfig from 'in-alerting/smart-alerts/synthetics/components/AlertTagFilterExpressionConfig';
import SimpleModeDialogThreshold from 'in-alerting/smart-alerts/synthetics/dialog/simple/SimpleModeDialogThreshold';
import AlertPropertiesTitleRow from 'in-alerting/smart-alerts/components/dialog/advanced/AlertPropertiesTitleRow';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import ConfigureAlertTest from 'in-alerting/smart-alerts/synthetics/components/ConfigureAlertTest';
import LightCard from 'in-alerting/components/LightCard/LightCard';
import { QueryBuilderComponent } from 'in-components/QueryBuilder';
import StepsContainer from 'in-components/StepsContainer';
import { MessageType } from 'in-components/MessageStack';
import { t } from 'in-i18n';

interface AdvancedModeContainerProp {
  form: MapForm;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  messages?: MessageType[];
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
  QueryBuilderComponent: QueryBuilderComponent;
  headerTransparent?: boolean;
}

export default function AdvancedModeContainer(
  props: AdvancedModeContainerProp & AlertConfigDialogPresenterProps & MainDialogControl & SlideInConfig
) {
  const { form, onChange, setSliderState, setCustomSlideInHeaderConfig, messages, headerTransparent = false } = props;

  const nameField = form.get('name') as Field<string>;
  return (
    <StepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '1',
          label: t('in-alerting:smartAlerts.synthetics.advanced.alertTestsLabel'),
          title: t('in-alerting:smartAlerts.synthetics.advanced.alertTestsTitle'),
          valid: true,
          content: <ConfigureAlertTest {...props} />
        },
        {
          scrollId: '2',
          label: t('in-alerting:smartAlerts.synthetics.advanced.scopeFilterLabel'),
          title: t('in-alerting:smartAlerts.synthetics.simple.scopeHeadline'),
          valid: true,
          content: <AlertTagFilterExpressionConfig {...props} headerTransparent={headerTransparent} />
        },
        {
          scrollId: '3',
          label: t('in-alerting:smartAlerts.synthetics.advanced.failureThresholdLabel'),
          title: '',
          valid: true,
          content: (
            <LightCard
              title={t('in-alerting:smartAlerts.synthetics.advanced.failureThreshold')}
              withoutPadding={false}
              darkFrame
            >
              <SimpleModeDialogThreshold
                {...props}
                title={t('in-alerting:smartAlerts.synthetics.advanced.failureThresholdTitle')}
              />
            </LightCard>
          )
        },
        {
          scrollId: '4',
          label: t('in-alerting:smartAlerts.synthetics.advanced.alertChannelsLabel'),
          title: '',
          valid: true,
          content: (
            <LightCard
              title={t('in-alerting:smartAlerts.synthetics.advanced.alertChannelsLabel')}
              withoutPadding={false}
              darkFrame
            >
              <ConfigureAlertChannel
                form={form}
                onChange={onChange}
                setSliderState={setSliderState}
                setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
                numberOfAlertChannelListRows={7}
              />
            </LightCard>
          )
        },
        {
          scrollId: '5',
          label: t('in-alerting:smartAlerts.synthetics.advanced.propertiesLabel'),
          title: '',
          valid: true,
          content: (
            <LightCard
              title={t('in-alerting:smartAlerts.synthetics.advanced.propertiesLabel')}
              withoutPadding={false}
              darkFrame
            >
              <AlertPropertiesContainer
                renderAlertProperties={() => (
                  <AlertProperties
                    form={form}
                    onChange={onChange}
                    getDescriptionPlaceholder={() => 'some Description'}
                    getPreviewTitlePlaceholder={() => 'some Preview Title'}
                    renderAlertPopertiesTitleRow={() => (
                      <AlertPropertiesTitleRow
                        form={form}
                        onChange={onChange}
                        getTitlePlaceholder={() => (form.get('name') as Field<string>).value ?? 'undefined'}
                        placeholders={[]}
                      />
                    )}
                  />
                )}
                renderAlertPreview={() => {
                  const renderHeadline = () => <AlertPreviewHeadline title={nameField?.value ?? 'placeholder text'} />;
                  return (
                    <AlertPreview
                      form={form}
                      renderHeadline={renderHeadline}
                      getDescriptionPlaceholder={(_form: MapForm) => 'some Description Placeholder'}
                      entityIconType="lib_synthetic"
                    />
                  );
                }}
              />
            </LightCard>
          )
        }
      ]}
    />
  );
}
