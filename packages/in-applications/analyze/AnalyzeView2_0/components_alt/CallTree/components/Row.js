/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import classNames from 'classnames';
import React from 'react';

import { SvgIcon } from '@instana/components';

import {
  isFakeRootCall,
  isUnknownTypeSpan,
  isInternalCall,
  isLog
} from 'in-applications/analyze/components/TraceDetails/components/callHelper';
import ChildrenDistributionTimeLine from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/components/ChildrenDistributionTimeLine';
import ServiceEndpointInformation from 'in-applications/analyze/AnalyzeView2_0/components_alt/CallTree/components/ServiceEndpointInformation';
import ErrorIndicator from 'in-applications/analyze/components/TraceDetails/components/ErrorIndicator';
import { getColor as getEndpointColor } from 'in-applications/endpointTypes';
import { shorten } from 'in-services/util/string';
import Tooltip from 'in-components/Tooltip';
import Pill from 'in-components/Pill';
import { t } from 'in-i18n';

import locals from './Row.mless';

const marginPerDepth = 24;

export default function Row(props) {
  const {
    showServiceInformation,
    nonInternalParentCall,
    expandedCallIds,
    onCallClicked,
    isLargeTrace,
    openedCallId,
    getColor,
    call,
    depth = 0
  } = props;

  const isExpanded = expandedCallIds && expandedCallIds.has(props.call.id);
  const isHighlighted = call.id === openedCallId;
  const isClickable = !isFakeRootCall(call);

  const nonLogChildren = (call.children ?? []).filter(child => !isLog(child));
  const hasChildren = nonLogChildren.length > 0;

  const marginLeft = Math.max(0, depth - 1) * marginPerDepth;
  const lineWidth = getLineWidth(depth, hasChildren);

  return (
    <div className={locals.wrapper}>
      {depth > 0 && <VerticalLine {...props} marginLeft={marginLeft} small={!showServiceInformation} />}

      <div
        id={`call-${call.id}`}
        className={classNames({
          [locals.row]: true,
          [locals.highlighted]: isHighlighted,
          [locals.collapsedRow]: !showServiceInformation,
          [locals.clickable]: isClickable
        })}
        onClick={isClickable ? () => onCallClicked(isHighlighted ? null : call) : undefined}
      >
        <CallInformation
          {...props}
          isExpanded={isExpanded}
          marginLeft={marginLeft}
          lineWidth={lineWidth}
          hasChildren={hasChildren}
          isClickable={isClickable}
          isHighlighted={isHighlighted}
        />

        {!isLargeTrace && showServiceInformation && (
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
        nonLogChildren.map((subCall, i) => (
          <Row
            key={subCall.id}
            {...props}
            call={subCall}
            nonInternalParentCall={isInternalCall(call) ? nonInternalParentCall : call}
            depth={depth + 1}
            intermediateRow={i !== call.children.filter(subCall => subCall.model !== 'LOG').length - 1}
          />
        ))}
    </div>
  );
}

function CallInformation(props) {
  const { depth, call, marginLeft, hasChildren, isExpanded, expandCall, collapseCall, lineWidth, isLargeTrace } = props;

  return (
    <div className={locals.detailGroup}>
      <div
        className={classNames({
          [locals.left]: !isLargeTrace,
          [locals.leftLargeTrace]: isLargeTrace
        })}
      >
        {depth > 0 && <HorizontalLine {...props} marginLeft={marginLeft} lineWidth={lineWidth} />}

        {hasChildren && (
          <SvgIcon
            className={locals.expandIcon}
            type={isExpanded ? 'lib_openclose_remove_box' : 'lib_openclose_add_box'}
            aria-label={t('in-analyze:traceDetail.components.callTree.expandButtonForRow')}
            tabIndex={0}
            onClick={() => (isExpanded ? collapseCall(call) : expandCall(call))}
          />
        )}

        <ErrorIndicator erroneous={call.errorCount} small />

        <Tooltip themeStyle="light" content={shorten(call.label)}>
          <span className={locals.label}>{call.label || 'Undefined'}</span>
        </Tooltip>

        {call.batchSize > 1 && (
          <Tooltip
            themeStyle="light"
            contet={t('in-analyze:traceDetail.components.callDetails.thisCallIsBatchedAndRepresentsIndividualCalls', {
              batchSize: call.batchSize
            })}
          >
            <Pill className={locals.batchSizeIndicator} kind="lighter">
              {call.batchSize}
            </Pill>
          </Tooltip>
        )}

        {!isUnknownTypeSpan(call) && call.endpoint && (
          <Pill kind="light" color={getEndpointColor(call.endpoint.type)}>
            {call.endpoint.type}
          </Pill>
        )}
      </div>

      {!isLargeTrace && <ChildrenDistributionTimeLine {...props} />}
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

function HorizontalLine({ marginLeft, lineWidth }) {
  const lineRightMargin = 8;
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

function VerticalLine({ intermediateRow = true, marginLeft, small }) {
  return (
    <div
      style={{ left: marginLeft }}
      className={classNames({
        [locals.intermediateLine]: intermediateRow,
        [locals.lineEnd]: !intermediateRow,
        [locals.lineSmall]: small && intermediateRow,
        [locals.lineSmallEnd]: small && !intermediateRow
      })}
    />
  );
}
