/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm } from 'formalistic';
import { Field } from 'formalistic';
import React from 'react';

import { Button } from '@instana/components';

import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
import MobileAppCustomEventsList from 'in-alerting/smart-alerts/mobileApp/components/CustomEventsList';
//@ts-expect-error TS migration
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import WebsiteCustomEventsList from 'in-alerting/smart-alerts/websites/components/CustomEventsList';
import { SliderState } from 'in-alerting/smart-alerts/components/dialog/AlertConfigDialogPresenter';
import { eumType as mobileAppEum } from 'in-alerting/smart-alerts/mobileApp/constants';
import { eumType as websiteEum } from 'in-alerting/smart-alerts/websites/constants';
import createThresholdForm from 'in-alerting/smart-alerts/eum/form/thresholdForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import { TimeConfig } from 'in-types';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/eum/components/ProvideCustomEvent.mless';

interface ProvideCustomEventProps {
  form: MapForm<any>;
  timeConfig: TimeConfig;
  onSelectCustomEvent: ({ slideInConfig, isVisible }: SliderState) => void;
  mode: string;
  updateForm: (form: MapForm<any>) => void;
  eumType: string;
  tearSheetView?: boolean;
}

export default function ProvideCustomEvent({
  form,
  timeConfig,
  onSelectCustomEvent,
  mode,
  updateForm,
  eumType,
  tearSheetView
}: ProvideCustomEventProps) {
  const customEventNameField = form.get('rule').get('customEventName');

  const onValueChange = (value: string) => {
    let updatedForm = form.updateIn(['rule', 'customEventName'], f =>
      (f as Field<string>).setValue(value ?? '').setTouched(true)
    );

    if (mode !== modeAdvanced) {
      // here, in simple-mode, the backend could have set the type to static silently,
      // so we need to reset it, before fetching the new baseline
      //
      // This is done, to easily get started in simple mode, and even do not bother the
      // user with a not-enough-data message
      const threshold = form.get('threshold').toJS();
      const thresholdWithHistoricBaseline = {
        ...threshold,
        rule: {
          ...threshold.rule,
          alertType: 'customEvent',
          customEventName: value ?? ''
        },
        criticalThreshold: {
          ...threshold.criticalThreshold,
          type: HISTORIC_BASELINE,
          isCheckboxSelected: threshold?.criticalThreshold?.isChekboxSelected ?? false
        },
        warningThreshold: {
          ...threshold.warningThreshold,
          type: HISTORIC_BASELINE,
          isCheckboxSelected: threshold?.warningThreshold?.isChekboxSelected ?? true
        }
      };
      // @ts-ignore
      updatedForm = updatedForm.put(
        'threshold',
        createThresholdForm(thresholdWithHistoricBaseline, 'customEvent').setTouched(true)
      );
    }

    return updateForm(updatedForm);
  };

  return customEventNameField.map((field: Field<string>) => (
    <div className={locals.container}>
      {mode === modeAdvanced && (
        <>
          <HorizontalFlexWrapper className={locals.customEventWrapper}>
            <CustomEventInput field={field} onValueChange={onValueChange} />
            {!tearSheetView && (
              <SelectCustomEventButton
                form={form}
                onValueChange={onValueChange}
                onSelectCustomEvent={onSelectCustomEvent}
                timeConfig={timeConfig}
                eumType={eumType}
              />
            )}
          </HorizontalFlexWrapper>
          <TouchedMessages field={customEventNameField} />
        </>
      )}
      {mode !== modeAdvanced && (
        <>
          <SelectCustomEventButton
            form={form}
            onValueChange={onValueChange}
            onSelectCustomEvent={onSelectCustomEvent}
            timeConfig={timeConfig}
            eumType={eumType}
          />
          <FormGroup className={locals.customEventInputSimpleMode}>
            <Label htmlFor="custom-event-name" hasError={!field.valid && field.touched}>
              {t('in-alerting:smartAlerts.eum.customEvent.customEventLabel')}
            </Label>
            <CustomEventInput field={field} onValueChange={onValueChange} />
            <TouchedMessages field={customEventNameField} />
          </FormGroup>
        </>
      )}
    </div>
  ));
}

interface SelectCustomEventButtonProps {
  form: MapForm<any>;
  timeConfig: TimeConfig;
  onSelectCustomEvent: ({ slideInConfig, isVisible }: SliderState) => void;
  onValueChange: (arg: string) => void;
  eumType: string;
}

function SelectCustomEventButton({
  form,
  onSelectCustomEvent,
  onValueChange,
  timeConfig,
  eumType
}: SelectCustomEventButtonProps) {
  return (
    <Button
      onClick={() =>
        onSelectCustomEvent({
          slideInConfig: {
            component: (
              <AlertConfigSlideInContentWrapper>
                {eumType === websiteEum && (
                  <WebsiteCustomEventsList
                    websiteId={form.get('websiteId').value}
                    tagFilterExpression={form.get('tagFilterExpression').value}
                    timeConfig={timeConfig}
                    onCustomEventSelect={onValueChange}
                    slideOut={() => onSelectCustomEvent({ isVisible: false })}
                  />
                )}
                {eumType === mobileAppEum && (
                  <MobileAppCustomEventsList
                    mobileAppId={form.get('mobileAppId').value}
                    tagFilterExpression={form.get('tagFilterExpression').value}
                    timeConfig={timeConfig}
                    onCustomEventSelect={onValueChange}
                    slideOut={() => onSelectCustomEvent({ isVisible: false })}
                  />
                )}
              </AlertConfigSlideInContentWrapper>
            ),
            title: t('in-alerting:smartAlerts.eum.customEvent.customEventSelectionSliderTitle')
          },
          isVisible: true
        })
      }
    >
      {t('in-alerting:smartAlerts.eum.customEvent.searchCustomEventButtonLabel')}
    </Button>
  );
}

interface CustomEventInputProps {
  field: Field<string>;
  onValueChange: (arg: string) => void;
}

function CustomEventInput({ field, onValueChange }: CustomEventInputProps) {
  return (
    <DebouncedInput
      className={locals.customEventInput}
      delay={300}
      id="custom-event-name"
      type="text"
      onValueChange={onValueChange}
      value={field.value}
      hasError={!field.valid && field.touched}
      pure={false}
      maxLength={512}
      placeholder={t('in-alerting:smartAlerts.eum.customEvent.customEventInputPlaceholder')}
    />
  );
}
