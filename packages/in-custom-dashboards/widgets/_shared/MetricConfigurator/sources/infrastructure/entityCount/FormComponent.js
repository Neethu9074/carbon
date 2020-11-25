import React from 'react';

import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import FormGroup from 'in-components/form/FormGroup';
import Select from 'in-components/form/Select';
import Input from 'in-components/form/Input';
import Label from 'in-components/form/Label';

export default function FormComponent({
  form,
  onChange,
  dataSourceFormGroup,
  labelFormGroup,
  formatterFormGroup,
  widgetPreview,
  timeShiftConfiguration
}) {
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const dynamicFocusQueryField = form.get('dynamicFocusQuery');

  return (
    <>
      {labelFormGroup && (
        <Row>
          <Col lg={6}>{labelFormGroup}</Col>
        </Row>
      )}

      <Row withoutTopMargin>
        <Col lg={6}>{dataSourceFormGroup}</Col>
      </Row>

      <FormGroup>
        <Label
          htmlFor="metic-configurator-infra-dynamic-focus-query"
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
        >
          Dynamic Focus Query
        </Label>
        <Input
          id="metic-configurator-infra-dynamic-focus-query"
          type="text"
          value={dynamicFocusQueryField.value}
          onChange={e => onChange(['dynamicFocusQuery'], field => field.setValue(e.target.value).setTouched(true))}
          hasError={!dynamicFocusQueryField.valid && dynamicFocusQueryField.touched}
        />
        <TouchedMessages field={dynamicFocusQueryField} />
      </FormGroup>

      <Row withoutTopMargin>
        <Col lg>
          <Row>
            <Col lg>
              <FormGroup>
                <Label htmlFor="metic-configurator-infra-metric">Metric</Label>
                <Select id="metic-configurator-infra-metric" value={metricField.value} disabled>
                  <option value="count">Count</option>
                </Select>
                <TouchedMessages field={metricField} />
              </FormGroup>
            </Col>

            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metic-configurator-infra-aggregation"
                  hasError={!aggregationField.valid && aggregationField.touched}
                >
                  Aggregation
                </Label>
                <Select id="metic-configurator-infra-aggregation" value={aggregationField.value} disabled>
                  {!metricField.valid && <option value="">Please select a metric</option>}
                  {metricField.valid && (
                    <>
                      <option value="">Please select</option>
                      {Object.keys(aggregationLabels).map(aggregation => (
                        <option key={aggregation} value={aggregation}>
                          {aggregationLabels[aggregation]}
                        </option>
                      ))}
                    </>
                  )}
                </Select>
                <TouchedMessages field={aggregationField} />
              </FormGroup>
            </Col>
          </Row>

          {formatterFormGroup}

          {timeShiftConfiguration}
        </Col>

        {widgetPreview && <Col lg>{widgetPreview}</Col>}
      </Row>
    </>
  );
}
