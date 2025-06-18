/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useContext } from 'react';
import cx from 'classnames';

import { Column, Dropdown, NumberInput } from '@instana/carbon';

import CorrectionWindowFormContext from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/createCorrectionWindowForm/CorrectionWindowFormContext';
import { ONE_TIME } from 'in-service-levels/features/CorrectionWindows/components/ConfigureCorrectionWindowDialog/constants';
import { isFieldValid, getValidationMessage } from 'in-service-levels/utils/form';
import { t } from 'in-i18n';

import locals from './ConfigureCorrectionWindowDialog.mless';

const dailyIntervalOption = {
  value: 'days',
  label: t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.days')
};

export default function DailySection() {
  const { form, onChange } = useContext(CorrectionWindowFormContext);
  const scheduleField = form.get('schedule');
  const frequencyField = scheduleField.get('frequency');
  const intervalField = scheduleField.getIn(['recurrence', 'interval']);

  const isIntervalFieldValid = isFieldValid(intervalField);

  if (frequencyField.value === ONE_TIME) return null;

  return (
    <>
      <Column lg={5} md={5}>
        <NumberInput
          className={cx(locals['inline-flex'], locals['w-100'])}
          label={t('in-service-levels:configureCorrectionWindowDialog.components.scheduleSection.repeatEvery')}
          id="correction-window-interval"
          min={0}
          invalid={!isIntervalFieldValid}
          invalidText={getValidationMessage(intervalField)}
          max={31}
          value={intervalField.value}
          onChange={(_, { value }) =>
            onChange(['schedule', 'recurrence', 'interval'], () =>
              intervalField.setValue(Number(value)).setTouched(true)
            )
          }
        />
      </Column>
      <Column lg={4} md={4}>
        <Dropdown
          label=""
          titleText={<wbr />}
          id="correction-window-window-interval-unit"
          items={[dailyIntervalOption]}
          readOnly
          disabled
          selectedItem={dailyIntervalOption}
        />
      </Column>
    </>
  );
}
