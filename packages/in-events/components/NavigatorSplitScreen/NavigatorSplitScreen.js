/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useEffect } from 'react';
import classNames from 'classnames';

import { SvgIcon } from '@instana/components';

import { findNextIndexToOpen, findPrevIndexToOpen } from 'in-events/components/NavigatorSplitScreen/FindIndex.js';
import { leftArrowId, rightArrowId } from 'in-components/AnalyzeView/SplitScreenList/elementIds';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import ResultHeader from 'in-analyze/components/ResultHeader';
import Tooltip from 'in-components/Tooltip';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';
import { t } from 'in-i18n';

import locals from './NavigatorSplitScreen.mless';

function getInitialState(screenWidth) {
  return screenWidth >= 1680;
}

export default connectTo({
  screenWidth: debouncedResize$
    .startWith(true)
    .map(() => window.innerWidth)
    .distinct()
})(NavigatorSplitScreen);

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
  screenWidth,
  resultPrecisionDetails
}) {
  const [expanded, setExpanded] = useState(getInitialState(screenWidth));
  useEffect(() => {
    setExpanded(getInitialState(screenWidth));
  }, [screenWidth]);

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
                  resultPrecisionDetails={resultPrecisionDetails}
                  withoutMargin
                  withMaxWidth
                />

                <div className={locals.actions}>
                  {hasPrev && (
                    <Tooltip
                      content={t('in-events:navigatorSplitScreen.tooltipViewPrevious', {
                        context: typeLabel
                      })}
                      align={'auto'}
                    >
                      <SvgIcon
                        type="lib_arrow_drop_left"
                        aria-label={t('in-events:navigatorSplitScreen.tooltipViewPrevious', {
                          context: typeLabel
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
                      content={t('in-events:navigatorSplitScreen.tooltipViewNext', {
                        context: typeLabel
                      })}
                      align={'auto'}
                    >
                      <SvgIcon
                        type="lib_arrow_drop_right"
                        aria-label={t('in-events:navigatorSplitScreen.tooltipViewNext', {
                          context: typeLabel
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
                        ? t('in-events:navigatorSplitScreen.tooltipCloseSidebar')
                        : t('in-events:navigatorSplitScreen.tooltipOpenSidebar')
                    }
                    align={'auto'}
                  >
                    <SvgIcon
                      type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                      aria-label={
                        expanded
                          ? t('in-events:navigatorSplitScreen.tooltipCloseSidebar')
                          : t('in-events:navigatorSplitScreen.tooltipOpenSidebar')
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
                      ? t('in-events:navigatorSplitScreen.tooltipCloseSidebar')
                      : t('in-events:navigatorSplitScreen.tooltipOpenSidebar')
                  }
                  align={'bottomLeft'}
                >
                  <SvgIcon
                    type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                    aria-label={
                      expanded
                        ? t('in-events:navigatorSplitScreen.tooltipCloseSidebar')
                        : t('in-events:navigatorSplitScreen.tooltipOpenSidebar')
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

function openItem(e, openItemIndex, items, canLoadMore, loadMore, progress, customOpenItem) {
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
