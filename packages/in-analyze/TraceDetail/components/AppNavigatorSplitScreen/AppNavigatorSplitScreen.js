/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import { compose } from 'recompose';
import { findIndex } from 'lodash';
import React from 'react';

import { traceId as traceIdMatrixParameter, callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import { leftArrowId, rightArrowId } from 'in-new-components/AnalyzeView/SplitScreenList/elementIds';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { traceDetail as traceDetailPath } from 'in-analyze/navigation/paths';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import getConfigByDataSource from 'in-analyze/AnalyzeView/dataSources';
import withPropDependingState from 'in-hoc/withPropDependingState';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { prefetch } from 'in-subscription/util/prefetch';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './AppNavigatorSplitScreen.mless';

export default compose(
  connectTo({
    screenWidth: debouncedResize$
      .startWith(true)
      .map(() => window.innerWidth)
      .distinct()
  }),
  withPropDependingState({
    getInitialState,
    resets: [
      {
        getResettingProps: () => ['screenWidth'],
        onReset: getInitialState
      }
    ],
    reducerName: 'setExpanded',
    reducer: (prevState, expanded) => ({
      ...prevState,
      expanded
    })
  })
)(AppNavigatorSplitScreen);

function getInitialState({ screenWidth }) {
  return {
    expanded: screenWidth >= 1680
  };
}

function AppNavigatorSplitScreen({ navigator, traceDetail, expanded, setExpanded, dataSource, traceId, callId }) {
  const { totalHits, totalRepresentedItemCount, location, items, canLoadMore, loadMore, progress } = navigator.props;

  const dataSourceConfig = getConfigByDataSource(dataSource);
  const selectedTraceId = traceId ?? getMatrixParameter(location, traceDetailPath, traceIdMatrixParameter);
  const selectedCallId =
    callId ?? (location ? getMatrixParameter(location, traceDetailPath, callIdMatrixParameter) : null);
  const itemMatcher = dataSourceConfig.getMatcher(selectedTraceId, selectedCallId);
  const itemIndex = findIndex(items, itemMatcher);
  const hasNext = itemIndex + 1 < items.length;
  const hasPrev = itemIndex > 0;
  const typeLabel = dataSourceConfig.typeLabel;

  return (
    <div className={locals.navigatorSplitScreen}>
      {expanded && (
        <div className={locals.navigator}>
          <Sticky
            header={
              <div className={locals.header}>
                <ResultHeader
                  itemType={typeLabel}
                  nbRows={totalHits}
                  nbItems={totalRepresentedItemCount}
                  withoutMargin
                />

                <div className={locals.actions}>
                  {hasPrev && (
                    <Tooltip
                      content={t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipViewPrevious', {
                        viewType: typeLabel.toLowerCase()
                      })}
                    >
                      <SvgIcon
                        type="lib_arrow_drop_left"
                        aria-label={t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipViewPrevious', {
                          viewType: typeLabel.toLowerCase()
                        })}
                        size="s"
                        className={locals.prev}
                        id={leftArrowId}
                        onClick={e =>
                          openItem(e, itemIndex - 1, items, canLoadMore, loadMore, progress, dataSourceConfig)
                        }
                      />
                    </Tooltip>
                  )}

                  {hasNext && (
                    <Tooltip
                      content={t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipViewNext', {
                        viewType: typeLabel.toLowerCase()
                      })}
                    >
                      <SvgIcon
                        type="lib_arrow_drop_right"
                        aria-label={t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipViewNext', {
                          viewType: typeLabel.toLowerCase()
                        })}
                        size="s"
                        className={locals.next}
                        id={rightArrowId}
                        onClick={e =>
                          openItem(e, itemIndex + 1, items, canLoadMore, loadMore, progress, dataSourceConfig)
                        }
                      />
                    </Tooltip>
                  )}

                  <Tooltip
                    content={
                      expanded
                        ? t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipCloseSidebar')
                        : t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipOpenSidebar')
                    }
                  >
                    <SvgIcon
                      type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                      aria-label={
                        expanded
                          ? t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipCloseSidebar')
                          : t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipOpenSidebar')
                      }
                      size="s"
                      className={locals.toggle}
                      onClick={() => setExpanded(!expanded)}
                    />
                  </Tooltip>
                </div>
              </div>
            }
          >
            {navigator}
          </Sticky>
        </div>
      )}

      {!expanded && (
        <div className={locals.toggleBar}>
          <div className={locals.toggleWrapper}>
            <Tooltip
              content={
                expanded
                  ? t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipCloseSidebar')
                  : t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipOpenSidebar')
              }
            >
              <SvgIcon
                type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                aria-label={
                  expanded
                    ? t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipCloseSidebar')
                    : t('in-analyze:traceDetails.appNavigatorSplitScreen.tooltipOpenSidebar')
                }
                size="s"
                className={`${locals.toggleInBar} ${locals.toggle}`}
                onClick={() => setExpanded(!expanded)}
              />
            </Tooltip>
          </div>
        </div>
      )}

      <SideEffectOnPropertyChange expanded={expanded} sideEffect={refreshWindowSizeDependingState} />

      <div
        className={classNames({
          [locals.traceDetail]: true,
          [locals.useFullWidth]: !expanded
        })}
      >
        {traceDetail}
      </div>
    </div>
  );
}

function openItem(e, itemIndex, items, canLoadMore, loadMore, progress, dataSourceConfig) {
  e.preventDefault();
  e.stopPropagation();

  // todo only do when clicking on next/prev
  if (itemIndex + 10 >= items.length && canLoadMore && !progress.loading) {
    loadMore();
  }

  const item = items[itemIndex];
  if (!item) {
    return;
  }

  const traceId = dataSourceConfig.getTraceIdByItem(item);
  const callId = dataSourceConfig.getCallIdByItem(item);

  const nextItem = items[itemIndex + 1];
  if (nextItem) {
    const traceIdForNextPrefetch = dataSourceConfig.getTraceIdByItem(nextItem);
    const callIdForNextPrefetch = dataSourceConfig.getCallIdByItem(nextItem);
    prefetch(getTraceSummary({ id: traceIdForNextPrefetch }));
    if (callIdForNextPrefetch) {
      prefetch(getTraceActivityTreeNodeDetails({ traceId: traceIdForNextPrefetch, nodeId: callIdForNextPrefetch }));
    }
  }

  mutateUrl(location => {
    setOrDeleteMatrixKey(location, traceDetailPath, traceIdMatrixParameter, traceId);
    setOrDeleteMatrixKey(location, traceDetailPath, callIdMatrixParameter, callId);
  });
}
