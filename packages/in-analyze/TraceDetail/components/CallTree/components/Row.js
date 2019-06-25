import { withState, pure, compose } from 'recompose';
import React from 'react';

import ChildrenDistributionTimeLine from 'in-analyze/TraceDetail/components/CallTree/components/ChildrenDistributionTimeLine';
import ServiceEndpointInformation from 'in-analyze/TraceDetail/components/CallTree/components/ServiceEndpointInformation';
import { isFakeRootCall, isUnknownTypeSpan, isInternalCall } from 'in-analyze/TraceDetail/shared/CallHelper';
import ErrorIndicator from 'in-analyze/TraceDetail/components/ErrorIndicator';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-new-components/Pill';
import connect from 'in-hoc/connectTo';

import locals from './Row.mless';

const marginPerDepth = 27;

const EnhancedRow = compose(
  pure,
  withState('isExpanded', 'setIsExpanded', true),
  connect(({ selectedCall$, call, openedCall$ }) => ({
    isSelected: selectedCall$.map(selectedCall => selectedCall && call.id === selectedCall.id).distinct(),
    isOpened: openedCall$.map(openedCall => openedCall && call.id === openedCall).distinct()
  }))
)(Row);

function Row(props) {
  const {
    call,
    nonInternalParentCall,
    getColor,
    isExpanded,
    scale,
    depth = 0,
    onCallClicked,
    onSubCallClicked,
    setIsExpanded,
    selectedCall$,
    isSelected,
    openedCall$,
    isOpened,
    isLargeTrace
  } = props;

  const hasChildren = call.children && call.children.length > 0;
  const marginLeft = Math.max(0, depth - 1) * marginPerDepth;
  const lineWidth = getLineWidth(depth, hasChildren);

  return (
    <div className={locals.wrapper}>
      <VerticalLine {...props} marginLeft={marginLeft} />
      <div
        id={`call-${call.id}`}
        className={evaluateClassNames({
          [locals.rootRow]: depth === 0,
          [locals.row]: true,
          [locals.selectedRow]: isSelected,
          [locals.openedRow]: isOpened,
          // hasErrors is for the background color of a row. If the row is isOpened and contains errors, the background color will be red.
          [locals.hasErrors]: call.errorCount > 0 && isOpened
        })}
      >
        <CallInformation
          {...props}
          marginLeft={marginLeft}
          lineWidth={lineWidth}
          hasChildren={hasChildren}
          onCallClicked={isFakeRootCall(call) ? null : onCallClicked}
          onSubCallClicked={call => {
            setIsExpanded(true);
            onSubCallClicked(call);
          }}
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
          .filter(subCall => subCall.model !== 'LOG')
          .map((subCall, i) => (
            <EnhancedRow
              key={subCall.id}
              scale={scale}
              getColor={getColor}
              call={subCall}
              nonInternalParentCall={isInternalCall(call) ? nonInternalParentCall : call}
              isLargeTrace={isLargeTrace}
              depth={depth + 1}
              intermediateRow={i !== call.children.filter(subCall => subCall.model !== 'LOG').length - 1}
              onCallClicked={onCallClicked}
              onSubCallClicked={onSubCallClicked}
              selectedCall$={selectedCall$}
              openedCall$={openedCall$}
            />
          ))}
    </div>
  );
}

function CallInformation(props) {
  const {
    call,
    getColor,
    scale,
    marginLeft,
    hasChildren,
    isExpanded,
    lineWidth,
    setIsExpanded,
    onCallClicked,
    onSubCallClicked,
    isLargeTrace,
    isOpened
  } = props;

  return (
    <div className={locals.detailGroup}>
      <div className={locals.left}>
        <HorizontalLine {...props} marginLeft={marginLeft} lineWidth={lineWidth} />
        {hasChildren && (
          <SvgIcon
            className={locals.expandIcon}
            type={isExpanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
            aria-label="Expand button for row"
            tabIndex={0}
            width={24}
            height={24}
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}
        <ErrorIndicator erroneous={call.errorCount} />
        <Tooltip themeStyle="light" content={call.label}>
          <span
            className={evaluateClassNames({
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
        {!isUnknownTypeSpan(call) &&
          call.endpoint && (
            <Pill kind="light" color={getEndpointColor(call.endpoint.type)}>
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
      className={evaluateClassNames({
        [locals.intermediateLine]: intermediateRow,
        [locals.lineEnd]: !intermediateRow
      })}
    />
  );
}

export default EnhancedRow;
