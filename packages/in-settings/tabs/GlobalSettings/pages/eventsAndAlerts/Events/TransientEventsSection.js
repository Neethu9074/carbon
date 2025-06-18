/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import {
  Spacer,
  Toggle,
  CarbonRadioButton as RadioButton,
  CarbonRadioButtonGroup as RadioButtonGroup,
  Dropdown,
  StackItem
} from '@instana/components';
import { Stack } from '@instana/carbon';

import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import FormGroup from 'in-settings/components/FormGroup';
import { Row, Col } from 'in-components/layout/Grid';
import HelpText from 'in-components/form/HelpText';
import Label from 'in-components/form/Label';
import Input from 'in-components/form/Input';
import { t } from 'in-i18n';

/**
 * Field names used in the form-definition file.
 */

const TRANSIENT_ENABLED = 'transientEnabled';
const TRANSIENT_THRESHOLD = 'transientThreshold';
const TRANSIENT_NOTIFICATION = 'transientEventAlertMuted';

export default function TransientEventsSection({ form, onChange, disabled }) {
  const enabledField = form.get(TRANSIENT_ENABLED);
  const thresholdField = form.get(TRANSIENT_THRESHOLD);
  const notificationField = form.get(TRANSIENT_NOTIFICATION);
  const notificationScope = notificationField.value ?? false;

  const enabled = enabledField?.value === true;

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
        <Col lg={3}>
          {thresholdField && (
            <FormGroup>
              <Label htmlFor="transient-threshold" hasError={!thresholdField.valid && thresholdField.touched}>
                {t('in-settings:tabs.transientThreshold')}
              </Label>
              <Input
                id="transient-threshold"
                type="number"
                disabled={disabled || !enabled}
                value={thresholdField.value ?? ''}
                onChange={e => onChange(TRANSIENT_THRESHOLD, e.target.value)}
                hasError={!thresholdField.valid && thresholdField.touched}
              />
              <TouchedMessages field={thresholdField} />
              <HelpText>{t('in-settings:tabs.thresholdHint')}</HelpText>
              <HelpText>{t('in-settings:tabs.thresholdRecommend')}</HelpText>
            </FormGroup>
          )}
          <Dropdown
            itemToString={() => {}}
            initialSelectedItem={{
              label: 'Minutes'
            }}
            items={[
              {
                label: 'Milliseconds'
              },
              {
                label: 'Seconds'
              },
              {
                label: 'Minutes'
              }
            ]}
            label="Minutes"
          />
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
                value={notificationScope ? 'EACH' : 'PERSIST_ONLY'}
                onChange={value => onChange(TRANSIENT_NOTIFICATION, value === 'EACH')}
                orientation="vertical"
              >
                <RadioButton
                  labelText={t('in-settings:tabs.transientNotifyPersistOnly')}
                  value="PERSIST_ONLY"
                  id="radio-1"
                />
                <RadioButton labelText={t('in-settings:tabs.transientNotifyEach')} value="EACH" id="radio-2" />
              </RadioButtonGroup>
              <TouchedMessages field={notificationField} />
            </FormGroup>
          )}
        </Col>
      </Row>
    </>
  );
}
