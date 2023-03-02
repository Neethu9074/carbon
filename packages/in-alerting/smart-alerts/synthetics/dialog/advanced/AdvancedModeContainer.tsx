/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { Field, Item, MapForm } from 'formalistic';
import React from 'react';

// @ts-expect-error needs migration
import AlertPropertiesContainer from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPropertiesContainer';
// @ts-expect-error needs migration
import AlertProperties from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertProperties';
import {
  AlertPreview,
  AlertPreviewHeadline
} from 'in-alerting/smart-alerts/components/dialog/advanced/AlertProperties/AlertPreview';
import ConfigureAlertChannel from 'in-alerting/smart-alerts/components/dialog/ConfigureAlertChannel';
import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import StepsContainer from 'in-components/StepsContainer';
import { MessageType } from 'in-components/MessageStack';
import { t } from 'in-i18n';

interface AdvancedModeContainerProp {
  form: MapForm;
  onChange: (path: string[], updater: (item: Item) => Item) => void;
  messages?: MessageType[];
  setSliderState: (state: SliderState) => void;
  setCustomSlideInHeaderConfig: (state: { title: string | null; onClose: (() => void) | null }) => void;
}

export default function AdvancedModeContainer(props: AdvancedModeContainerProp) {
  const { form, onChange, setSliderState, setCustomSlideInHeaderConfig, messages } = props;

  const nameField = form.get('name') as Field<string>;

  return (
    <StepsContainer
      messages={messages}
      navItems={[
        {
          scrollId: '5',
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
          scrollId: '6',
          label: t('in-alerting:smartAlerts.synthetics.advanced.propertiesLabel'),
          title: t('in-alerting:smartAlerts.synthetics.advanced.propertiesTitle'),
          valid: true,
          content: (
            <AlertPropertiesContainer
              renderAlertProperties={() => (
                <AlertProperties
                  form={form}
                  onChange={onChange}
                  getDescriptionPlaceholder={() => 'some Description'}
                  getPreviewTitlePlaceholder={() => 'some Preview Title'}
                  renderAlertPopertiesTitleRow={() => 'some Row Title'}
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
          )
        }
      ]}
    />
  );
}
