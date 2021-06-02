/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { Button } from '@instana/components';
import { Li, Ul } from '@instana/components';

import { MetricsForAxis, Reorderer } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import { userSelectableRenderer as availableRenderers } from 'in-custom-dashboards/widgets/Chart/renderer';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { publicFormatters } from 'in-stores/metric/formatters';
import Sections from 'in-new-components/workspace/Sections';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Toggle from 'in-components/form/Toggle';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import { t } from 'in-i18n';

import locals from './AxesConfigurator.mless';

export default function AxesConfigurator({ form, onChange, getShortMetricKey }) {
  const [showSecondaryAxis, setShowSecondaryAxis] = useState(form.getIn(['y2', 'metrics']).size > 0);
  return (
    <Reorderer onChange={onChange}>
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
          />
        )}
      </div>
    </Reorderer>
  );
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
  isSecondary
}) {
  const axisForm = form.get(axisName);
  const isAxisRemovable = isSecondary && axisForm.get('metrics').size === 0;

  const updateShareMaxAxisDomain = e => {
    if (e.target.checked) {
      onChange([], form =>
        form
          .updateIn(['y1', 'max'], field => field.setValue(undefined).setTouched(true))
          .updateIn(['y2', 'max'], field => field.setValue(undefined).setTouched(true))
          .updateIn(['shareMaxAxisDomain'], field => field.setValue(e.target.checked).setTouched(true))
      );
    } else {
      onChange(['shareMaxAxisDomain'], field => field.setValue(e.target.checked).setTouched(true));
    }
  };

  const onMaxChange = e => {
    const isShareMaxAxisDomainAxctive = form.get('shareMaxAxisDomain').value;
    const maxValue = e.target.value.length !== 0 ? Number(e.target.value) : undefined;
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
        <Stack space="medium">
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

            {axisForm.get('formatter').map(field => (
              <SelectInSection
                id={`axis-${axisName}-formatter`}
                label={t('in-custom-dashboards:widgets.chart.axesConfigurator.formatter')}
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'formatter'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
              >
                {publicFormatters.map(({ id, label }) => (
                  <option key={id} value={id}>
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
                    onChange={e => {
                      updateShareMaxAxisDomain(e);
                    }}
                  />
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
          />
        </Stack>
      </Li>
    </Ul>
  );
}
