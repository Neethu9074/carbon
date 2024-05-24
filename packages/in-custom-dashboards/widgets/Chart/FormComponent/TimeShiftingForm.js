/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Spacer, Toggle } from '@instana/components';
import { Select } from '@instana/components';

import { timeShifts, defaultTimeShift, previousHourTimeShift } from 'in-stores/time/shifting';
import HorizontalFlexWrapper from 'in-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-components/workspace/HelpAction';
import Sections from 'in-components/workspace/Sections';
import Section from 'in-components/workspace/Section';
import Tooltip from 'in-components/Tooltip';
import { Trans, t } from 'in-i18n';

import locals from './TimeShiftingForm.mless';

export default function TimeShiftingForm({ axisName, index, indexInAxis, onChange, metricForm }) {
  const timeShiftField = metricForm.get('timeShift');

  const isEnabled = timeShiftField.value !== 0;
  const compareToTimeShiftedField = metricForm.get('compareToTimeShifted');

  const disabled = !!metricForm.get('potentialProblems');

  return (
    <Sections>
      <Section
        titleHtmlFor={`metic-configurator-${index}-time-shift-enabler`}
        title={t('in-custom-dashboards:widgets.formCompChart.timeShiftingFormChart.timeShift')}
      >
        <div className={locals.timeShiftHelpText}>
          <Tooltip
            content={
              disabled &&
              t('in-custom-dashboards:widgets.formCompChart.timeShiftingFormChart.timeShiftDisabledWhilePPon')
            }
          >
            <div>
              <Toggle
                id={`metic-configurator-${index}-time-shift-enabler`}
                checked={isEnabled}
                disabled={disabled}
                onToggle={e => {
                  const newOffset = e ? previousHourTimeShift.offset : defaultTimeShift.offset;
                  onChange([axisName, 'metrics', indexInAxis, 'timeShift'], field =>
                    field.setValue(newOffset).setTouched(true)
                  );
                }}
              />
            </div>
          </Tooltip>
          <Spacer horizontal="xxsmall" />
          {t('in-custom-dashboards:widgets.formCompChart.timeShiftingFormChart.applyTimeShiftDs')}
        </div>
      </Section>

      {isEnabled && (
        <Section
          useAlternateBg
          actions={
            <HelpAction>
              <Trans
                i18nKey="in-custom-dashboards:widgets.formCompChart.timeShiftingFormChart.timeShiftHelpAction"
                components={{ italic: <i />, bold: <strong /> }}
              />
            </HelpAction>
          }
        >
          <HorizontalFlexWrapper>
            <Select
              id={`metic-configurator-${index}-time-shift`}
              value={timeShiftField.value}
              disabled={disabled}
              onChange={e => {
                let value = e.target.value;
                if (value !== 'auto') {
                  value = parseInt(value, 10);
                }
                onChange([axisName, 'metrics', indexInAxis, 'timeShift'], field =>
                  field.setValue(value).setTouched(true)
                );
              }}
              hasError={!timeShiftField.valid && timeShiftField.touched}
            >
              {timeShifts
                .filter(
                  // Hide the default time shift option (no time shift)
                  ({ offset }) => offset !== defaultTimeShift.offset
                )
                .map(({ offset, label }) => (
                  <option key={offset} value={offset}>
                    {label}
                  </option>
                ))}
            </Select>

            <div className={locals.compareToTimeShifted}>
              <Toggle
                id={`metic-configurator-${index}-time-shift-comparison`}
                checked={compareToTimeShiftedField.value}
                disabled={disabled}
                onToggle={e =>
                  onChange([axisName, 'metrics', indexInAxis, 'compareToTimeShifted'], field =>
                    field.setValue(e).setTouched(true)
                  )
                }
              />
              <Spacer horizontal="xxsmall" />
              {t('in-custom-dashboards:widgets.formCompChart.timeShiftingFormChart.displayCurrentValues')}
            </div>
          </HorizontalFlexWrapper>

          <TouchedMessages field={timeShiftField} />
          <TouchedMessages field={compareToTimeShiftedField} />
        </Section>
      )}
    </Sections>
  );
}
