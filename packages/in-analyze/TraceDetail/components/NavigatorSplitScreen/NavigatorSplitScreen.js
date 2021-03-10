/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import classNames from 'classnames';
import { compose } from 'recompose';
import React from 'react';

import { leftArrowId, rightArrowId } from 'in-new-components/AnalyzeView/SplitScreenList/elementIds';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import withPropDependingState from 'in-hoc/withPropDependingState';
import ResultHeader from 'in-analyze/components/ResultHeader';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

import locals from './NavigatorSplitScreen.mless';

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

function NavigatorSplitScreen({
  navigator,
  typeLabel,
  totalHits,
  totalRepresentedItemCount,
  resultCountLimit,
  items,
  openItemIndex,
  openItem: customOpenItem,
  canLoadMore,
  loadMore,
  progress,
  children,
  expanded,
  setExpanded
}) {
  const nextOpenItemIndex = findNextIndexToOpen(openItemIndex, items);
  const prevOpenItemIndex = findPrevIndexToOpen(openItemIndex, items);
  const hasNext = openItemIndex < nextOpenItemIndex;
  const hasPrev = openItemIndex > prevOpenItemIndex;

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
                  resultCountLimit={resultCountLimit}
                  withoutMargin
                  withMaxWidth
                />

                <div className={locals.actions}>
                  {hasPrev && (
                    <Tooltip
                      content={t('in-analyze:traceDetails.navigatorSplitScreen.tooltipViewPrevious', {
                        viewType: typeLabel.toLowerCase()
                      })}
                    >
                      <SvgIcon
                        type="lib_arrow_drop_left"
                        aria-label={t('in-analyze:traceDetails.navigatorSplitScreen.tooltipViewPrevious', {
                          viewType: typeLabel.toLowerCase()
                        })}
                        size="s"
                        className={locals.prev}
                        id={leftArrowId}
                        onClick={e =>
                          openItem(e, prevOpenItemIndex, items, canLoadMore, loadMore, progress, customOpenItem)
                        }
                      />
                    </Tooltip>
                  )}

                  {hasNext && (
                    <Tooltip
                      content={t('in-analyze:traceDetails.navigatorSplitScreen.tooltipViewNext', {
                        viewType: typeLabel.toLowerCase()
                      })}
                    >
                      <SvgIcon
                        type="lib_arrow_drop_right"
                        aria-label={t('in-analyze:traceDetails.navigatorSplitScreen.tooltipViewNext', {
                          viewType: typeLabel.toLowerCase()
                        })}
                        size="s"
                        className={locals.next}
                        id={rightArrowId}
                        onClick={e =>
                          openItem(e, nextOpenItemIndex, items, canLoadMore, loadMore, progress, customOpenItem)
                        }
                      />
                    </Tooltip>
                  )}

                  <Tooltip
                    content={
                      expanded
                        ? t('in-analyze:traceDetails.navigatorSplitScreen.tooltipCloseSidebar')
                        : t('in-analyze:traceDetails.navigatorSplitScreen.tooltipOpenSidebar')
                    }
                  >
                    <SvgIcon
                      type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                      aria-label={
                        expanded
                          ? t('in-analyze:traceDetails.navigatorSplitScreen.tooltipCloseSidebar')
                          : t('in-analyze:traceDetails.navigatorSplitScreen.tooltipOpenSidebar')
                      }
                      size="s"
                      className={locals.toggle}
                      onClick={() => setExpanded(!expanded)}
                    />
                  </Tooltip>
                </div>
              </div>
            }
            useFixedLayout
            contentWidth={'20rem'}
          >
            {navigator}
          </Sticky>
        </div>
      )}

      {!expanded && (
        <div className={locals.toggleBar}>
          <Sticky
            header={
              <div className={locals.toggleWrapper}>
                <Tooltip
                  content={
                    expanded
                      ? t('in-analyze:traceDetails.navigatorSplitScreen.tooltipCloseSidebar')
                      : t('in-analyze:traceDetails.navigatorSplitScreen.tooltipOpenSidebar')
                  }
                >
                  <SvgIcon
                    type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                    aria-label={
                      expanded
                        ? t('in-analyze:traceDetails.navigatorSplitScreen.tooltipCloseSidebar')
                        : t('in-analyze:traceDetails.navigatorSplitScreen.tooltipOpenSidebar')
                    }
                    size="s"
                    className={`${locals.toggleInBar} ${locals.toggle}`}
                    onClick={() => setExpanded(!expanded)}
                  />
                </Tooltip>
              </div>
            }
          />
        </div>
      )}

      <SideEffectOnPropertyChange expanded={expanded} sideEffect={refreshWindowSizeDependingState} />

      <div
        className={classNames({
          [locals.detailView]: true,
          [locals.useFullWidth]: !expanded
        })}
      >
        {children}
      </div>
    </div>
  );
}

// export for test
export function findNextIndexToOpen(currentIndex, items) {
  for (let i = currentIndex + 1; i < items.length; i++) {
    if (!items[i].isDisabledForOpen) {
      return i;
    }
  }
  return currentIndex;
}

// export for test
export function findPrevIndexToOpen(currentIndex, items) {
  for (let i = currentIndex - 1; i >= 0; i--) {
    if (!items[i].isDisabledForOpen) {
      return i;
    }
  }
  return currentIndex;
}

function openItem(e, openItemIndex, items, canLoadMore, loadMore, progress, customOpenItem) {
  e.preventDefault();
  e.stopPropagation();

  // todo only do when clicking on next/prev
  if (openItemIndex + 10 >= items.length && canLoadMore && !progress.loading) {
    loadMore();
  }

  const item = items[openItemIndex];
  if (!item) {
    return;
  }

  customOpenItem(item);
}
