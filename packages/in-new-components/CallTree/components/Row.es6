import { withState } from 'recompose';
import React from 'react';

import ChildrenDistributionTimeLine from 'in-new-components/CallTree/components/ChildrenDistributionTimeLine';
import SpanEndpointInformation from 'in-new-components/CallTree/components/SpanEndpointInformation';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import Badge from 'in-new-components/Badge';
import SvgIcon from 'in-components/SvgIcon';

import locals from './Row.mless';

const marginPerDepth = 27;

const EnhancedRow = withState('isExpanded', 'setIsExpanded', false)(Row);
function Row(props) {
  const { span, getColor, isExpanded, depth = 0 } = props;

  const hasChildren = span.children && span.children.length > 0;
  const marginLeft = Math.max(0, depth - 1) * marginPerDepth;
  const lineWidth = getLineWidth(span, depth, hasChildren);

  return (
    <div className={locals.wrapper}>
      <VerticalLine {...props} marginLeft={marginLeft} />

      <div className={locals.row}>
        <CallInformation {...props} marginLeft={marginLeft} lineWidth={lineWidth} hasChildren={hasChildren} />

        <SpanEndpointInformation
          marginLeft={marginLeft + lineWidth + (hasChildren ? marginPerDepth : 0)}
          span={span}
          getColor={getColor}
        />
      </div>

      {isExpanded &&
        span.children.map((childSpan, i) => (
          <EnhancedRow
            key={i}
            {...props}
            span={childSpan}
            depth={depth + 1}
            intermediateRow={i !== span.children.length - 1}
          />
        ))}
    </div>
  );
}

function CallInformation(props) {
  const { span, getColor, scale, marginLeft, hasChildren, isExpanded, lineWidth, setIsExpanded } = props;

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
        <span className={locals.label}>{span.label}</span>
        {span.endpoint && <Badge color={getEndpointColor(span.endpoint.type)}>{span.endpoint.type}</Badge>}
        <div className={locals.dashedLine} />
      </div>

      <ChildrenDistributionTimeLine span={span} getColor={getColor} scale={scale} />
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
