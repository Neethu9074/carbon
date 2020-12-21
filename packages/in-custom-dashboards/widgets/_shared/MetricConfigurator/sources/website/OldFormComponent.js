import { find, groupBy } from 'lodash';
import React from 'react';

import TagFilterConfiguration from 'in-websites/analyze/AnalyzeView/TagFilterConfiguration';
import { availableMetrics } from 'in-websites/analyze/AnalyzeView/metrics';
import { isNotBlank, compareIgnoreCase } from 'in-services/util/string';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { aggregationLabels } from 'in-stores/metric/metric';
import { Row, Col } from 'in-new-components/layout/Grid';
import Header from 'in-new-components/workspace/Header';
import FormGroup from 'in-components/form/FormGroup';
import { dataSourceTitles } from 'in-websites/tags';
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
  const beaconTypeField = form.get('beaconType');
  const metricField = form.get('metric');
  const aggregationField = form.get('aggregation');
  const beaconTypeTagFilter = form.get('tagFilters').value.find(t => t.name === 'beacon.type');

  return (
    <>
      {labelFormGroup && (
        <Row>
          <Col lg={6}>{labelFormGroup}</Col>
        </Row>
      )}

      <Row withoutTopMargin>
        <Col lg>{dataSourceFormGroup}</Col>

        <Col lg>
          <FormGroup>
            <Label
              htmlFor="metic-configurator-website-beacon-type"
              hasError={!beaconTypeField.valid && beaconTypeField.touched}
            >
              Beacon Type
            </Label>
            <Select
              id="metic-configurator-website-beacon-type"
              value={beaconTypeField.value}
              onChange={e =>
                onChange([], form =>
                  form
                    .updateIn(['beaconType'], field => field.setValue(e.target.value).setTouched(true))
                    .updateIn(['metric'], field => field.setValue(''))
                    .updateIn(['aggregation'], field => field.setValue(''))
                    .updateIn(['tagFilters'], field => {
                      const tagFilters = [];
                      if (isNotBlank(e.target.value)) {
                        tagFilters.push({
                          name: 'beacon.type',
                          operator: 'EQUALS',
                          stringValue: e.target.value
                        });
                      }
                      return field.setValue(tagFilters);
                    })
                )
              }
              hasError={!beaconTypeField.valid && beaconTypeField.touched}
            >
              <option value="">Please select</option>
              {Object.keys(dataSourceTitles)
                .sort((a, b) => compareIgnoreCase(dataSourceTitles[a], dataSourceTitles[b]))
                .map(key => (
                  <option key={key} value={key}>
                    {dataSourceTitles[key]}
                  </option>
                ))}
            </Select>
            <TouchedMessages field={beaconTypeField} />
          </FormGroup>
        </Col>
      </Row>

      <TagFilterConfiguration
        // Do not show the beacon type tag filter in the list
        tagFilters={form.get('tagFilters').value.filter(t => t !== beaconTypeTagFilter)}
        onChange={tagFilters =>
          onChange(['tagFilters'], field => field.setValue(tagFilters.concat(beaconTypeTagFilter)).setTouched(true))
        }
        beaconType={beaconTypeField.value}
      />

      <Header>Customize the widget</Header>

      <Row>
        <Col lg>
          <Row>
            <Col lg>
              <FormGroup>
                <Label htmlFor="metic-configurator-website-metric" hasError={!metricField.valid && metricField.touched}>
                  Metric
                </Label>
                <Select
                  id="metic-configurator-website-metric"
                  value={metricField.value}
                  onChange={e =>
                    onChange([], form =>
                      form
                        .updateIn(['metric'], field => field.setValue(e.target.value).setTouched(true))
                        .updateIn(['aggregation'], field => field.setValue(''))
                    )
                  }
                  hasError={!metricField.valid && metricField.touched}
                  disabled={!beaconTypeField.valid}
                >
                  {!beaconTypeField.valid && <option value="">Please select a data source</option>}
                  {beaconTypeField.valid && (
                    <>
                      <option value="">Please select</option>
                      {Object.entries(
                        groupBy(availableMetrics[beaconTypeField.value], ({ category }) => category || '')
                      )
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
                  )}
                </Select>
                <TouchedMessages field={metricField} />
              </FormGroup>
            </Col>

            <Col lg>
              <FormGroup>
                <Label
                  htmlFor="metic-configurator-website-aggregation"
                  hasError={!aggregationField.valid && aggregationField.touched}
                >
                  Aggregation
                </Label>
                <Select
                  id="metic-configurator-website-aggregation"
                  value={aggregationField.value}
                  onChange={e => onChange(['aggregation'], field => field.setValue(e.target.value).setTouched(true))}
                  hasError={!aggregationField.valid && aggregationField.touched}
                  disabled={!metricField.valid}
                >
                  {!metricField.valid && <option value="">Please select a metric</option>}
                  {metricField.valid && (
                    <>
                      <option value="">Please select</option>
                      {getAggregations(beaconTypeField.value, metricField.value).map(aggregation => (
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

function getAggregations(beaconType, metric) {
  const metricDefinition = find(availableMetrics[beaconType], ({ metric: m }) => m === metric);
  return metricDefinition.supportedAggregations;
}
