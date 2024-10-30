/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState, useLayoutEffect } from 'react';
import { findIndex, isEqual } from 'lodash';
import classNames from 'classnames';
import rpt from 'prop-types';

import { IconButton, LiLoadMore, Ul, Li } from '@instana/components';
import { generateStableHash } from '@instana/utils';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

//TODO delete detailViewProps after migrating this to TS since PropTypes won't be needed anymore
import { detailViewProps } from 'in-components/AnalyzeView/UngroupedView/detailViewProps';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import { leftArrowId, rightArrowId } from 'in-components/AnalyzeView/SplitScreenList/elementIds';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import { childrenArgsAsPropTypes } from 'in-components/AnalyzeView/StateManagement';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import NoDataAvailable from 'in-components/Errors/NoDataAvailable';
import ResultHeader from 'in-components/AnalyzeView/ResultHeader';
import Tooltip from 'in-components/Tooltip';
import { minutes } from 'in-services/time';
import Sticky from 'in-components/Sticky';
import { t } from 'in-i18n';

import locals from './SplitScreenList.mless';

export default function SplitScreenList(props) {
  const [expanded, setExpanded] = useExpanded();

  function handleExpansionWithTracking(event) {
    setExpanded(event);
    props.tracker?.trackCollapseOrExpandTraceDetailSidebar?.();
  }

  return (
    <div className={locals.wrapper}>
      {!expanded && <CollapsedList setExpanded={handleExpansionWithTracking} />}
      {expanded && <ExpandedList setExpanded={handleExpansionWithTracking} {...props} />}

      <div
        className={classNames({
          [locals.details]: true,
          [locals.useFullWidth]: !expanded
        })}
      >
        {props.children}
      </div>
    </div>
  );
}

SplitScreenList.propTypes = {
  ...childrenArgsAsPropTypes,
  ...detailViewProps,
  ListItemContent: rpt.elementType.isRequired,
  children: rpt.node.isRequired
};

function ExpandedList(props) {
  const {
    ListItemContent,
    hasErrors,
    result,
    hasItems,
    items,
    getId,
    canLoadMore,
    getHrefToDetailId,
    isLoading,
    loadMore,
    setExpanded,
    detailId,
    setDetailId,
    getDetailData,
    onOpenItem
  } = props;

  const itemIndex = findIndex(items, item => isEqual(getId(item), detailId));
  const hasNext = itemIndex + 1 < items.length;
  const hasPrev = itemIndex > 0;

  return (
    <div className={locals.expanded}>
      <Sticky
        header={
          <div className={locals.header}>
            <ResultHeader label="" {...props} />

            <div className={locals.actions}>
              {hasPrev && (
                <Tooltip content={t('in-components:analyze.splitScreen.sidebarActions.prev')}>
                  <IconButton
                    color={themes.default.ids.color.option.neutral[700]}
                    kind="action"
                    type="lib_arrow_drop_left"
                    aria-label={t('in-components:analyze.splitScreen.sidebarActions.prev')}
                    id={leftArrowId}
                    onClick={e =>
                      openItem(
                        e,
                        itemIndex - 1,
                        items,
                        canLoadMore,
                        loadMore,
                        isLoading,
                        setDetailId,
                        getId,
                        getDetailData,
                        onOpenItem
                      )
                    }
                  />
                </Tooltip>
              )}

              {hasNext && (
                <Tooltip content={t('in-components:analyze.splitScreen.sidebarActions.next')}>
                  <IconButton
                    color={themes.default.ids.color.option.neutral[700]}
                    kind="action"
                    type="lib_arrow_drop_right"
                    aria-label={t('in-components:analyze.splitScreen.sidebarActions.next')}
                    id={rightArrowId}
                    onClick={e =>
                      openItem(
                        e,
                        itemIndex + 1,
                        items,
                        canLoadMore,
                        loadMore,
                        isLoading,
                        setDetailId,
                        getId,
                        getDetailData,
                        onOpenItem
                      )
                    }
                  />
                </Tooltip>
              )}

              <Tooltip content={t('in-components:analyzeView.splitScreenListTooltipCloseSidebar')}>
                <IconButton
                  color={themes.default.ids.color.option.neutral[700]}
                  kind="action"
                  type="lib_sidebar_to_left"
                  aria-label={t('in-components:analyzeView.splitScreenListTooltipCloseSidebar')}
                  onClick={() => setExpanded(false)}
                />
              </Tooltip>
            </div>
          </div>
        }
        useFixedLayout
        contentWidth={'20rem'}
      >
        <HeightRestrictedView
          render={() => (
            <>
              {hasErrors && <ErrorList errors={result?.errors} />}
              {hasItems && (
                <Ul space="disabled">
                  {items.map((item, i) => {
                    const id = getId(item);
                    return (
                      <Li
                        key={`${generateStableHash(id)}${i}`}
                        size="normal"
                        active={isEqual(id, detailId)}
                        href={getHrefToDetailId(id)}
                        onDefaultHrefInteractionSideEffect={() => onOpenItem?.(item)}
                      >
                        <ListItemContent {...item} {...props} />
                      </Li>
                    );
                  })}
                  {canLoadMore && <LiLoadMore loadMore={loadMore} />}
                </Ul>
              )}
              {isLoading && <LoadingList numSkeletonRows={3} />}
              {!isLoading && !hasItems && <NoDataAvailable height={240} />}
            </>
          )}
        />
      </Sticky>
    </div>
  );
}

function CollapsedList({ setExpanded }) {
  return (
    <div className={locals.collapsed}>
      <div className={locals.collapsedToggleWrapper}>
        <Tooltip content={t('in-components:analyzeView.splitScreenListTooltipOpenSidebar')} align={'rightMiddle'}>
          <IconButton
            color={themes.default.ids.color.option.neutral[700]}
            kind="action"
            type="lib_sidebar_to_right"
            aria-label={t('in-components:analyzeView.splitScreenListTooltipOpenSidebar')}
            onClick={() => setExpanded(true)}
          />
        </Tooltip>
      </div>
    </div>
  );
}

function openItem(
  e,
  itemIndex,
  items,
  canLoadMore,
  loadMore,
  isLoading,
  setDetailId,
  getId,
  getDetailData,
  onOpenItem
) {
  if (itemIndex + 10 >= items.length && canLoadMore && !isLoading) {
    loadMore();
  }

  const item = items[itemIndex];
  if (!item) {
    return;
  }

  if (e.target.id) {
    document.getElementById(e.target.id).focus();
  }

  const nextItem = items[itemIndex + 1];
  if (nextItem) {
    prefetch(getDetailData(getId(nextItem)));
  }
  setDetailId(getId(item));
  onOpenItem?.(item);
}

function useExpanded() {
  const screenWidth = useObservable(
    debouncedResize$
      .startWith(true)
      .map(() => window.innerWidth)
      .distinct(),
    []
  );
  const [expanded, setExpanded] = useState(getInitialExpandedState(screenWidth));
  useLayoutEffect(() => setExpanded(getInitialExpandedState(screenWidth)), [screenWidth]);
  useLayoutEffect(refreshWindowSizeDependingState, [expanded]);

  return [expanded, setExpanded];
}

function getInitialExpandedState(screenWidth) {
  return screenWidth >= 1680;
}

function prefetch(observable) {
  const subscription = observable.subscribe(() => {});
  setTimeout(() => subscription.dispose(), minutes.toMillis(10));
}
