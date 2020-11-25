import React, { useEffect, useState } from 'react';
import { findIndex } from 'lodash';

import { leftArrowId, rightArrowId } from 'in-analyze/TraceDetail/components/NavigatorSplitScreen/elementIds';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import { evaluateClassNames } from 'in-services/util/classnames';
import ResultHeader from 'in-analyze/components/ResultHeader';
import { prefetch } from 'in-subscription/util/prefetch';
import getLog from 'in-logging/subscriptions/getLog';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';

import locals from './LogNavigatorSplitScreen.mless';

export default function LogNavigatorSplitScreen({ navigator, logDetail, logId, setLogId }) {
  const { totalHits, totalRepresentedItemCount, items, canLoadMore, loadMore, progress } = navigator.props;

  const [expanded, setExpanded] = useExpanded();

  const itemIndex = findIndex(items, item => item.log.id === logId);
  const hasNext = itemIndex + 1 < items.length;
  const hasPrev = itemIndex > 0;

  return (
    <div className={locals.navigatorSplitScreen}>
      {expanded && (
        <div className={locals.navigator}>
          <Sticky
            header={
              <div className={locals.header}>
                <ResultHeader itemType="Log" nbRows={totalHits} nbItems={totalRepresentedItemCount} withoutMargin />

                <div className={locals.actions}>
                  {hasPrev && (
                    <Tooltip content="View previous log (shortcut: left arrow key)">
                      <SvgIcon
                        className={locals.prev}
                        type="lib_arrow_drop_left"
                        aria-label="View previous log (shortcut: left arrow key)"
                        size="s"
                        id={leftArrowId}
                        onClick={e => openItem(e, itemIndex - 1, items, canLoadMore, loadMore, progress, setLogId)}
                      />
                    </Tooltip>
                  )}

                  {hasNext && (
                    <Tooltip content="View next log (shortcut: right arrow key)">
                      <SvgIcon
                        className={locals.next}
                        type="lib_arrow_drop_right"
                        aria-label="View next log (shortcut: right arrow key)"
                        size="s"
                        id={rightArrowId}
                        onClick={e => openItem(e, itemIndex + 1, items, canLoadMore, loadMore, progress, setLogId)}
                      />
                    </Tooltip>
                  )}

                  <Tooltip content={expanded ? 'Close sidebar' : 'Open sidebar'}>
                    <SvgIcon
                      type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                      aria-label={expanded ? 'Close sidebar' : 'Open sidebar'}
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
            <Tooltip content={expanded ? 'Close sidebar' : 'Open sidebar'}>
              <SvgIcon
                type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                aria-label={expanded ? 'Close sidebar' : 'Open sidebar'}
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
        className={evaluateClassNames({
          [locals.traceDetail]: true,
          [locals.useFullWidth]: !expanded
        })}
      >
        {logDetail}
      </div>
    </div>
  );
}

function openItem(e, itemIndex, items, canLoadMore, loadMore, progress, setLogId) {
  e.preventDefault();
  e.stopPropagation();

  if (itemIndex + 10 >= items.length && canLoadMore && !progress.loading) {
    loadMore();
  }

  const item = items[itemIndex];
  if (!item) {
    return;
  }

  const nextItem = items[itemIndex + 1];
  if (nextItem) {
    const logIdForNextPrefetch = nextItem.log.id;
    prefetch(getLog({ id: logIdForNextPrefetch }));
  }

  setLogId(item.log.id);
}

function useExpanded() {
  const screenWidth = useObservable(
    debouncedResize$
      .startWith(true)
      .map(() => window.innerWidth)
      .distinct(),
    []
  );
  const [expanded, setExpanded] = useState(getInitialState(screenWidth));
  useEffect(() => {
    setExpanded(getInitialState(screenWidth));
  }, [screenWidth]);

  return [expanded, setExpanded];
}

function getInitialState(screenWidth) {
  return screenWidth >= 1680;
}
