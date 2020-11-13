import React, { useState, useEffect } from 'react';

import { invalidMarker } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/form';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import Header from 'in-components/form/Header/Header';
import FormGroup from 'in-components/form/FormGroup';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
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
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const typeField = form.get('type');
  const [formModelExpression, setFormModelExpression] = useState(() =>
    fromBackendModel(tagFilterExpressionField.value)
  );
  const timeConfig = useTimeConfig();
  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [formModelExpression, timeConfig]) ?? pendingResult;
  const formModelIsValid = validTagFilterExpressionResult?.data === true;
  useEffect(() => {
    onChange(['tagFilterExpression'], field =>
      formModelIsValid ? field.setValue(toBackendQueryModel(formModelExpression, false)) : field.setValue(invalidMarker)
    );
  }, [formModelIsValid, formModelExpression]);

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

      <Row withoutTopMargin>
        <Col lg={12}>
          <FormGroup>
            <Label>Filter</Label>
            <div>
              <QueryBuilder
                value={formModelExpression}
                onChange={expression => {
                  setFormModelExpression(expression);
                }}
              />
            </div>
            <TouchedMessages field={tagFilterExpressionField} />
          </FormGroup>
        </Col>
      </Row>

      <Header>Customize the widget</Header>

      <Row>
        <Col lg>
          <Row>
            <Col lg>
              <FormGroup>
                <Label htmlFor="metric-configurator-infra-type" hasError={!typeField.valid && typeField.touched}>
                  Type
                </Label>
                <Input
                  id="metric-configurator-infra-type"
                  type="text"
                  value={typeField.value}
                  onChange={e => onChange(['type'], field => field.setValue(e.target.value).setTouched(true))}
                  hasError={!typeField.valid && typeField.touched}
                />
                <TouchedMessages field={typeField} />
              </FormGroup>
            </Col>

            <Col lg>
              <FormGroup>
                <Label htmlFor="metric-configurator-infra-metric">Metric</Label>
                <Input
                  id="metric-configurator-infra-metric"
                  type="text"
                  value={metricField.value}
                  onChange={e => onChange(['metric'], field => field.setValue(e.target.value).setTouched(true))}
                  hasError={!metricField.valid && metricField.touched}
                />
                <TouchedMessages field={metricField} />
              </FormGroup>
            </Col>

            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metric-configurator-infra-aggregation"
                  hasError={!aggregationField.valid && aggregationField.touched}
                >
                  Aggregation
                </Label>
                <Select
                  id="metric-configurator-infra-aggregation"
                  value={aggregationField.value}
                  onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
                >
                  {!aggregationField.valid && <option value="">Please select an aggregation</option>}
                  {aggregationField.valid && (
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

function getIsQueryValidObservable([tagFilterExpression, timeConfig]) {
  return isQueryValid(tagFilterExpression, timeConfig);
}
