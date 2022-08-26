/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/smart-alert-dialog/AlertConfigSlideInContentWrapper';
import CustomEventsList from 'in-alerting/smart-alerts/websites/components/CustomEventsList';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import { modeAdvanced } from 'in-alerting/smart-alerts/websites/constants';
import DebouncedInput from 'in-components/form/Input/DebouncedInput';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-components/form/FormGroup';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from 'in-alerting/smart-alerts/websites/components/ProvideCustomEvent.mless';

export default function ProvideCustomEvent({ form, timeConfig, onSelectCustomEvent, mode, updateForm }) {
  const customEventNameField = form.get('rule').get('customEventName');
  const onValueChange = value =>
    updateForm(form.updateIn(['rule', 'customEventName'], f => f.setValue(value ?? '').setTouched(true)));
  const SelectCustomEventButton = () => (
    <Button
      onClick={() =>
        onSelectCustomEvent({
          slideInConfig: {
            component: (
              <AlertConfigSlideInContentWrapper>
                <CustomEventsList
                  websiteId={form.get('websiteId').value}
                  tagFilterExpression={form.get('tagFilterExpression').value}
                  timeConfig={timeConfig}
                  onCustomEventSelect={customEventName => {
                    updateForm(
                      form.updateIn(['rule', 'customEventName'], f => f.setValue(customEventName).setTouched(true))
                    );
                  }}
                  slideOut={() => onSelectCustomEvent({ isVisible: false })}
                />
              </AlertConfigSlideInContentWrapper>
            ),
            title: t('in-alerting:smartAlerts.websites.customEvent.customEventSelectionSliderTitle')
          },
          isVisible: true
        })
      }
    >
      {t('in-alerting:smartAlerts.websites.customEvent.searchCustomEventButtonLabel')}
    </Button>
  );

  return customEventNameField.map(field => (
    <div className={locals.container}>
      {mode === modeAdvanced && (
        <>
          <HorizontalFlexWrapper className={locals.customEventWrapper}>
            <CustomEventInput field={field} onValueChange={onValueChange} />
            <SelectCustomEventButton />
          </HorizontalFlexWrapper>
          <TouchedMessages field={customEventNameField} />
        </>
      )}
      {mode !== modeAdvanced && (
        <>
          <SelectCustomEventButton />
          <FormGroup className={locals.customEventInputSimpleMode}>
            <Label htmlFor="custom-event-name" hasError={!field.valid && field.touched}>
              {t('in-alerting:smartAlerts.websites.customEvent.customEventLabel')}
            </Label>
            <CustomEventInput field={field} onValueChange={onValueChange} />
            <TouchedMessages field={customEventNameField} />
          </FormGroup>
        </>
      )}
    </div>
  ));
}

ProvideCustomEvent.propTypes = {
  form: PropTypes.object.isRequired,
  mode: PropTypes.string.isRequired,
  updateForm: PropTypes.func.isRequired,
  onSelectCustomEvent: PropTypes.func.isRequired,
  timeConfig: PropTypes.object.isRequired
};

function CustomEventInput({ field, onValueChange }) {
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
      placeholder={t('in-alerting:smartAlerts.websites.customEvent.customEventInputPlaceholder')}
    />
  );
}
