import React from 'react';

import DataSeriesFormComponent from 'in-custom-dashboards/widgets/Chart/DataSeriesFormComponent';
import { renderer as availableRenderers } from 'in-custom-dashboards/widgets/Chart/renderer';
import { createMetricForm } from 'in-custom-dashboards/widgets/Chart/form';
import StackItem from 'in-new-components/layout/Stack/StackItem';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { barOverlapping } from 'in-stores/metric/renderer';
import { Row, Col } from 'in-new-components/layout/Grid';
import { formatters } from 'in-stores/metric/formatters';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import Stack from 'in-new-components/layout/Stack';
import Select from 'in-components/form/Select';
import Button from 'in-new-components/Button';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function ChartWidgetFormComponent({ form, onChange, widgetTitleFormGroup, widgetPreview }) {
  const showY2 = form.get('y2').get('metrics').size > 0;

  return (
    <Stack space="large">
      <StackItem>
        <Header>Customize the Widget</Header>
        {widgetTitleFormGroup}
      </StackItem>

      <StackItem>
        <Header>Chart: Primary Y Axis</Header>
        <AxisFormComponent axisName="y1" form={form} onChange={onChange} />
      </StackItem>

      <StackItem>
        <Header>Chart: Secondary Y Axis</Header>
        {showY2 && <AxisFormComponent axisName="y2" form={form} onChange={onChange} />}
        {!showY2 && (
          <Button onClick={() => onChange(['y2', 'metrics'], f => f.push(createMetricForm()))}>
            Add secondary Y axis
          </Button>
        )}
      </StackItem>

      <StackItem>
        <Header>Widget Preview</Header>
        {widgetPreview}
      </StackItem>
    </Stack>
  );
}

function AxisFormComponent({ axisName, form, onChange }) {
  const axisForm = form.get(axisName);

  return (
    <>
      <Row>
        <Col md={6}>
          {axisForm.get('renderer').map(field => (
            <FormGroup>
              <Label htmlFor={`${axisName}-chart-configurator-renderer`} hasError={!field.valid && field.touched}>
                Type
              </Label>
              <Select
                id={`${axisName}-chart-configurator-renderer`}
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'renderer'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
              >
                {
                  // hide the bar overlapping chart type, which is not very intuitive to understand
                  availableRenderers.filter(r => r.id !== barOverlapping.id).map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>

        <Col md={6}>
          {axisForm.get('formatter').map(field => (
            <FormGroup>
              <Label htmlFor={`${axisName}-chart-configurator-formatter`} hasError={!field.valid && field.touched}>
                Formatter
              </Label>
              <Select
                id={`${axisName}-chart-configurator-formatter`}
                value={field.value}
                onChange={e =>
                  onChange([axisName, 'formatter'], field => field.setValue(e.target.value).setTouched(true))
                }
                hasError={!field.valid && field.touched}
              >
                {formatters.map(({ id, label }) => (
                  <option key={id} value={id}>
                    {label}
                  </option>
                ))}
              </Select>
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>

      <Row withoutTopMargin>
        <Col md={6}>
          {axisForm.get('min').map(field => (
            <FormGroup>
              <Label htmlFor={`${axisName}-chart-configurator-min`} hasError={!field.valid && field.touched}>
                Min
              </Label>
              <Input
                id={`${axisName}-chart-configurator-min`}
                value={field.value || ''}
                type="number"
                onChange={e =>
                  onChange([axisName, 'min'], field =>
                    field.setValue(e.target.value.length !== 0 ? Number(e.target.value) : undefined).setTouched(true)
                  )
                }
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>

        <Col md={6}>
          {axisForm.get('max').map(field => (
            <FormGroup>
              <Label htmlFor={`${axisName}-chart-configurator-max`} hasError={!field.valid && field.touched}>
                Max
              </Label>
              <Input
                id={`${axisName}-chart-configurator-max`}
                value={field.value || ''}
                type="number"
                onChange={e =>
                  onChange([axisName, 'max'], field =>
                    field.setValue(e.target.value.length !== 0 ? Number(e.target.value) : undefined).setTouched(true)
                  )
                }
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>

      <DataSeriesFormComponent axisName={axisName} form={form} onChange={onChange} />
    </>
  );
}
