/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon, Pill, IconButton } from '@instana/components';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';

import { ShowHiddenParentNestingLevelNode } from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/ShowHiddenParentNestingLevelNode';
import {
  isParenWithHiddenNestingLevel,
  isVisibleNestingLevel
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/callTrees';
import {
  isFakeRootCall,
  isUnknownTypeSpan,
  isInternalCall,
  isLog
} from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import ChildrenDistributionTimeLine from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/ChildrenDistributionTimeLine';
import ServiceEndpointInformation from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/ServiceEndpointInformation';
import {
  isCallNode,
  isLazyNode,
  isLazyParentNode
} from 'in-applications/analyze/components/TraceDetails/components/CallTree/lazyCallTree';
import { LazyLoadingCalls } from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/LazyLoadingCalls';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import CallTimeAxis from 'in-applications/analyze/components/TraceDetails/components/CallTimeAxis';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './Row.mless';

const marginPerDepth = 27;

export default function EnhancedRow({
  selectedCall$,
  call,
  openedCallId,
  openedCall$,
  getColor,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace,
  scale,
  depth = 0,
  nonInternalParentCall,
  intermediateRow,
  onParentAndSiblingCallsLoaded,
  onRelatedCallsLoaded,
  expandedCalls,
  onCallExpanded,
  onCallCollapsed,
  hasLazyOrHiddenParentNode,
  onShowHiddenParentNestingLevel,
  onShowHiddenChildNestingLevel
}) {
  const isSelected = useObservable(
    isCallNode(call) && selectedCall$.map(selectedCall => selectedCall && call.id === selectedCall.id).distinct(),
    [call, selectedCall$]
  );

  const isOpenedObservable = useObservable(
    isCallNode(call) && openedCall$?.map(openedCallValue => openedCallValue && call.id === openedCallValue).distinct(),
    [call, openedCall$]
  );

  const isOpened = isCallNode(call) && openedCallId != null ? call.id === openedCallId : isOpenedObservable;

  return (
    <Row
      isSelected={isSelected}
      isOpened={isOpened}
      call={call}
      getColor={getColor}
      onCallClicked={onCallClicked}
      onSubCallClicked={onSubCallClicked}
      isLargeTrace={isLargeTrace}
      scale={scale}
      depth={depth}
      selectedCall$={selectedCall$}
      nonInternalParentCall={nonInternalParentCall}
      intermediateRow={intermediateRow}
      openedCallId={openedCallId}
      openedCall$={openedCall$}
      onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
      onRelatedCallsLoaded={onRelatedCallsLoaded}
      expandedCalls={expandedCalls}
      onCallExpanded={onCallExpanded}
      onCallCollapsed={onCallCollapsed}
      hasLazyOrHiddenParentNode={hasLazyOrHiddenParentNode}
      onShowHiddenParentNestingLevel={onShowHiddenParentNestingLevel}
      onShowHiddenChildNestingLevel={onShowHiddenChildNestingLevel}
    />
  );
}

function Row({
  isSelected,
  isOpened,
  call,
  nonInternalParentCall,
  getColor,
  depth,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace,
  scale,
  intermediateRow,
  selectedCall$,
  openedCallId,
  openedCall$,
  onParentAndSiblingCallsLoaded,
  onRelatedCallsLoaded,
  expandedCalls,
  onCallExpanded,
  onCallCollapsed,
  hasLazyOrHiddenParentNode,
  onShowHiddenParentNestingLevel,
  onShowHiddenChildNestingLevel
}) {
  const hasChildren = isCallNode(call) && call.children && call.children.filter(child => !isLog(child)).length > 0;
  const marginLeft = Math.max(0, depth - 1) * marginPerDepth;
  const lineWidth = getLineWidth(depth, hasChildren);

  const isChildNestingLevelVisible = isVisibleNestingLevel(depth + 1);
  const shouldRenderChildren =
    isChildNestingLevelVisible &&
    (expandedCalls.has(call.id) || isParenWithHiddenNestingLevel(call) || isLazyNode(call));
  return (
    <div className={locals.wrapper}>
      {hasLazyOrHiddenParentNode && (
        <div className={locals.axisWrapper}>
          <div className={locals.horizontalAxis}>{<CallTimeAxis call={call} />}</div>
        </div>
      )}
      <VerticalLine
        depth={depth}
        marginLeft={marginLeft}
        intermediateRow={intermediateRow}
        hasLazyOrHiddenParentNode={hasLazyOrHiddenParentNode}
      />
      {isParenWithHiddenNestingLevel(call) || isLazyNode(call) ? (
        <div
          className={classNames({
            [locals.rootRow]: depth === 0,
            [locals.row]: true
          })}
        >
          <div
            className={classNames({
              [locals.detailGroup]: true,
              [locals.detailGroupWithLazyNode]: true
            })}
          >
            <HorizontalLine
              depth={depth}
              marginLeft={marginLeft}
              lineWidth={lineWidth}
              isLazyNode
              isOrphan={call.isOrphan}
            />
            {isParenWithHiddenNestingLevel(call) ? (
              <ShowHiddenParentNestingLevelNode onShowHiddenParentNestingLevel={onShowHiddenParentNestingLevel} />
            ) : (
              <LazyLoadingCalls
                lazyNode={call}
                onRelatedCallsLoaded={onRelatedCallsLoaded}
                onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
              />
            )}
          </div>
        </div>
      ) : (
        <div
          id={`call-${call.id}`}
          className={classNames({
            [locals.rootRow]: depth === 0,
            [locals.row]: true,
            [locals.selectedRow]: isSelected,
            [locals.openedRow]: isOpened,
            [locals.erroneousCall]: call.errorCount > 0
          })}
        >
          <CallInformation
            call={call}
            marginLeft={marginLeft}
            lineWidth={lineWidth}
            hasChildren={hasChildren}
            onCallClicked={isFakeRootCall(call) ? null : onCallClicked}
            onSubCallClicked={subCall => {
              onCallExpanded(call.id);
              onSubCallClicked(subCall);
              if (!isChildNestingLevelVisible) {
                onShowHiddenChildNestingLevel(call.id);
              }
            }}
            isLargeTrace={isLargeTrace}
            isOpened={isOpened}
            getColor={getColor}
            scale={scale}
            depth={depth}
            expandedCalls={expandedCalls}
            onCallExpanded={onCallExpanded}
            onCallCollapsed={onCallCollapsed}
            isLazyNode={isLazyNode(call)}
            onShowHiddenChildNestingLevel={onShowHiddenChildNestingLevel}
          />

          {!isLargeTrace && (
            <ServiceEndpointInformation
              marginLeft={marginLeft + lineWidth + (hasChildren ? marginPerDepth : 0)}
              call={call}
              nonInternalParentCall={nonInternalParentCall}
              onCallClicked={onCallClicked}
              getColor={getColor}
            />
          )}
        </div>
      )}

      {shouldRenderChildren &&
        call.children
          .filter(child => !isLog(child))
          .map((subCall, i) => (
            <EnhancedRow
              key={subCall.id}
              call={subCall}
              nonInternalParentCall={isCallNode(call) && isInternalCall(call) ? nonInternalParentCall : call}
              depth={depth + 1}
              intermediateRow={i !== call.children.filter(subCall => subCall.model !== 'LOG').length - 1}
              scale={scale}
              getColor={getColor}
              selectedCall$={selectedCall$}
              openedCallId={openedCallId}
              onCallClicked={onCallClicked}
              onSubCallClicked={onSubCallClicked}
              openedCall$={openedCall$}
              isLargeTrace={isLargeTrace}
              onParentAndSiblingCallsLoaded={onParentAndSiblingCallsLoaded}
              onRelatedCallsLoaded={onRelatedCallsLoaded}
              expandedCalls={expandedCalls}
              onCallExpanded={onCallExpanded}
              onCallCollapsed={onCallCollapsed}
              hasLazyOrHiddenParentNode={isParenWithHiddenNestingLevel(call) || isLazyParentNode(call)}
              onShowHiddenChildNestingLevel={onShowHiddenChildNestingLevel}
            />
          ))}
    </div>
  );
}

function CallInformation(props) {
  const {
    call,
    marginLeft,
    hasChildren,
    lineWidth,
    onCallClicked,
    isLargeTrace,
    isOpened,
    onSubCallClicked,
    getColor,
    scale,
    depth,
    expandedCalls,
    onCallExpanded,
    onCallCollapsed,
    onShowHiddenChildNestingLevel
  } = props;

  const isChildNestingLevelVisible = isVisibleNestingLevel(depth + 1);
  const isExpanded = isChildNestingLevelVisible && expandedCalls.has(call.id);
  const onExpandChildren = () => {
    if (isExpanded) {
      onCallCollapsed(call.id);
    } else {
      onCallExpanded(call.id);
      if (!isChildNestingLevelVisible) {
        onShowHiddenChildNestingLevel(call.id);
      }
    }
  };

  return (
    <div className={locals.detailGroup}>
      <div
        className={classNames({
          [locals.left]: !isLargeTrace,
          [locals.leftLargeTrace]: isLargeTrace
        })}
      >
        <HorizontalLine depth={depth} marginLeft={marginLeft} lineWidth={lineWidth} isOrphan={call.isOrphan} />
        {hasChildren && (
          <IconButton
            kind="primary"
            className={locals.expandIcon}
            type={isExpanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
            aria-label={t('in-analyze:traceDetail.components.callTree.expandButtonForRow')}
            tabIndex={0}
            onClick={onExpandChildren}
          />
        )}
        <ErrorIndicator erroneous={call.errorCount} />
        <Tooltip themeStyle="light" content={shorten(call.label)}>
          <div className={locals.callLabelWrapper}>
            <span
              className={classNames({
                [locals.label]: true,
                [locals.labelSelected]: isOpened,
                [locals.clickable]: onCallClicked != null
              })}
              onClick={onCallClicked ? () => onCallClicked(call) : () => {}}
            >
              {call.label || 'Undefined'}
            </span>
          </div>
        </Tooltip>
        {call.batchSize > 1 && (
          <Tooltip
            themeStyle="light"
            content={`This call is batched and represents ${call.batchSize} individual calls.`}
          >
            <div>
              <Pill className={locals.batchSizeIndicator} kind="lighter">
                {call.batchSize}
              </Pill>
            </div>
          </Tooltip>
        )}
        {!isUnknownTypeSpan(call) && call.endpoint && (
          <Pill kind="light" color={getEndpointColor(call.endpoint.type)} className={locals.pillFixer}>
            {call.endpoint.type}
          </Pill>
        )}
        {!isLargeTrace && <div className={locals.dashedLine} />}
      </div>

      {!isLargeTrace && (
        <ChildrenDistributionTimeLine
          call={call}
          getColor={getColor}
          scale={scale}
          onCallClicked={onCallClicked}
          onSubCallClicked={onSubCallClicked}
        />
      )}
    </div>
  );
}

function getLineWidth(depth, hasChildren) {
  if (depth === 0) {
    return 0;
  }
  if (hasChildren) {
    return marginPerDepth;
  }
  return marginPerDepth * 2;
}

function HorizontalLine({ marginLeft, lineWidth, depth = 0, isLazyNode, isOrphan }) {
  if (depth === 0) {
    return null;
  }

  const lineRightMargin = 4;
  const lineLeftMargin = 8;
  return (
    <div
      style={{
        marginLeft: marginLeft + lineLeftMargin,
        minWidth: lineWidth - lineRightMargin - lineLeftMargin
      }}
      className={classNames({
        [locals.leftLine]: true,
        [locals.horizontalWithLazyNode]: isLazyNode
      })}
    >
      {isOrphan && (
        <Tooltip content={t('in-analyze:traceDetail.components.callTree.orphan')} align={'topMiddle'}>
          <div className={locals.orphan}>
            <SvgIcon
              type={'lib_help_error_help_circle'}
              color={themes.default.ids.color.option.neutral['600']}
              size="xs"
            />
          </div>
        </Tooltip>
      )}
    </div>
  );
}

function VerticalLine({ depth = 0, intermediateRow = true, marginLeft, hasLazyOrHiddenParentNode }) {
  if (depth === 0) {
    return null;
  }

  if (depth === 1) {
    return (
      <div
        style={{ left: marginLeft }}
        className={classNames({
          [locals.firstLine]: true,
          [locals.intermediateLine2]: intermediateRow,
          [locals.lineEnd]: !intermediateRow,
          [locals.nodeTypeParent]: hasLazyOrHiddenParentNode
        })}
      />
    );
  }

  return (
    <div
      style={{ left: marginLeft }}
      className={classNames({
        [locals.intermediateLine2]: intermediateRow,
        [locals.lineEnd]: !intermediateRow,
        [locals.nodeTypeParent]: hasLazyOrHiddenParentNode
      })}
    />
  );
}
