/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { chain, get } from 'lodash';
import classNames from 'classnames';
import React from 'react';

import { getLastValueTooltipLabel } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import { valueMissingPlaceholder } from 'in-components/valueMissingPlaceholder';
import ViewAllWrapper from 'in-components/TopListCard/ViewAllWrapper';
import Tooltip from 'in-components/Tooltip/Tooltip';
import Row from 'in-components/TopListCard/Row';

import locals from './List.mless';

export default function TopListPresenter(props) {
  const {
    result,
    selectedMetric,
    selectedMetricFormatter,
    selectedCompanionMetricAlias,
    selectedCompanionMetric,
    selectedCompanionMetricFormatter,
    selectedMetricColor,
    ViewAll,
    Label,
    Metric,
    CompanionMetric,
    getItemsFromResult = getItemsFromPaginatedResult,
    getMetricValueFromItem = getMetricValueFromItemWithMetricsHash,
    isScrollbarVisible = false
  } = props;

  const items = getItemsFromResult(result);
  const maxValue = chain(items).map(getMetricValueFromItem.bind(null, selectedMetric)).max();
  const usingLastValue = props.config?.metricConfiguration?.lastValue;
  const lastValueTooltipContent = getLastValueTooltipLabel(props.timeConfig);

  return (
    <div
      className={classNames({
        [locals.topListWrapper]: true,
        [locals.scrollbar]: isScrollbarVisible
      })}
    >
      <ol className={locals.topList}>
        {items.map((item, i) => {
          let metricValue = getMetricValueFromItem(selectedMetric, item);
          let formattedMetricValue;
          if (metricValue != null) {
            formattedMetricValue = selectedMetricFormatter(metricValue);
          } else {
            metricValue = 0;
            formattedMetricValue = valueMissingPlaceholder;
          }
          const renderProps = {
            ...props,
            item,
            metricValue,
            formattedMetricValue
          };
          const MetricRenderer = () => (Metric ? <Metric {...renderProps} /> : <span>{formattedMetricValue}</span>);
          const MetricRenderedWithTooltip = () => (
            <Tooltip content={lastValueTooltipContent}>
              <span>{formattedMetricValue}</span>
            </Tooltip>
          );

          let CompanionMetricRenderer;
          if (selectedCompanionMetric) {
            const selector =
              selectedCompanionMetric === selectedMetric ? selectedCompanionMetricAlias : selectedCompanionMetric;
            const companionValue = getMetricValueFromItem(selector, item);
            const formattedCompanionMetric = selectedCompanionMetricFormatter(companionValue);
            CompanionMetricRenderer = CompanionMetric
              ? () => <CompanionMetric formattedCompanionMetric={formattedCompanionMetric} />
              : () => <span>{formattedCompanionMetric}</span>;
          }
          const LabelRenderer = () => <Label {...renderProps} className={locals.label} />;
          return (
            <Row
              key={i}
              Metric={usingLastValue ? MetricRenderedWithTooltip : MetricRenderer}
              metricValue={metricValue}
              CompanionMetric={CompanionMetricRenderer}
              maxValue={maxValue}
              Label={LabelRenderer}
              color={selectedMetricColor}
            />
          );
        })}
      </ol>

      {ViewAll && <ViewAllWrapper {...props} items={items} />}
    </div>
  );
}

function getItemsFromPaginatedResult(result) {
  return result.data.items;
}

function getMetricValueFromItemWithMetricsHash(metricId, item) {
  return get(item, ['metrics', metricId, 0, 1]);
}
