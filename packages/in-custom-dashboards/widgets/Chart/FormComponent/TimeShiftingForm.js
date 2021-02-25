/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { Trans, t } from 'in-i18n';
import React from 'react';

import { timeShifts, defaultTimeShift, previousHourTimeShift } from 'in-stores/time/shifting';
import HorizontalFlexWrapper from 'in-new-components/layout/HorizontalFlexWrapper';
import TouchedMessages from 'in-components/form/TouchedMessages';
import HelpAction from 'in-new-components/workspace/HelpAction';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import Select from 'in-components/form/Select/Select';
import Toggle from 'in-components/form/Toggle';

import locals from './TimeShiftingForm.mless';

export default function TimeShiftingForm({ axisName, index, indexInAxis, onChange, metricForm }) {
  const timeShiftField = metricForm.get('timeShift');
  const isEnabled = timeShiftField.value !== 0;
  const compareToTimeShiftedField = metricForm.get('compareToTimeShifted');

  return (
    <Sections>
      <Section
        titleHtmlFor={`metic-configurator-${index}-time-shift-enabler`}
        title={t('in-custom-dashboards:widgets.formCompChart.timeShiftingFormChart.timeShift')}
      >
        <div className={locals.timeShiftHelpText}>
          <Toggle
            id={`metic-configurator-${index}-time-shift-enabler`}
            checked={isEnabled}
            onChange={e => {
              let newOffset = defaultTimeShift.offset;
              if (e.target.checked) {
                newOffset = previousHourTimeShift.offset;
              }
              onChange([axisName, 'metrics', indexInAxis, 'timeShift'], field =>
                field.setValue(newOffset).setTouched(true)
              );
            }}
          />
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
                  // Some options may not be selectable, but if a configuration is already persisted with this
                  // option, then we do allow it temporarily.
                  //
                  // Also hide the default time shift option (no time shift)
                  ({ offset, disallowSelection }) =>
                    offset !== defaultTimeShift.offset &&
                    (disallowSelection !== true || offset === timeShiftField.value)
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
                onChange={e =>
                  onChange([axisName, 'metrics', indexInAxis, 'compareToTimeShifted'], field =>
                    field.setValue(e.target.checked).setTouched(true)
                  )
                }
              />
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
