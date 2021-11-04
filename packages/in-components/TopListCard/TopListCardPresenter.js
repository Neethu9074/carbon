/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card } from '@instana/components';

import HistoricDataIndicator from 'in-components/HistoricDataIndicator/HistoricDataIndicator';
import LoadingIndicator from 'in-components/LoadingIndicators/LoadingIndicator';
import { TOPLIST_METRIC_CHANGED, track } from 'in-services/tracking/tracking';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import ButtonGroup from 'in-components/ButtonGroup';
import List from 'in-components/TopListCard/List';
import { t } from 'in-i18n';

export default function TopListCard(props) {
  const {
    result,
    title,
    metrics,
    labels,
    onChangeMetric,
    selectedMetric,
    header,
    List: ListRenderer = List,
    showMetricSelectorsForSingleMetrics,
    useMaxAvailableHeight,
    renderHistoricDataIndicator = false
  } = props;

  const shouldRenderOnItem = showMetricSelectorsForSingleMetrics && metrics.length === 1;

  const headerComponent =
    header ||
    ((metrics.length > 1 || shouldRenderOnItem) && (
      <ButtonGroup
        buttonPropsList={metrics.map((metric, i) => ({
          text: labels[i],
          key: metrics[i],
          kind: shouldRenderOnItem ? 'primaryv2' : null,
          disabled: shouldRenderOnItem,
          onClick: () => {
            track(TOPLIST_METRIC_CHANGED, { title, metric: labels[i] });
            onChangeMetric(metric);
          }
        }))}
        activeKey={selectedMetric}
      />
    ));

  let content;
  let withoutPadding = false;
  const height = 160;

  if (result.progress.loading) {
    content = <LoadingIndicator text={t('in-components:topListCard.loadingData')} height={height} />;
    withoutPadding = true;
  } else if (result.errors.length > 0) {
    content = <NoDataAvailable height={height} />;
    withoutPadding = true;
  } else if ((result.data instanceof Array && result.data.length === 0) || result.data.totalHits === 0) {
    content = <NoDataAvailable height={height} />;
    withoutPadding = true;
  } else {
    content = <ListRenderer {...props} />;
  }

  const leftHeaderContent =
    renderHistoricDataIndicator && result?.resultPrecisionDetails?.resultPrecision === 'PRECISION_APPROXIMATE' ? (
      <HistoricDataIndicator />
    ) : (
      undefined
    );

  return (
    <Card
      title={title}
      leftHeaderContent={leftHeaderContent}
      rightHeaderContent={headerComponent}
      withoutPadding={withoutPadding}
      useMaxAvailableHeight={useMaxAvailableHeight}
    >
      {content}
    </Card>
  );
}
