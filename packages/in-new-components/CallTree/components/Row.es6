import { withState } from 'recompose';
import React from 'react';

import ChildrenDistributionTimeLine from 'in-new-components/CallTree/components/ChildrenDistributionTimeLine';
import SpanEndpointInformation from 'in-new-components/CallTree/components/SpanEndpointInformation';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { evaluateClassNames } from 'in-services/util/classnames';
import Badge from 'in-new-components/Badge';
import SvgIcon from 'in-components/SvgIcon';
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
  const { call, getColor, isExpanded, depth = 0, onCallClicked, setIsExpanded, selectedCall$, isSelected } = props;

  const hasChildren = call.children && call.children.length > 0;
  const marginLeft = Math.max(0, depth - 1) * marginPerDepth;
  const lineWidth = getLineWidth(call, depth, hasChildren);

  return (
    <div className={locals.wrapper}>
      <VerticalLine {...props} marginLeft={marginLeft} />

      <div
        className={evaluateClassNames({
          [locals.row]: true,
          [locals.selectedRow]: isSelected
        })}
      >
        <CallInformation
          {...props}
          marginLeft={marginLeft}
          lineWidth={lineWidth}
          hasChildren={hasChildren}
          onCallClicked={call => {
            setIsExpanded(true);
            onCallClicked(call);
          }}
        />

        <SpanEndpointInformation
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
            selectedCall$={selectedCall$}
          />
        ))}
    </div>
  );
}

function CallInformation(props) {
  const { call, getColor, scale, marginLeft, hasChildren, isExpanded, lineWidth, setIsExpanded, onCallClicked } = props;

  return (
    <div className={locals.detailGroup}>
      <div className={locals.left}>
        <HorizontalLine {...props} marginLeft={marginLeft} lineWidth={lineWidth} />
        {hasChildren && (
          <SvgIcon
            className={locals.expandIcon}
            type={isExpanded ? 'minus' : 'plus_without_frame'}
            aria-label="Expand button for row"
            tabIndex={0}
            width={12}
            height={12}
            color="#ffffff"
            onClick={() => setIsExpanded(!isExpanded)}
          />
        )}
        <span className={locals.label}>{call.label}</span>
        {call.endpoint && <Badge color={getEndpointColor(call.endpoint.type)}>{call.endpoint.type}</Badge>}
        <div className={locals.dashedLine} />
      </div>

      <ChildrenDistributionTimeLine call={call} getColor={getColor} scale={scale} onCallClicked={onCallClicked} />
    </div>
  );
}

function getLineWidth(span, depth, hasChildren) {
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
