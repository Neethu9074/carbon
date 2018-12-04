import { compose } from 'recompose';
import React from 'react';

import { debouncedResize$, refreshWindowSizeDependingState } from 'in-services/browser';
import SideEffectOnPropertyChange from 'in-components/SideEffectOnPropertyChange';
import withPropDependingState from 'in-hoc/withPropDependingState';
import { evaluateClassNames } from 'in-services/util/classnames';
import ResultHeader from 'in-analyze/components/ResultHeader';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';
import Sticky from 'in-components/Sticky';
import connectTo from 'in-hoc/connectTo';

import locals from './NavigatorSplitScreen.mless';

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

function NavigatorSplitScreen({
  navigator,
  typeLabel,
  totalHits,
  totalRepresentedItemCount,
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
  const hasNext = openItemIndex + 1 < items.length;
  const hasPrev = openItemIndex > 0;

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
                  withMaxWidth
                />

                <div className={locals.actions}>
                  {hasPrev && (
                    <Tooltip content={`View previous ${typeLabel.toLowerCase()} (shortcut: left arrow key)`}>
                      <SvgIcon
                        type="lib_arrow_drop_left"
                        aria-label={`View previous ${typeLabel.toLowerCase()} (shortcut: left arrow key)`}
                        width={20}
                        className={locals.prev}
                        id={leftArrowId}
                        onClick={e =>
                          openItem(e, openItemIndex - 1, items, canLoadMore, loadMore, progress, customOpenItem)
                        }
                      />
                    </Tooltip>
                  )}

                  {hasNext && (
                    <Tooltip content={`View next ${typeLabel.toLowerCase()} (shortcut: right arrow key)`}>
                      <SvgIcon
                        type="lib_arrow_drop_right"
                        aria-label={`View next ${typeLabel.toLowerCase()} (shortcut: right arrow key)`}
                        width={20}
                        className={locals.next}
                        id={rightArrowId}
                        onClick={e =>
                          openItem(e, openItemIndex + 1, items, canLoadMore, loadMore, progress, customOpenItem)
                        }
                      />
                    </Tooltip>
                  )}

                  <Tooltip content={expanded ? 'Close sidebar' : 'Open sidebar'}>
                    <SvgIcon
                      type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                      aria-label={expanded ? 'Close sidebar' : 'Open sidebar'}
                      width={20}
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
          <Sticky
            header={
              <div className={locals.toggleWrapper}>
                <Tooltip content={expanded ? 'Close sidebar' : 'Open sidebar'}>
                  <SvgIcon
                    type={expanded ? 'lib_sidebar_to_left' : 'lib_sidebar_to_right'}
                    aria-label={expanded ? 'Close sidebar' : 'Open sidebar'}
                    width={20}
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
        className={evaluateClassNames({
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
