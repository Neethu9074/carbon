/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useEffect } from 'react';

import { keyCodes, Stack } from '@instana/components';

import sources from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources';
import SectionLabelWithSubtext from 'in-components/workspace/SectionLabelWithSubtext';
import { getMetricLabel } from 'in-custom-dashboards/widgets/Chart/util';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import InputInSection from 'in-components/form/Input/InputInSection';
import LeftRightPadding from 'in-components/layout/LeftRightPadding';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import Sections from 'in-components/workspace/Sections';
import { emptyArray } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

const { isTab } = keyCodes;

export default function MetricConfigurator({
  form,
  onChange,
  onChangeSource,
  updateForm,
  formatterSection,
  timeShiftConfiguration,
  thresholdConfiguration,
  disabledDataSources = emptyArray,
  axisForm,
  axisName,
  withGrouping = true,
  withFiltering = true,
  isTypePrefilled = false,
  withAggregationInMetrics = true,
  withLabelConfiguration,
  withPotentialProblemsConfiguration,
  dataSource,
  type,
  maxGrouping,
  displayDFQ = true,
  withLastValue = false,
  withEmptyValueFilterSection,
  withUnit = false
}) {
  const sourceField = form.get('source');
  const label = form.get('label')?.value;
  const metricLabel = form.get('metricLabel')?.value;

  // If datasource is defined, makes the selection
  useEffect(() => {
    if (dataSource) {
      onChangeSource(dataSource);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // If datasource is defined, makes the selection by default
  useEffect(() => {
    if (sourceField.value && type && type !== 'TIME_SERIES') {
      onChange(['type'], field => field.setValue(type).setTouched(true));
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [type, sourceField.value]);

  const changeLabel = name => onChange(['label'], field => field.setValue(name).setTouched(true));
  const handleOnFocus = () => changeLabel(getMetricLabel(form.toJS()));

  const handKeyDown = event => {
    if (isTab(event)) {
      if (label !== '') {
        return;
      }

      event.preventDefault();
      changeLabel(getMetricLabel(form.toJS()));
    }
  };

  const handleOnBlur = () => {
    if (label !== metricLabel) {
      return;
    }
    changeLabel('');
  };

  const additionalDataSourceSelectorContent = (
    <Stack inline direction="horizontal">
      <LeftRightPadding>
        <TouchedMessages field={sourceField} />
      </LeftRightPadding>
    </Stack>
  );

  const dataSourceSection = (
    <SelectInSection
      id="metric-configurator-source"
      label={t('in-custom-dashboards:widgets.metricConfigurator.ds')}
      value={sourceField.value}
      onChange={e => onChangeSource(e.target.value)}
      hasError={!sourceField.valid && sourceField.touched}
      additionalContent={additionalDataSourceSelectorContent}
    >
      <option value="">{t('in-custom-dashboards:widgets.metricConfigurator.pleaseSelect')}</option>
      {Object.values(sources)
        .filter(
          ({ source, visible }) =>
            (visible && disabledDataSources.indexOf(source) === -1) || sourceField.value === source
        )
        .sort((a, b) => compareIgnoreCase(a.label, b.label))
        .map(({ source, label, disabled }) => (
          <option key={source} value={source} disabled={disabled}>
            {label}
          </option>
        ))}
    </SelectInSection>
  );

  let labelSection;
  if (withLabelConfiguration) {
    labelSection = form.get('label').map(field => (
      <Sections>
        <InputInSection
          label={
            <SectionLabelWithSubtext subtext={t('in-custom-dashboards:widgets.metricConfigurator.optional')}>
              {t('in-custom-dashboards:widgets.metricConfigurator.name')}
            </SectionLabelWithSubtext>
          }
          id="metric-configurator-label"
          type="text"
          value={field.value}
          placeholder={getMetricLabel(form.toJS())}
          onChange={e => onChange(['label'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!field.valid && field.touched}
          onKeyDown={handKeyDown}
          onFocus={handleOnFocus}
          onBlur={handleOnBlur}
          additionalContent={<TouchedMessages field={field} />}
          maxLength={256}
        />
      </Sections>
    ));
  }

  if (sourceField.value) {
    const FormComponent = sources[sourceField.value].Form;
    return (
      <FormComponent
        form={form}
        onChange={onChange}
        updateForm={updateForm}
        labelSection={labelSection}
        formatterSection={formatterSection}
        timeShiftConfiguration={timeShiftConfiguration}
        thresholdConfiguration={thresholdConfiguration}
        axisForm={axisForm}
        axisName={axisName}
        withGrouping={withGrouping}
        withAggregationInMetrics={withAggregationInMetrics}
        withFiltering={withFiltering}
        isTypePrefilled={isTypePrefilled}
        type={type}
        maxGrouping={maxGrouping}
        withPotentialProblemsConfiguration={withPotentialProblemsConfiguration}
        dataSourceSection={dataSource ? undefined : dataSourceSection}
        displayDFQ={displayDFQ}
        withLastValue={withLastValue}
        withEmptyValueFilterSection={withEmptyValueFilterSection}
        withUnit={withUnit}
      />
    );
  }

  return <Sections>{dataSourceSection}</Sections>;
}
