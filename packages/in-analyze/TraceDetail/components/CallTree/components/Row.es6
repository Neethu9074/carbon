import { withState } from 'recompose';
import React from 'react';

import ChildrenDistributionTimeLine from 'in-analyze/TraceDetail/components/CallTree/components/ChildrenDistributionTimeLine';
import ServiceEndpointInformation from 'in-analyze/TraceDetail/components/CallTree/components/ServiceEndpointInformation';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { evaluateClassNames } from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Pill from 'in-new-components/Pill';
import connect from 'in-hoc/connectTo';

import locals from './Row.mless';

const marginPerDepth = 27;

const EnhancedRow = withState('isExpanded', 'setIsExpanded', true)(
  connect(
    props => ({
      isSelected: props.selectedCall$.map(selectedCall => selectedCall && props.call.id === selectedCall.id).distinct()
    }),
    Row
  )
);
function Row(props) {
  const {
    call,
    getColor,
    isExpanded,
    depth = 0,
    onCallClicked,
    onSubCallClicked,
    setIsExpanded,
    selectedCall$,
    isSelected
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
          [locals.selectedRow]: isSelected
        })}
      >
        <CallInformation
          {...props}
          marginLeft={marginLeft}
          lineWidth={lineWidth}
          hasChildren={hasChildren}
          onCallClicked={onCallClicked}
          onSubCallClicked={call => {
            setIsExpanded(true);
            onSubCallClicked(call);
          }}
        />

        <ServiceEndpointInformation
          marginLeft={marginLeft + lineWidth + (hasChildren ? marginPerDepth : 0)}
          call={call}
          getColor={getColor}
        />
      </div>

      {isExpanded &&
        call.children.map((subCall, i) => (
          <EnhancedRow
            key={i}
            {...props}
            call={subCall}
            depth={depth + 1}
            intermediateRow={i !== call.children.length - 1}
            onCallClicked={onCallClicked}
            onSubCallClicked={onSubCallClicked}
            selectedCall$={selectedCall$}
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
    onSubCallClicked
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
        <span className={locals.label} onClick={() => onCallClicked(call)}>
          {call.label}
        </span>
        {call.batchSize > 1 && (
          <Pill className={locals.batchSizeIndicator} kind="lighter">
            {call.batchSize}
          </Pill>
        )}
        {call.endpoint && (
          <Pill kind="light" color={getEndpointColor(call.endpoint.type)}>
            {call.endpoint.type}
          </Pill>
        )}
        <div className={locals.dashedLine} />
      </div>

      <ChildrenDistributionTimeLine
        call={call}
        getColor={getColor}
        scale={scale}
        onCallClicked={onCallClicked}
        onSubCallClicked={onSubCallClicked}
      />
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
  return <div style={{ left: marginLeft }} className={intermediateRow ? locals.intermediateLine : locals.lineEnd} />;
}

export default EnhancedRow;
