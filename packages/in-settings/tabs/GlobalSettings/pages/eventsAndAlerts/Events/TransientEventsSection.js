/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useState } from 'react';
import { union } from 'lodash';

import {
  Toggle,
  CarbonRadioButton as RadioButton,
  CarbonRadioButtonGroup as RadioButtonGroup,
  Dropdown
} from '@instana/components';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import HelpText from 'in-components/form/HelpText';
import ComboBox from 'in-components/ComboBox';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

import locals from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/TransientEventsSection.mless';

const TRANSIENT_ENABLED = 'transientEventEnabled';
const TRANSIENT_THRESHOLD = 'transientEventThreshold';
const TRANSIENT_NOTIFICATION = 'transientEventAlertMuted';

const DurationUnit = {
  minutes: 'MINUTES',
  hours: 'HOURS'
};

export const durationToMillis = ({ amount = 0, unit = DurationUnit.minutes }) =>
  unit === DurationUnit.hours ? amount * 60 * 60000 : amount * 60000;

// const maxForUnit = unit => (unit === DurationUnit.hours ? 23 : 59);

export default function TransientEventsSection({ form, onChange, disabled }) {
  const enabledField = form.get(TRANSIENT_ENABLED);
  const thresholdField = form.get(TRANSIENT_THRESHOLD);
  const notificationField = form.get(TRANSIENT_NOTIFICATION);

  const enabled = Boolean(enabledField?.value);
  const alertMuted = Boolean(notificationField?.value);
  const threshold = thresholdField?.value ?? {
    amount: 5,
    unit: DurationUnit.minutes
  };

  return (
    <>
      <Row>
        <Col lg={6}>
          <Label htmlFor="transient-event-hint">{t('in-settings:tabs.transientEventHint')}</Label>
        </Col>
      </Row>

      <Row>
        <Col lg={3}>
          {enabledField && (
            <FormGroup>
              <Toggle
                id="transient-enable"
                name="transient-enable"
                size="sm"
                checked={enabled}
                onToggle={v => onChange(TRANSIENT_ENABLED, v)}
                labelA={t('in-settings:tabs.enableTransientToggle')}
                labelB={t('in-settings:tabs.enableTransientToggle')}
              />
            </FormGroup>
          )}
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
          {thresholdField && (
            <FormGroup>
              <Label htmlFor="transient-threshold" hasError={!thresholdField.valid && thresholdField.touched}>
                {t('in-settings:tabs.transientThreshold')}
              </Label>
              <HorizontalFlexWrapper className={locals.gap}>
                <Input
                  id="transient-threshold"
                  type="number"
                  size={3}
                  // max={maxForUnit(threshold.unit)}
                  placeholder="#"
                  disabled={disabled || !enabled}
                  value={thresholdField.value ?? 5}
                  onChange={e => onChange(TRANSIENT_THRESHOLD, { ...threshold, amount: e.target.valueAsNumber })}
                  hasError={!thresholdField.valid && thresholdField.touched}
                />
                <ComboBox
                  isClearable={false}
                  isDisabled={disabled || !enabled}
                  value={threshold.unit}
                  options={[
                    { value: DurationUnit.minutes, label: 'Minutes' },
                    { value: DurationUnit.hours, label: 'Hours' }
                  ]}
                  onChange={v =>
                    onChange(TRANSIENT_THRESHOLD, {
                      ...threshold,
                      unit: v.value
                    })
                  }
                />
              </HorizontalFlexWrapper>

              {/* <TouchedMessages field={thresholdField} /> */}
              <HelpText>{t('in-settings:tabs.thresholdHint')}</HelpText>
              <HelpText>{t('in-settings:tabs.thresholdRecommend')}</HelpText>
            </FormGroup>
          )}
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          {notificationField && (
            <FormGroup>
              {/* <Label htmlFor="transient-notification" hasError={!notificationField.valid && notificationField.touched}>
                {t('in-settings:tabs.transientNotification')}
              </Label> */}
              <RadioButtonGroup
                legendText={t('in-settings:tabs.transientNotification')}
                name="transient-events-notification-radio-button-vertical-group"
                value={String(alertMuted)}
                onChange={value => onChange(TRANSIENT_NOTIFICATION, value === 'true')}
                orientation="vertical"
              >
                <RadioButton labelText={t('in-settings:tabs.transientNotifyPersistOnly')} value="true" />
                <RadioButton labelText={t('in-settings:tabs.transientNotifyEach')} value="false" />
              </RadioButtonGroup>
              <TouchedMessages field={notificationField} />
            </FormGroup>
          )}
        </Col>
      </Row>
    </>
  );
}
