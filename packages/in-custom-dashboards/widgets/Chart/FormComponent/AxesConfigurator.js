import React, { useState } from 'react';
import classNames from 'classnames';

import { MetricsForAxis, Reorderer } from 'in-custom-dashboards/widgets/Chart/FormComponent/MetricReordering';
import { userSelectableRenderer as availableRenderers } from 'in-custom-dashboards/widgets/Chart/renderer';
import SelectInSection from 'in-components/form/Select/SelectInSection';
import TouchedMessages from 'in-components/form/TouchedMessages';
import Sections from 'in-new-components/workspace/Sections';
import { formatters } from 'in-stores/metric/formatters';
import { Li, Ul } from 'in-new-components/lists/List';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

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
          title="Primary Y-Axis"
          startIndex={0}
          getShortMetricKey={getShortMetricKey}
        />

        {showSecondaryAxis && (
          <AxisConfigurator
            form={form}
            onChange={onChange}
            axisName="y2"
            title="Secondary Y-Axis"
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
            Add secondary Y-axis
          </Button>
        )}
        {isAxisRemovable && (
          <Button
            kind="action"
            icon="lib_openclose_cancel"
            className={locals.axisToggler}
            onClick={() => setShowSecondaryAxis(false)}
          >
            Remove
          </Button>
        )}
      </Li>

      <Li forceAlternateBg className={locals.listItem}>
        <Stack space="medium">
          <Sections>
            {axisForm.get('renderer').map(field => (
              <SelectInSection
                id={`axis-${axisName}-renderer`}
                label="Chart"
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
                label="Formatter"
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'formatter'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
                additionalContent={<TouchedMessages field={field} />}
              >
                {formatters.map(({ id, label }) => (
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
                    Min
                  </Label>
                  <Input
                    id={`${axisName}-chart-configurator-min`}
                    value={field.value || ''}
                    type="number"
                    placeholder="Auto"
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
                    Max
                  </Label>
                  <Input
                    id={`${axisName}-chart-configurator-max`}
                    value={field.value || ''}
                    type="number"
                    placeholder="Auto"
                    onChange={e =>
                      onChange([axisName, 'max'], field =>
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
            </Li>
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
