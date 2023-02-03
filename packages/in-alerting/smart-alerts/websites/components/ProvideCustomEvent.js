/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import PropTypes from 'prop-types';
import React from 'react';

import { Button } from '@instana/components';

import AlertConfigSlideInContentWrapper from 'in-alerting/smart-alerts/components/dialog/AlertConfigSlideInContentWrapper';
import CustomEventsList from 'in-alerting/smart-alerts/websites/components/CustomEventsList';
import createThresholdForm from 'in-alerting/smart-alerts/websites/form/thresholdForm';
import { HISTORIC_BASELINE } from 'in-alerting/smart-alerts/data/thresholdTypes';
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

  const onValueChange = value => {
    let updatedForm = form.updateIn(['rule', 'customEventName'], f => f.setValue(value ?? '').setTouched(true));

    if (mode !== modeAdvanced) {
      // here, in simple-mode, the backend could have set the type to static silently,
      // so we need to reset it, before fetching the new baseline
      //
      // This is done, to easily get started in simple mode, and even do not bother the
      // user with a not-enough-data message
      const threshold = form.get('threshold').toJS();
      const thresholdWithHistoricBaseline = { ...threshold, type: HISTORIC_BASELINE };
      updatedForm = updatedForm
        .updateIn(['rule', 'customEventName'], f => f.setValue(value ?? '').setTouched(true))
        .put('threshold', createThresholdForm(thresholdWithHistoricBaseline, 'customEvent').setTouched(true));
    }

    return updateForm(updatedForm);
  };

  return customEventNameField.map(field => (
    <div className={locals.container}>
      {mode === modeAdvanced && (
        <>
          <HorizontalFlexWrapper className={locals.customEventWrapper}>
            <CustomEventInput field={field} onValueChange={onValueChange} />
            <SelectCustomEventButton
              form={form}
              onValueChange={onValueChange}
              onSelectCustomEvent={onSelectCustomEvent}
              timeConfig={timeConfig}
            />
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
          />
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

function SelectCustomEventButton({ form, onSelectCustomEvent, onValueChange, timeConfig }) {
  return (
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
                  onCustomEventSelect={onValueChange}
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
