import { find, groupBy } from 'lodash';
import React from 'react';

import { onChangeGrouping } from 'in-custom-dashboards/widgets/_shared/MetricConfigurator/form';
import TagFilterConfiguration from 'in-analyze/AnalyzeView/components/TagFilterConfiguration';
import TagGroupConfiguration from 'in-analyze/AnalyzeView/components/TagGroupConfiguration';
import { availableMetrics } from 'in-applications/analyze/metrics';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-new-components/workspace/Header';
import FormGroup from 'in-components/form/FormGroup';
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
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');

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

      <TagFilterConfiguration
        tagFilters={form.get('tagFilters').value}
        onChange={tagFilters => onChange(['tagFilters'], f => f.setValue(tagFilters).setTouched(true))}
      />

      <TagGroupConfiguration
        tagFilters={form.get('tagFilters').value}
        grouping={form
          .get('grouping')
          ?.get(0)
          ?.toJS()}
        onChange={grouping => onChangeGrouping(onChange, grouping)}
      />

      <Header>Customize the widget</Header>

      <Row>
        <Col lg>
          <Row>
            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metic-configurator-application-metric"
                  hasError={!metricField.valid && metricField.touched}
                >
                  Metric
                </Label>
                <Select
                  id="metic-configurator-application-metric"
                  value={metricField.value}
                  onChange={e =>
                    onChange([], form =>
                      form
                        .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                        .updateIn(['aggregation'], field => field.setValue(''))
                    )
                  }
                  hasError={!metricField.valid && metricField.touched}
                >
                  {
                    <>
                      <option value="">Please select</option>
                      {Object.entries(groupBy(availableMetrics, ({ category }) => category || ''))
                        .sort((a, b) => compareIgnoreCase(a.category, b.category))
                        .map(([category, metrics]) => {
                          const options = metrics.map(({ metric, label }) => (
                            <option key={metric} value={metric}>
                              {label}
                            </option>
                          ));

                          if (!category) {
                            return options;
                          }

                          return (
                            <optgroup key={category} label={category}>
                              {options}
                            </optgroup>
                          );
                        })}
                    </>
                  }
                </Select>
                <TouchedMessages field={metricField} />
              </FormGroup>
            </Col>

            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metic-configurator-application-aggregation"
                  hasError={!aggregationField.valid && aggregationField.touched}
                >
                  Aggregation
                </Label>
                <Select
                  id="metic-configurator-application-aggregation"
                  value={aggregationField.value}
                  onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
                  hasError={!aggregationField.valid && aggregationField.touched}
                  disabled={!metricField.valid}
                >
                  {!metricField.valid && <option value="">Please select a metric</option>}
                  {metricField.valid && (
                    <>
                      <option value="">Please select</option>
                      {getAggregations(metricField.value).map(aggregation => (
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
        </Col>

        {widgetPreview && <Col lg>{widgetPreview}</Col>}
      </Row>

      {timeShiftConfiguration}
    </>
  );
}

function getAggregations(metric) {
  return find(availableMetrics, ({ metric: m }) => m === metric).supportedAggregations;
}
