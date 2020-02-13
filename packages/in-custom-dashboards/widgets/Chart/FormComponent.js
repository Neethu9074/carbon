import React from 'react';

import DataSeriesFormComponent from 'in-custom-dashboards/widgets/Chart/DataSeriesFormComponent';
import { renderer as availableRenderers } from 'in-custom-dashboards/widgets/Chart/renderer';
import { formatters } from 'in-custom-dashboards/widgets/_shared/formatters';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';
import Card from 'in-new-components/Card';

export default function ChartWidgetFormComponent({ form, onChange }) {
  return (
    <Row>
      <Col lg={6}>
        <AxisFormComponent axisName="y1" form={form} onChange={onChange} />
      </Col>
      <Col lg={6}>
        <AxisFormComponent axisName="y2" form={form} onChange={onChange} />
      </Col>
    </Row>
  );
}

function AxisFormComponent({ axisName, form, onChange }) {
  const axisForm = form.get(axisName);

  return (
    <Card title={`${axisName.toUpperCase()} Axis`}>
      {axisForm.get('renderer').map(field => (
        <FormGroup>
          <Label htmlFor={`${axisName}-chart-configurator-renderer`} hasError={!field.valid && field.touched}>
            Type
          </Label>
          <Select
            id={`${axisName}-chart-configurator-renderer`}
            value={field.value}
            onChange={e => onChange([axisName, 'renderer'], field => field.setValue(e.target.value).setTouched(true))}
            hasError={!field.valid && field.touched}
          >
            {availableRenderers.map(({ id, label }) => (
              <option key={id} value={id}>
                {label}
              </option>
            ))}
          </Select>
          <TouchedMessages field={field} />
        </FormGroup>
      ))}

      {axisForm.get('formatter').map(field => (
        <FormGroup>
          <Label htmlFor={`${axisName}-chart-configurator-formatter`} hasError={!field.valid && field.touched}>
            Formatter
          </Label>
          <Select
            id={`${axisName}-chart-configurator-formatter`}
            value={field.value}
            onChange={e => onChange([axisName, 'formatter'], field => field.setValue(e.target.value).setTouched(true))}
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

      <Row>
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
                onChange={e => onChange([axisName, 'min'], field => field.setValue(e.target.value).setTouched(true))}
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
                onChange={e => onChange([axisName, 'max'], field => field.setValue(e.target.value).setTouched(true))}
                hasError={!field.valid && field.touched}
              />
              <TouchedMessages field={field} />
            </FormGroup>
          ))}
        </Col>
      </Row>

      <DataSeriesFormComponent axisName={axisName} form={form} onChange={onChange} />
    </Card>
  );
}
