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
import Section from 'in-settings/components/Section';
import { t } from 'in-i18n';

interface AdvancedModeContainerProp {
  form: MapForm<any>;
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
          titleToolTipText: t('in-alerting:smartAlerts.synthetics.simple.simpleAlertConfigDialogStep1Tooltip'),
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
          title: t('in-alerting:smartAlerts.synthetics.advanced.failureThresholdTitle'),
          titleToolTipText: t('in-alerting:smartAlerts.synthetics.simple.thresholdTitleHelpText'),
          valid: true,
          content: (
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
              numberOfAlertChannelListRows={7}
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
              <AlertPropertiesContainer
                renderAlertProperties={() => (
                  <AlertProperties
                    form={form}
                    onChange={onChange}
                    getDescriptionPlaceholder={() =>
                      t('in-alerting:smartAlerts.synthetics.simple.alertPropertiesDescriptionPlaceholder')
                    }
                    renderAlertPopertiesTitleRow={() => (
                      <AlertPropertiesTitleRow
                        form={form}
                        onChange={onChange}
                        getTitlePlaceholder={() =>
                          t('in-alerting:smartAlerts.synthetics.simple.alertPropertiesTitlePlaceholder')
                        }
                        placeholders={[]}
                      />
                    )}
                  />
                )}
                renderAlertPreview={() => {
                  const renderHeadline = () => (
                    <AlertPreviewHeadline
                      title={
                        nameField?.value ||
                        t('in-alerting:smartAlerts.synthetics.advanced.alertPropertiesPreviewTitlePlaceholder')
                      }
                    />
                  );
                  return (
                    <AlertPreview
                      form={form}
                      renderHeadline={renderHeadline}
                      getDescriptionPlaceholder={(_form: MapForm<any>) =>
                        (form.get('description') as Field<string>).value ||
                        t('in-alerting:smartAlerts.synthetics.advanced.alertPropertiesPreviewDescriptionPlaceholder')
                      }
                      entityLabel="Test_Name"
                      entityIconType="lib_synthetic"
                    />
                  );
                }}
              />
            </Section>
          )
        }
      ]}
    />
  );
}
