/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import {
  isFakeRootCall,
  isUnknownTypeSpan,
  isInternalCall,
  isLog
} from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import ChildrenDistributionTimeLine from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/ChildrenDistributionTimeLine';
import ServiceEndpointInformation from 'in-applications/analyze/components/TraceDetails/components/CallTree/components/ServiceEndpointInformation';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from './Row.mless';

const marginPerDepth = 27;

export default function EnhancedRow({
  selectedCall$,
  call,
  openedCallId,
  openedCall$,
  initialExpandedNodeIds,
  getColor,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace,
  scale,
  depth = 0,
  nonInternalParentCall,
  intermediateRow
}) {
  const [isExpanded, setIsExpanded] = useState(initialExpandedNodeIds.includes(call.id));
  const isSelected = useObservable(
    selectedCall$.map(selectedCall => selectedCall && call.id === selectedCall.id).distinct(),
    []
  );

  const isOpenedObservable = useObservable(
    openedCall$?.map(openedCallValue => openedCallValue && call.id === openedCallValue).distinct(),
    []
  );

  const isOpened = openedCallId != null ? call.id === openedCallId : isOpenedObservable;

  return (
    <Row
      isExpanded={isExpanded}
      setIsExpanded={setIsExpanded}
      isSelected={isSelected}
      isOpened={isOpened}
      initialExpandedNodeIds={initialExpandedNodeIds}
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
    />
  );
}

function Row({
  isSelected,
  isOpened,
  isExpanded,
  setIsExpanded,
  call,
  nonInternalParentCall,
  getColor,
  depth,
  onCallClicked,
  onSubCallClicked,
  isLargeTrace,
  initialExpandedNodeIds,
  scale,
  intermediateRow,
  selectedCall$,
  openedCallId
}) {
  const hasChildren = call.children && call.children.filter(child => !isLog(child)).length > 0;
  const marginLeft = Math.max(0, depth - 1) * marginPerDepth;
  const lineWidth = getLineWidth(depth, hasChildren);

  return (
    <div className={locals.wrapper}>
      <VerticalLine depth={depth} marginLeft={marginLeft} intermediateRow={intermediateRow} />
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
          onSubCallClicked={call => {
            setIsExpanded(true);
            onSubCallClicked(call);
          }}
          setIsExpanded={setIsExpanded}
          isExpanded={isExpanded}
          isLargeTrace={isLargeTrace}
          isOpened={isOpened}
          getColor={getColor}
          scale={scale}
          depth={depth}
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

      {isExpanded &&
        call.children
          .filter(child => !isLog(child))
          .map((subCall, i) => (
            <EnhancedRow
              key={subCall.id}
              call={subCall}
              nonInternalParentCall={isInternalCall(call) ? nonInternalParentCall : call}
              depth={depth + 1}
              intermediateRow={i !== call.children.filter(subCall => subCall.model !== 'LOG').length - 1}
              initialExpandedNodeIds={initialExpandedNodeIds}
              scale={scale}
              getColor={getColor}
              selectedCall$={selectedCall$}
              openedCallId={openedCallId}
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
    isExpanded,
    lineWidth,
    setIsExpanded,
    onCallClicked,
    isLargeTrace,
    isOpened,
    onSubCallClicked,
    getColor,
    scale,
    depth
  } = props;

  return (
    <div className={locals.detailGroup}>
      <div
        className={classNames({
          [locals.left]: !isLargeTrace,
          [locals.leftLargeTrace]: isLargeTrace
        })}
      >
        <HorizontalLine depth={depth} marginLeft={marginLeft} lineWidth={lineWidth} />
        {hasChildren && (
          <SvgIcon
            className={locals.expandIcon}
            type={isExpanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
            aria-label={t('in-analyze:traceDetail.components.callTree.expandButtonForRow')}
            tabIndex={0}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}
        <ErrorIndicator erroneous={call.errorCount} />
        <Tooltip themeStyle="light" content={shorten(call.label)}>
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
        </Tooltip>
        {call.batchSize > 1 && (
          <Tooltip
            themeStyle="light"
            content={`This call is batched and represents ${call.batchSize} individual calls.`}
          >
            <Pill className={locals.batchSizeIndicator} kind="lighter">
              {call.batchSize}
            </Pill>
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

function HorizontalLine({ marginLeft, lineWidth, depth = 0 }) {
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
      className={locals.leftLine}
    />
  );
}

function VerticalLine({ depth = 0, intermediateRow = true, marginLeft }) {
  if (depth === 0) {
    return null;
  }
  return (
    <div
      style={{ left: marginLeft }}
      className={classNames({
        [locals.intermediateLine]: intermediateRow,
        [locals.lineEnd]: !intermediateRow
      })}
    />
  );
}
