/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { Li, Spacer, Stack, Ul, Toggle, Button } from '@instana/components';

import { formatterPath, formatterSelectedPath } from 'in-custom-dashboards/widgets/_shared/useFormatterFormSideEffects';
import { MetricsForAxis, Reorderer } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import { userSelectableRenderer as availableRenderers } from 'in-custom-dashboards/widgets/Chart/renderer';
import { getFormatter, getCommonFormatterForUnits } from 'in-custom-dashboards/widgets/_shared/formatters';
import { getFormatterById, publicFormatters } from 'in-stores/metric/formatters';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-components/workspace/Sections';
import { getBaseUnit } from 'in-stores/metric/units';
import FormGroup from 'in-components/form/FormGroup';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './AxesConfigurator.mless';

export default function AxesConfigurator({ form, onChange, getShortMetricKey, withUnit }) {
  const [showSecondaryAxis, setShowSecondaryAxis] = useState(form.getIn(['y2', 'metrics']).size > 0);
  const [activeInfo, setActiveInfo] = useState(null);

  return (
    <Reorderer form={form} onChange={onChange} activeInfo={activeInfo} setActiveInfo={setActiveInfo}>
      <div
        className={classNames(locals.wrapper, {
          [locals.dualAxis]: showSecondaryAxis
        })}
      >
        <AxisConfigurator
          showSecondaryAxis={showSecondaryAxis}
          setShowSecondaryAxis={setShowSecondaryAxis}
          form={form}
          onChange={onChange}
          axisName="y1"
          title={t('in-custom-dashboards:widgets.chart.axesConfigurator.primaryYAxis')}
          startIndex={0}
          getShortMetricKey={getShortMetricKey}
          withUnit={withUnit}
          activeInfo={activeInfo}
        />

        {showSecondaryAxis && (
          <AxisConfigurator
            form={form}
            onChange={onChange}
            axisName="y2"
            title={t('in-custom-dashboards:widgets.chart.axesConfigurator.secondaryYAxis')}
            startIndex={form.getIn(['y1', 'metrics']).size}
            getShortMetricKey={getShortMetricKey}
            isSecondary
            setShowSecondaryAxis={setShowSecondaryAxis}
            showSecondaryAxis={showSecondaryAxis}
            withUnit={withUnit}
            activeInfo={activeInfo}
          />
        )}
      </div>
    </Reorderer>
  );
}

function addFormatterIfMissing(existingFormatters, formatter) {
  if (formatter && !existingFormatters.find(existingFormatter => existingFormatter.id === formatter.id)) {
    existingFormatters.push(formatter);
  }
}

function AxisConfigurator({
  showSecondaryAxis,
  setShowSecondaryAxis,
  form,
  onChange,
  axisName,
  title,
  startIndex,
  getShortMetricKey,
  isSecondary,
  withUnit = false,
  activeInfo
}) {
  const axisForm = form.get(axisName);
  const isAxisRemovable = isSecondary && axisForm.get('metrics').size === 0;

  const metricConfigurations = axisForm.get('metrics')?.map(map => {
    const source = map.get('source').value;
    const metric = map.get('metric').value;
    const aggregation = map.get('aggregation').value;
    const baseUnit = withUnit ? getBaseUnit(map.get('unit')?.value) : undefined;

    return {
      source,
      metric,
      aggregation,
      baseUnit
    };
  });

  let availableFormatters = [];
  metricConfigurations.forEach(config => {
    getFormatter(config.source, config.metric, config.aggregation, config.baseUnit).forEach(formatter =>
      addFormatterIfMissing(availableFormatters, formatter)
    );
  });
  const configuredUnits = metricConfigurations.map(({ baseUnit }) => baseUnit).filter(Boolean);
  getCommonFormatterForUnits(...configuredUnits).forEach(formatter =>
    addFormatterIfMissing(availableFormatters, formatter)
  );

  //Backward compatibility, add existing formatter to list of available formatters
  const isFormatterSelected = axisForm.get(formatterSelectedPath)?.value;
  if (isFormatterSelected) {
    const selectedFormatter = axisForm.get(formatterPath)?.value;
    addFormatterIfMissing(availableFormatters, getFormatterById(selectedFormatter));
  }

  if (availableFormatters.length === 0) {
    availableFormatters = publicFormatters;
  }

  const updateShareMaxAxisDomain = e => {
    if (e) {
      onChange([], form =>
        form
          .updateIn(['y1', 'max'], field => field.setValue(undefined).setTouched(true))
          .updateIn(['y2', 'max'], field => field.setValue(undefined).setTouched(true))
          .updateIn(['shareMaxAxisDomain'], field => field.setValue(e).setTouched(true))
      );
    } else {
      onChange(['shareMaxAxisDomain'], field => field.setValue(e).setTouched(true));
    }
  };

  const onMaxChange = e => {
    const isShareMaxAxisDomainAxctive = form.get('shareMaxAxisDomain').value;
    const maxValue = e.target.value.length !== 0 && Number(e.target.value) !== 0 ? Number(e.target.value) : undefined;
    if (isShareMaxAxisDomainAxctive) {
      onChange([], form =>
        form
          .updateIn(['y1', 'max'], field => field.setValue(maxValue).setTouched(true))
          .updateIn(['y2', 'max'], field => field.setValue(maxValue).setTouched(true))
      );
    } else {
      onChange([axisName, 'max'], field => field.setValue(maxValue).setTouched(true));
    }
  };

  return (
    <Ul className={locals.axis}>
      <Li>
        {title}
        <TouchedMessages field={axisForm} />
        {!showSecondaryAxis && (
          <Button
            kind="action"
            icon="lib_openclose_add_circle_outline"
            className={locals.axisToggler}
            onClick={() => setShowSecondaryAxis(true)}
          >
            {t('in-custom-dashboards:widgets.chart.axesConfigurator.addSecondary')}
          </Button>
        )}
        {isAxisRemovable && (
          <Button
            kind="action"
            icon="lib_openclose_cancel"
            className={locals.axisToggler}
            onClick={() => setShowSecondaryAxis(false)}
          >
            {t('in-custom-dashboards:widgets.chart.axesConfigurator.removeSecondary')}
          </Button>
        )}
      </Li>

      <Li forceAlternateBg className={locals.listItem}>
        <Stack gap="medium">
          <Sections>
            {axisForm.get('renderer').map(field => (
              <SelectInSection
                id={`axis-${axisName}-renderer`}
                label={t('in-custom-dashboards:widgets.chart.axesConfigurator.chart')}
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'renderer'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
              >
                {availableRenderers.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            ))}

            {axisForm.get(formatterPath).map(field => (
              <SelectInSection
                id={`axis-${axisName}-formatter`}
                label={t('in-custom-dashboards:widgets.chart.axesConfigurator.formatter')}
                value={field.value}
                onChange={e => {
                  onChange([], form =>
                    form
                      .updateIn([axisName, formatterPath], field => field.setValue(e.target.value).setTouched(true))
                      .updateIn([axisName, formatterSelectedPath], field => field.setValue(true).setTouched(true))
                  );
                }}
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
              >
                {availableFormatters.map(({ id, label }, index) => (
                  <option key={`${id}-${index}`} value={id}>
                    {label}
                  </option>
                ))}
              </SelectInSection>
            ))}

            <Li noAlternatingBg className={locals.minMax} component="div">
              {axisForm.get('min').map(field => (
                <FormGroup className={locals.minMaxGroup}>
                  <Label htmlFor={`${axisName}-chart-configurator-min`} hasError={!field.valid && field.touched}>
                    {t('in-custom-dashboards:widgets.chart.axesConfigurator.min')}
                  </Label>
                  <Input
                    id={`${axisName}-chart-configurator-min`}
                    value={field.value || ''}
                    type="number"
                    placeholder={t('in-custom-dashboards:widgets.chart.axesConfigurator.auto')}
                    onChange={e =>
                      onChange([axisName, 'min'], field =>
                        field
                          .setValue(e.target.value.length !== 0 ? Number(e.target.value) : undefined)
                          .setTouched(true)
                      )
                    }
                    hasError={!field.valid && field.touched}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}

              {axisForm.get('max').map(field => (
                <FormGroup className={locals.minMaxGroup}>
                  <Label htmlFor={`${axisName}-chart-configurator-max`} hasError={!field.valid && field.touched}>
                    {t('in-custom-dashboards:widgets.chart.axesConfigurator.max')}
                  </Label>
                  <Input
                    id={`${axisName}-chart-configurator-max`}
                    value={field.value || ''}
                    type="number"
                    placeholder={t('in-custom-dashboards:widgets.chart.axesConfigurator.auto')}
                    onChange={e => onMaxChange(e)}
                    hasError={!field.valid && field.touched}
                  />
                  <TouchedMessages field={field} />
                </FormGroup>
              ))}
            </Li>
            {showSecondaryAxis && (
              <Li component="div">
                <div className={locals.shareMaxValueContainer}>
                  <Toggle
                    checked={form.get('shareMaxAxisDomain').value}
                    onToggle={e => {
                      updateShareMaxAxisDomain(e);
                    }}
                  />
                  <Spacer horizontal="xxsmall" />
                  <span>{t('in-custom-dashboards:widgets.chart.axesConfigurator.sharemaxValue')}</span>
                </div>
              </Li>
            )}
          </Sections>

          <MetricsForAxis
            form={form}
            onChange={onChange}
            axisName={axisName}
            startIndex={startIndex}
            getShortMetricKey={getShortMetricKey}
            withUnitPill={withUnit}
            activeInfo={activeInfo}
          />
        </Stack>
      </Li>
    </Ul>
  );
}
