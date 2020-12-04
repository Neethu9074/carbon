import React, { useState, useEffect } from 'react';

import TypeAndMetricConfigurator, {
  typeAndMetricSeparator
} from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/sources/infrastructure/metrics/TypeAndMetricConfigurator';
import { toBackendQueryModel } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import { EMPTY_EXPRESSION } from 'in-new-components/QueryBuilder/transformation/backendQueryModel';
import QueryBuilder, { isQueryValid } from 'in-infrastructure/Explore/components/QueryBuilder';
import GroupingConfigurator from 'in-infrastructure/Explore/components/GroupingConfigurator';
import { fromBackendModel } from 'in-new-components/QueryBuilder/transformation/formModel';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import { pendingResult } from 'in-services/fixedObjects';
import FormGroup from 'in-components/form/FormGroup';
import useTimeConfig from 'in-hooks/useTimeConfig';
import useObservable from 'in-hooks/useObservable';
import Select from 'in-components/form/Select';
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
  const typeField = form.get('type');
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const tagFilterExpressionField = form.get('tagFilterExpression');
  const [formModelExpression, setFormModelExpression] = useState(() =>
    fromBackendModel(tagFilterExpressionField.value)
  );
  const timeConfig = useTimeConfig();
  const validTagFilterExpressionResult =
    useObservable(getIsQueryValidObservable, [formModelExpression, timeConfig]) ?? pendingResult;
  const formModelIsValid = validTagFilterExpressionResult.data === true;
  useEffect(() => {
    onChange(['tagFilterExpression'], field =>
      formModelIsValid
        ? field.setValue(toBackendQueryModel(formModelExpression, false))
        : field.setValue(EMPTY_EXPRESSION)
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

      <Row withoutTopMargin>
        <Col lg>
          <FormGroup>
            <Label>Group by</Label>
            <div>
              <GroupingConfigurator
                value={getGrouping(form)?.by}
                tagFilterExpression={tagFilterExpressionField.value}
                onChange={infraExploreGrouping => onChangeGrouping(onChange, { by: infraExploreGrouping })}
              />
            </div>
          </FormGroup>
        </Col>
        <Col lg={4}>
          <FormGroup>
            <Label htmlFor="select-top-groups">Select</Label>
            <Select
              id="select-top-groups"
              value={getGrouping(form)?.direction}
              onChange={e => onChangeGrouping(onChange, { ...getGrouping(form), direction: e.target.value })}
              disabled={!getGrouping(form)}
            >
              <option value="DESC">Top 5</option>
              <option value="ASC">Bottom 5</option>
            </Select>
          </FormGroup>
        </Col>
      </Row>

      <Row withoutTopMargin>
        <Col lg={8}>
          <FormGroup>
            <Label
              htmlFor="metric-configurator-infra-metric"
              hasError={(!typeField.valid && typeField.touched) || (!metricField.valid && metricField.touched)}
            >
              Metric
            </Label>
            <div>
              <TypeAndMetricConfigurator
                tagName={typeField.value + typeAndMetricSeparator + metricField.value}
                tagFilterExpression={tagFilterExpressionField.value}
                timeConfig={timeConfig}
                onChange={tagName => {
                  const [type, metric] = tagName.split(typeAndMetricSeparator, 2);
                  onChange([], form =>
                    form
                      .updateIn(['metric'], field => field.setValue(metric).setTouched(true))
                      .updateIn(['type'], field => field.setValue(type).setTouched(true))
                  );
                }}
                label="Select metric"
                loadingLabel="Loading metrics"
              />
            </div>
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
      <Row withoutTopMargin>
        <Col lg={12}>
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

function getGrouping(form) {
  return form
    .get('grouping')
    ?.get(0)
    ?.toJS();
}
