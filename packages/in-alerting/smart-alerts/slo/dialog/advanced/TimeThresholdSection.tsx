/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { millisecondsToMinutes } from 'date-fns';
import React from 'react';

import { RestrictedSlider, Typography } from '@instana/components';

import TabSelect, { TabSelectItem, TabSelectMenu, TabSelectPanel, TabSelectPanels } from 'in-components/TabSelect';
import { useSloAlertFormContext } from 'in-alerting/smart-alerts/slo/hooks/useSloAlertFormContext';
import { isFieldValid } from 'in-service-levels/components/ConfigDialog/createSloForm/utils';
import ValidationBlock from 'in-components/form/ValidationBlock/ValidationBlock';
import { Shape } from 'in-components/Slider/proptypes';
import { noop } from 'in-services/fixedObjects';
import { minutes } from 'in-services/time/time';
import { t } from 'in-i18n';

const sliderMarks = createSliderMarks([1, 5, 10, 15, 20, 30]);

export default function TimeThresholdSection() {
  const { form, onChange } = useSloAlertFormContext();

  const timeThresholdField = form.getIn(['timeThreshold', 'timeWindow']);
  const isTimeThresholdValid = isFieldValid(timeThresholdField);

  return (
    <TabSelect activePanelId="gracePeriod" onChange={noop}>
      <TabSelectMenu>
        <TabSelectItem forId="gracePeriod">
          {t('in-alerting:smartAlerts.slo.advancedModeContainer.timeThresholdType_gracePeriod')}
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel id="gracePeriod">
          <Typography variant="heading-200" component="p">
            {t('in-alerting:smartAlerts.slo.advancedModeContainer.timeThresholdTypeTitle_gracePeriod', {
              minutes: millisecondsToMinutes(timeThresholdField.value)
            })}
          </Typography>
          <RestrictedSlider
            marks={sliderMarks}
            max={sliderMarks.at(-1)!.value}
            min={0}
            value={timeThresholdField.value}
            onChange={(_event, value) =>
              onChange(['timeThreshold', 'timeWindow'], () =>
                timeThresholdField.setValue(value as number).setTouched(true)
              )
            }
            valueLabelDisplay="off"
          />
          {!isTimeThresholdValid &&
            timeThresholdField.messages.map(({ message }, index) => (
              <ValidationBlock key={`error-msg-${index}`}>{message}</ValidationBlock>
            ))}
        </TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
}

function createSliderMarks(minuteValues: number[]): Shape[] {
  return minuteValues.map(value => ({
    value: minutes.toMillis(value),
    label: t('in-alerting:smartAlerts.components.smartAlertDialog.timeThresholdConfigMinutes', { min: value })
  }));
}
