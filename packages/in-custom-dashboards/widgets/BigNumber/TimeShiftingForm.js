/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import ComparisonColorSelect from 'in-custom-dashboards/widgets/BigNumber/ComparisonColorSelect';
import { timeShifts, defaultTimeShift, previousHourTimeShift } from 'in-stores/time/shifting';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import Section from 'in-new-components/workspace/Section';
import Toggle from 'in-components/form/Toggle';

import locals from './TimeShiftingForm.mless';

export default function TimeShiftingForm({ form, onChange }) {
  const timeShiftField = form.get('metricConfiguration').get('timeShift');
  const isEnabled = timeShiftField.value !== 0;

  return (
    <Sections>
      <Section
        titleHtmlFor="metric-configurator-time-shift-enabler"
        title={t('in-custom-dashboards:widgets.bigNumber.timeShiftingForm.timeShift')}
      >
        <div className={locals.timeShiftHelpText}>
          <Toggle
            id="metric-configurator-time-shift-enabler"
            checked={isEnabled}
            onChange={e => {
              let newOffset = defaultTimeShift.offset;
              if (e.target.checked) {
                newOffset = previousHourTimeShift.offset;
              }
              onChange(['metricConfiguration', 'timeShift'], field => field.setValue(newOffset).setTouched(true));
            }}
          />
          {t('in-custom-dashboards:widgets.bigNumber.timeShiftingForm.addTimeShiftComparBadge')}
        </div>
      </Section>

      {isEnabled && (
        <>
          <SelectInSection
            id="metic-configurator-time-shift"
            value={timeShiftField.value}
            onChange={e => {
              let value = e.target.value;
              if (value !== 'auto') {
                value = parseInt(value, 10);
              }
              onChange(['metricConfiguration', 'timeShift'], field => field.setValue(value).setTouched(true));
            }}
            hasError={!timeShiftField.valid && timeShiftField.touched}
            additionalContent={<TouchedMessages field={timeShiftField} />}
            useAlternateBg
          >
            {timeShifts
              .filter(
                // Some options may not be selectable, but if a configuration is already persisted with this
                // option, then we do allow it temporarily.
                //
                // Also hide the default time shift option (no time shift)
                ({ offset, disallowSelection }) =>
                  offset !== defaultTimeShift.offset && (disallowSelection !== true || offset === timeShiftField.value)
              )
              .map(({ offset, label }) => (
                <option key={offset} value={offset}>
                  {label}
                </option>
              ))}
          </SelectInSection>

          <Section useAlternateBg>
            <div className={locals.colorSelection}>
              <ComparisonColorSelect
                label={t('in-custom-dashboards:widgets.bigNumber.timeShiftingForm.increaseColor')}
                examplePercentage="+5.24%"
                field={form.get('comparisonIncreaseColor')}
                onChange={v => onChange(['comparisonIncreaseColor'], f => f.setValue(v).setTouched(true))}
                idSuffix="increase"
              />

              <ComparisonColorSelect
                label={t('in-custom-dashboards:widgets.bigNumber.timeShiftingForm.decreaseColor')}
                examplePercentage="-2.14%"
                field={form.get('comparisonDecreaseColor')}
                onChange={v => onChange(['comparisonDecreaseColor'], f => f.setValue(v).setTouched(true))}
                idSuffix="decrease"
              />
            </div>
          </Section>
        </>
      )}
    </Sections>
  );
}
