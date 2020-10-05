import { find, groupBy } from 'lodash';
import React from 'react';

import { availableMetrics } from 'in-applications/analyze/metrics';
import { evaluateClassNames } from 'in-services/util/classnames';
import TouchedMessages from 'in-components/form/TouchedMessages';
import { compareIgnoreCase } from 'in-services/util/string';
import { aggregationLabels } from 'in-stores/metric/metric';
import FormGroup from 'in-components/form/FormGroup';
import { isBlank } from 'in-services/util/string';
import Select from 'in-components/form/Select';
import Label from 'in-components/form/Label';

import locals from './TagGroupConfigurationWrapper.mless';

/**
 * The presentational part of the grouping in the metric configurator.
 * Shows the quick group bar, the "list" of groups, which can only contain one group, and the settings below.
 * Any change calls the related onChange function.
 */
export default function TagGroupConfigurationWrapper({
  quickGroupBar,
  tagGroupList,
  grouping,
  isEmpty = false,
  disabled,
  onDirectionChange,
  onMetricChange,
  onAggregationChange,
  isMultiMetrics
}) {
  let emptyMessage = 'No group defined.';
  if (disabled) {
    emptyMessage = isMultiMetrics
      ? 'Grouping is not supported for multiple metrics.'
      : 'Select a stacked chart type to enable grouping.';
  }
  return (
    <div
      className={evaluateClassNames({
        [locals.wrapper]: true,
        [locals.disabled]: disabled
      })}
    >
      <div className={locals.bar}>{quickGroupBar}</div>
      <div className={locals.list}>
        {!isEmpty && tagGroupList}
        {isEmpty && <div className={locals.empty}>{emptyMessage}</div>}
      </div>
      {!isEmpty && (
        <div className={locals.barBottom}>
          <div className={locals.barBottomContent}>
            <div className={locals.barBottomLeft}>
              <div className={locals.barBottomDrop}>
                <FormGroup>
                  <Label htmlFor="select-top-groups">Select</Label>
                  <Select
                    className={locals.select}
                    id="select-top-groups"
                    value={grouping.get('direction').value}
                    onChange={e => {
                      onDirectionChange(e.target.value);
                    }}
                  >
                    <option value="DESC">Top 5</option>
                    <option value="ASC">Bottom 5</option>
                  </Select>
                </FormGroup>
              </div>
              <div className={locals.barBottomDrop}>
                <FormGroup>
                  <Label
                    hasError={!grouping.get('metric').valid && grouping.get('metric').touched}
                    htmlFor="select-metric"
                  >
                    Metric
                  </Label>
                  <Select
                    className={locals.select}
                    id="select-metric"
                    value={grouping.get('metric').value}
                    onChange={e => onMetricChange(e.target.value)}
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
                  <TouchedMessages field={grouping.get('metric')} />
                </FormGroup>
              </div>
              <div className={locals.barBottomDrop}>
                <FormGroup>
                  <Label
                    hasError={!grouping.get('aggregation').valid && grouping.get('aggregation').touched}
                    htmlFor="select-aggregation"
                  >
                    Aggregation
                  </Label>
                  <Select
                    className={locals.select}
                    id="select-aggregation"
                    value={grouping.get('aggregation').value}
                    disabled={isBlank(grouping.get('metric').value)}
                    onChange={e => onAggregationChange(e.target.value)}
                  >
                    {isBlank(grouping.get('metric').value) ? (
                      <option value="">Please select a metric</option>
                    ) : (
                      <>
                        <option value="">Please select</option>
                        {getAggregations(grouping.get('metric').value).map(aggregation => (
                          <option key={aggregation} value={aggregation}>
                            {aggregationLabels[aggregation]}
                          </option>
                        ))}
                      </>
                    )}
                  </Select>
                  <TouchedMessages field={grouping.get('aggregation')} />
                </FormGroup>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function getAggregations(metric) {
  return find(availableMetrics, ({ metric: m }) => m === metric)?.supportedAggregations || [];
}
