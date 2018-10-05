import { compose } from 'recompose';
import { findIndex } from 'lodash';
import React from 'react';

import { traceId as traceIdMatrixParameter, callId as callIdMatrixParameter } from 'in-analyze/navigation/matrix';
import getTraceActivityTreeNodeDetails from 'in-subscription/application/getTraceActivityTreeNodeDetails';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import { getMatrixParameter, setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import getTraceActivityTree from 'in-subscription/application/getTraceActivityTree';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import ItemsInGroupsIndicator from 'in-analyze/components/ItemsInGroupsIndicator';
import { traceDetail as traceDetailPath } from 'in-analyze/navigation/paths';
import getTraceSummary from 'in-subscription/application/getTraceSummary';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { evaluateClassNames } from 'in-services/util/classnames';
import { mutateUrl } from 'in-stores/navigation/navigation';
import { prefetch } from 'in-subscription/util/prefetch';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import locals from './NavigatorSplitScreen.mless';

const getCallMatcher = (traceId, callId) => item => item.call.id === callId && item.call.traceId === traceId;
const getTraceMatcher = traceId => item => item.trace.id === traceId;

export const leftArrowId = 'navigator-previous-item';
export const rightArrowId = 'navigator-next-item';

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
)(NavigatorSplitScreen);

function getInitialState({ screenWidth }) {
  return {
    expanded: screenWidth >= 1680
  };
}

function NavigatorSplitScreen({ navigator, traceDetail, expanded, setExpanded }) {
  const { isTracesDataSource, totalHits, location, items, canLoadMore, loadMore, progress } = navigator.props;
  const selectedTraceId = getMatrixParameter(location, traceDetailPath, traceIdMatrixParameter);
  const selectedCallId = getMatrixParameter(location, traceDetailPath, callIdMatrixParameter);
  const itemMatcher = isTracesDataSource
    ? getTraceMatcher(selectedTraceId)
    : getCallMatcher(selectedTraceId, selectedCallId);
  const itemIndex = findIndex(items, itemMatcher);
  const hasNext = itemIndex + 1 < items.length;
  const hasPrev = itemIndex > 0;
  const typeLabel = isTracesDataSource ? 'Trace' : 'Call';

  return (
    <div className={locals.navigatorSplitScreen}>
      {expanded && (
        <div className={locals.navigator}>
          <div className={locals.header}>
            <ItemsInGroupsIndicator
              numTraces={isTracesDataSource ? totalHits : undefined}
              numCalls={isTracesDataSource ? undefined : totalHits}
              withoutMargin
            />

            <div className={locals.actions}>
              {hasPrev && (
                <Tooltip content={`View previous ${typeLabel}`}>
                  <SvgIcon
                    type="lib_arrow_drop_left"
                    width={20}
                    className={locals.prev}
                    id={leftArrowId}
                    onClick={e =>
                      openItem(e, itemIndex - 1, items, canLoadMore, loadMore, progress, isTracesDataSource)
                    }
                  />
                </Tooltip>
              )}

              {hasNext && (
                <Tooltip content={`View next ${typeLabel}`}>
                  <SvgIcon
                    type="lib_arrow_drop_right"
                    width={20}
                    className={locals.next}
                    id={rightArrowId}
                    onClick={e =>
                      openItem(e, itemIndex + 1, items, canLoadMore, loadMore, progress, isTracesDataSource)
                    }
                  />
                </Tooltip>
              )}

              <SvgIcon
                type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                width={20}
                className={locals.toggle}
                onClick={() => setExpanded(!expanded)}
              />
            </div>
          </div>

          {navigator}
        </div>
      )}

      {!expanded && (
        <div className={locals.toggleBar}>
          <div className={locals.toggleWrapper}>
            <SvgIcon
              type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
              width={20}
              className={`${locals.toggleInBar} ${locals.toggle}`}
              onClick={() => setExpanded(!expanded)}
            />
          </div>
        </div>
      )}

      <SideEffectOnPropertyChange expanded={expanded} sideEffect={refreshWindowSizeDependingState} />

      <div
        className={evaluateClassNames({
          [locals.traceDetail]: true,
          [locals.useFullWidth]: !expanded
        })}
      >
        {traceDetail}
      </div>
    </div>
  );
}

function openItem(e, itemIndex, items, canLoadMore, loadMore, progress, isTracesDataSource) {
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

  const traceId = isTracesDataSource ? item.trace.id : item.call.traceId;
  const callId = isTracesDataSource ? undefined : item.call.id;

  const nextItem = items[itemIndex + 1];
  if (nextItem) {
    const traceIdForNextPrefetch = isTracesDataSource ? nextItem.trace.id : nextItem.call.traceId;
    const callIdForNextPrefetch = isTracesDataSource ? undefined : item.call.id;
    prefetch(getTraceSummary({ id: traceIdForNextPrefetch }));
    prefetch(getTraceActivityTree({ id: traceIdForNextPrefetch }));
    if (callIdForNextPrefetch) {
      prefetch(getTraceActivityTreeNodeDetails({ traceId: traceIdForNextPrefetch, nodeId: callIdForNextPrefetch }));
    }
  }

  mutateUrl(location => {
    setOrDeleteMatrixKey(location, traceDetailPath, traceIdMatrixParameter, traceId);
    setOrDeleteMatrixKey(location, traceDetailPath, callIdMatrixParameter, callId);
  });
}
