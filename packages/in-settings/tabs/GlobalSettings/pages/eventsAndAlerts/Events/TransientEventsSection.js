/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect, useState } from 'react';

import {
  Toggle,
  CarbonRadioButton as RadioButton,
  CarbonRadioButtonGroup as RadioButtonGroup
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

function millistoThresholdObj(ms) {
  return ms % 3600000 === 0 ? { amount: ms / 3600000, unit: 'HOURS' } : { amount: ms / 60000, unit: 'MINUTES' };
}

// TODO: should we add max for unit?
// const maxForUnit = unit => (unit === DurationUnit.hours ? 23 : 59);

export default function TransientEventsSection({ form, onChange, disabled }) {
  const enabledField = form.get(TRANSIENT_ENABLED);
  const thresholdField = form.get(TRANSIENT_THRESHOLD);
  const notificationField = form.get(TRANSIENT_NOTIFICATION);
  const [thresholdUnit, setThresholdUnit] = useState(() => millistoThresholdObj(thresholdField?.value ?? 5 * 60000));

  useEffect(() => {
    const rawValue = thresholdField?.value ?? 5 * 60000;
    setThresholdUnit(millistoThresholdObj(rawValue));
  }, [thresholdField?.value]);

  const handleThresholdChange = next => {
    setThresholdUnit(next);
    const millis = durationToMillis(next);
    onChange(TRANSIENT_THRESHOLD, millis);
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
          {enabledField.map(field => (
            <FormGroup>
              <Toggle
                id="transient-enable"
                name="transient-enable"
                disabled={disabled}
                checked={field.value}
                onToggle={v => onChange(TRANSIENT_ENABLED, v)}
                labelA={t('in-settings:tabs.enableTransientToggle')}
                labelB={t('in-settings:tabs.enableTransientToggle')}
              />
            </FormGroup>
          ))}
        </Col>
      </Row>

      <Row>
        <Col lg={4}>
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
                disabled={disabled || !enabledField.value}
                value={thresholdUnit.amount}
                onChange={e =>
                  handleThresholdChange({
                    ...thresholdUnit,
                    amount: e.target.valueAsNumber
                  })
                }
                hasError={!thresholdField.valid && thresholdField.touched}
              />
              <ComboBox
                isClearable={false}
                isDisabled={disabled || !enabledField.value}
                value={thresholdUnit.unit}
                options={[
                  { value: DurationUnit.minutes, label: t('in-settings:tabs.transientMinutes') },
                  { value: DurationUnit.hours, label: t('in-settings:tabs.transientHours') }
                ]}
                onChange={v =>
                  handleThresholdChange({
                    ...thresholdUnit,
                    unit: v.value
                  })
                }
              />
            </HorizontalFlexWrapper>

            <HelpText>{t('in-settings:tabs.thresholdHint')}</HelpText>
            <HelpText>{t('in-settings:tabs.thresholdRecommend')}</HelpText>
          </FormGroup>
        </Col>
      </Row>

      <Row>
        <Col lg={6}>
          {notificationField.map(field => (
            <FormGroup>
              <Label htmlFor="transient-notification" hasError={!field.valid && field.touched}>
                {t('in-settings:tabs.transientNotification')}
              </Label>
              <RadioButtonGroup
                name="transient-events-notification-radio-button-vertical-group"
                value={field.value}
                defaultSelected={String(field.value)}
                onChange={value => {
                  const bool = value === 'true';
                  onChange(TRANSIENT_NOTIFICATION, bool);
                }}
                orientation="vertical"
                disabled={disabled || !enabledField.value}
              >
                <RadioButton labelText={t('in-settings:tabs.transientNotifyEach')} value="false" id="false" />
                <RadioButton labelText={t('in-settings:tabs.transientNotifyPersistOnly')} value="true" id="true" />
              </RadioButtonGroup>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>
    </>
  );
}
