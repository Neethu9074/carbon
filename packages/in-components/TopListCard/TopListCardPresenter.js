/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { Card, HorizontalIndicator, LoadingSkeleton } from '@instana/components';

import MultiLineToolTipIcon from 'in-components/MultiLineToolTipIcon/MultiLineToolTipIcon';
import { TOPLIST_METRIC_CHANGED, track } from 'in-services/tracking/tracking';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import ButtonGroup from 'in-components/ButtonGroup';
import List from 'in-components/TopListCard/List';
import { t } from 'in-i18n';

import locals from './TopListCardPresenter.mless';

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
    renderHistoricDataIndicator = false,
    hasApproximateData = false
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
    content = <TopListSkeleton />;
    withoutPadding = true;
  } else if (result.errors.length > 0) {
    const text = result.errors[0].message;
    content = <NoDataAvailable text={text} height={height} />;
    withoutPadding = true;
  } else if ((result.data instanceof Array && result.data.length === 0) || result.data.totalHits === 0) {
    content = <NoDataAvailable height={height} />;
    withoutPadding = true;
  } else {
    content = <ListRenderer {...props} />;
  }

  const leftHeaderContent =
    renderHistoricDataIndicator && hasApproximateData ? (
      <MultiLineToolTipIcon lines={[t('in-components:approximateDataIndicator.dataRetention')]} />
    ) : (
      undefined
    );

  const card = (
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

  if (result.progress.loading) {
    return (
      <div className={locals.loadingBarContainer}>
        <HorizontalIndicator progress={result.progress} className={locals.horizontalIndicator} />
        {card}
      </div>
    );
  } else {
    return card;
  }
}

function TopListSkeleton() {
  return (
    <div className={locals.skeletonWrapper}>
      <LoadingSkeleton className={locals.itemSkeleton} />
      <LoadingSkeleton className={locals.itemSkeleton} />
      <LoadingSkeleton className={locals.itemSkeleton} />
    </div>
  );
}
