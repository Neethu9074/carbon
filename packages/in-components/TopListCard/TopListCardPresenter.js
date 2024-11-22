/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { Card, HorizontalIndicator, LoadingSkeleton, Message, IconButton, SvgIcon } from '@instana/components';
import { ButtonGroup } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { TOPLIST_METRIC_CHANGED, track } from 'in-services/tracking/tracking';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import Tooltip from 'in-components/Tooltip/Tooltip';
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
    hasApproximateData = false,
    approximateTooltipText = t('in-components:approximateDataIndicator.dataRetention'),
    renderWidgetNotSupportedIndicator = false,
    isScrollbarVisible = false,
    helpInfo,
    isInModal,
    noDataMessage,
    topLevelFilterInfo
  } = props;
  const shouldRenderOnItem = showMetricSelectorsForSingleMetrics && metrics.length === 1;

  const cardTitleAlphanumeric = (title || '').replace(/[^a-zA-Z\d]/g, '');
  const headerComponent =
    header ||
    ((metrics.length > 1 || shouldRenderOnItem) && (
      <ButtonGroup
        id={`button-group-${cardTitleAlphanumeric}`}
        disabledWidgetInLive={renderWidgetNotSupportedIndicator}
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
    content = <QueryFailed errors={result.errors} />;
    withoutPadding = true;
  } else if ((result.data instanceof Array && result.data.length === 0) || result.data.totalHits === 0) {
    content = <NoDataAvailable text={noDataMessage} height={height} />;
    withoutPadding = true;
  } else {
    content = <ListRenderer {...props} />;
  }

  const LeftHeaderContent = () => {
    return (
      <>
        {renderHistoricDataIndicator && hasApproximateData && (
          <Tooltip content={approximateTooltipText}>
            <SvgIcon type="lib_approximately_equal" color={themes.default.ids.color.option.neutral['300']} />
          </Tooltip>
        )}
        {renderWidgetNotSupportedIndicator && (
          <Tooltip content={t('in-components:liveModeIndicator.widgetNotSupportedInLiveMode')}>
            <IconButton
              iconDescription={t('in-components:liveModeIndicator.widgetNotSupportedInLiveMode')}
              type="lib_help_error_info_outline"
              className={locals.infoIconWithoutPadding}
            />
          </Tooltip>
        )}
        {helpInfo && (
          <Tooltip content={helpInfo}>
            <IconButton
              iconDescription={helpInfo}
              type="lib_help_error_info_outline"
              className={locals.infoIconWithoutPadding}
            />
          </Tooltip>
        )}
        {topLevelFilterInfo && (
          <Tooltip content={topLevelFilterInfo}>
            <IconButton
              iconDescription={topLevelFilterInfo}
              type="lib_help_error_info_outline"
              className={locals.infoIconWithoutPadding}
            />
          </Tooltip>
        )}
      </>
    );
  };

  const card = (
    <Card
      className={classNames({
        [locals.disabledWidget]: renderWidgetNotSupportedIndicator,
        [locals.modal]: isInModal,
        [locals.scrollbar]: isScrollbarVisible
      })}
      title={title}
      bodyClassName={classNames({
        [locals.modal]: isInModal
      })}
      leftHeaderContent={isInModal ? undefined : <LeftHeaderContent />}
      rightHeaderContent={isInModal ? undefined : headerComponent}
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

function QueryFailed({ errors }) {
  const [error] = errors.map(e => {
    const [status, message] = e.message.split(':');
    return { code: e.code, message: message, status: status };
  });
  switch (error.code) {
    case 'TIMEOUT':
    case 'GATEWAY_TIMEOUT':
      return (
        <Message
          type="warning"
          withIcon
          className={locals.bottomSpace}
          title={
            error.message?.includes('The query would take too long to run.')
              ? t('in-components:error.timeoutEstimated')
              : t('in-components:error.timeout')
          }
          description={t('in-components:error.timeoutInfo')}
        />
      );
    case 'CLIENT':
    case 'TOO_MANY_REQUESTS':
      return (
        <Message
          type="warning"
          withIcon
          className={locals.bottomSpace}
          title={t('in-components:error.tooManyRequests')}
          description={t('in-components:error.tooManyRequestsInfo')}
        />
      );
    case 'SERVER':
    default:
      return (
        <Message
          type="warning"
          withIcon
          className={locals.bottomSpace}
          title={t('in-components:error.serverError')}
          description={t('in-components:error.serverErrorInfo')}
        />
      );
  }
}
