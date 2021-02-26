/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState, useLayoutEffect } from 'react';
import { findIndex, isEqual } from 'lodash';
import classNames from 'classnames';
import rpt from 'prop-types';
import { t } from 'in-i18n';

import { leftArrowId, rightArrowId } from 'in-new-components/AnalyzeView/SplitScreenList/elementIds';
import HeightRestrictedView from 'in-components/layout/HeightRestrictedView/HeightRestrictedView';
import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import { childrenArgsAsPropTypes } from 'in-new-components/AnalyzeView/StateManagement';
import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import { detailViewProps } from 'in-new-components/AnalyzeView/UngroupedView';
import LoadMoreLi from 'in-new-components/lists/List/LoadMoreLi/LoadMoreLi';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import ResultHeader from 'in-new-components/AnalyzeView/ResultHeader';
import { prefetch } from 'in-subscription/util/prefetch';
import { generateStableHash } from 'in-services/util/id';
import { Ul, Li } from 'in-new-components/lists/List';
import useObservable from 'in-hooks/useObservable';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';

import locals from './SplitScreenList.mless';

export default function SplitScreenList(props) {
  const [expanded, setExpanded] = useExpanded();

  return (
    <div className={locals.wrapper}>
      {!expanded && <CollapsedList setExpanded={setExpanded} />}
      {expanded && <ExpandedList setExpanded={setExpanded} {...props} />}

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
    itemName,
    setExpanded,
    detailId,
    setDetailId,
    getDetailData
  } = props;

  const itemIndex = findIndex(items, item => isEqual(getId(item), detailId));
  const hasNext = itemIndex + 1 < items.length;
  const hasPrev = itemIndex > 0;

  return (
    <div className={locals.expanded}>
      <Sticky
        header={
          <div className={locals.header}>
            <ResultHeader label="" {...props} withSamplingTooltip />

            <div className={locals.actions}>
              {hasPrev && (
                <Tooltip
                  content={t('in-new-components:analyze.splitScreen.sidebarActions.prev', {
                    itemName: t(itemName).toLowerCase()
                  })}
                >
                  <SvgIcon
                    className={locals.prev}
                    type="lib_arrow_drop_left"
                    aria-label={t('in-new-components:analyze.splitScreen.sidebarActions.prev', {
                      itemName: t(itemName).toLowerCase()
                    })}
                    size="s"
                    id={leftArrowId}
                    onClick={() =>
                      openItem(
                        itemIndex - 1,
                        items,
                        canLoadMore,
                        loadMore,
                        isLoading,
                        setDetailId,
                        getId,
                        getDetailData
                      )
                    }
                  />
                </Tooltip>
              )}

              {hasNext && (
                <Tooltip
                  content={t('in-new-components:analyze.splitScreen.sidebarActions.next', {
                    itemName: t(itemName).toLowerCase()
                  })}
                >
                  <SvgIcon
                    className={locals.next}
                    type="lib_arrow_drop_right"
                    aria-label={t('in-new-components:analyze.splitScreen.sidebarActions.next', {
                      itemName: t(itemName).toLowerCase()
                    })}
                    size="s"
                    id={rightArrowId}
                    onClick={() =>
                      openItem(
                        itemIndex + 1,
                        items,
                        canLoadMore,
                        loadMore,
                        isLoading,
                        setDetailId,
                        getId,
                        getDetailData
                      )
                    }
                  />
                </Tooltip>
              )}

              <Tooltip content={t('in-new-components:analyzeView.splitScreenListTooltipCloseSidebar')}>
                <SvgIcon
                  type="lib_sidebar_to_left"
                  aria-label={t('in-new-components:analyzeView.splitScreenListTooltipCloseSidebar')}
                  size="s"
                  className={locals.toggle}
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
              {hasErrors && <ErrorList errors={result.errors} />}
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
                      >
                        <ListItemContent {...item} {...props} />
                      </Li>
                    );
                  })}
                  {canLoadMore && <LoadMoreLi loadMore={loadMore} />}
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
        <Tooltip content={t('in-new-components:analyzeView.splitScreenListTooltipOpenSidebar')}>
          <SvgIcon
            type="lib_sidebar_to_right"
            aria-label={t('in-new-components:analyzeView.splitScreenListTooltipOpenSidebar')}
            size="s"
            className={locals.toggle}
            onClick={() => setExpanded(true)}
          />
        </Tooltip>
      </div>
    </div>
  );
}

function openItem(itemIndex, items, canLoadMore, loadMore, isLoading, setDetailId, getId, getDetailData) {
  if (itemIndex + 10 >= items.length && canLoadMore && !isLoading) {
    loadMore();
  }

  const item = items[itemIndex];
  if (!item) {
    return;
  }

  const nextItem = items[itemIndex + 1];
  if (nextItem) {
    prefetch(getDetailData(getId(nextItem)));
  }
  setDetailId(getId(item));
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
