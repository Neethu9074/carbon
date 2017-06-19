import rpt from 'prop-types';
import React from 'react';

import EntityColumnContent from 'in-views/traceView/components/EntityColumnContent';
import { scrollIntoViewIfNeeded } from 'in-services/util/dom';
import { getServiceSideForOverview } from 'in-sdk/tracing';
import keyCodes from 'in-components/keyCodes';
import Tooltip from 'in-components/Tooltip';
import SvgIcon from 'in-components/SvgIcon';

import './TraceTableRow.less';

const allowedKeyCodesForKeydown = [keyCodes.arrows.up, keyCodes.arrows.down, keyCodes.space];
const block = 'in-trace-table-row';
const cellClassName = block + '__cell';

export default function TraceTableRow({ selectedTraceId, markedTraces, trace, onRowClicked }) {
  let classes = block;
  const isSelected = selectedTraceId === trace.id;
  const isMarked = markedTraces && markedTraces.has(trace.id);
  if (isSelected) {
    classes += ' ' + block + '--selected';
  }
  if (isMarked) {
    classes += ' ' + block + '--marked';
  }

  const side = getServiceSideForOverview(trace.raw);
  const serviceSnapshotId = trace[`${side}ServiceId`];
  let domElement;

  const onKeyDown = e => {
    if (
      e.target === domElement &&
      !keyCodes.isModifierPressed(e) &&
      allowedKeyCodesForKeydown.indexOf(e.keyCode) !== -1
    ) {
      e.stopPropagation();
      e.preventDefault();
    }

    if (e.keyCode === keyCodes.arrows.up) {
      moveActiveState(-1);
    } else if (e.keyCode === keyCodes.arrows.down) {
      moveActiveState(1);
    } else if (e.keyCode === keyCodes.space) {
      onRowClicked(e, trace);
    }
  };

  const moveActiveState = direction => {
    const elements = Array.prototype.slice.call(domElement.parentNode.childNodes);
    const newActiveElementIndex = Math.min(elements.length - 1, Math.max(0, elements.indexOf(domElement) + direction));
    elements[newActiveElementIndex].focus();
    scrollIntoViewIfNeeded(elements[newActiveElementIndex]);
  };

  const setDomRef = _domElement => {
    domElement = _domElement;
  };

  return (
    <div
      className={classes}
      tabIndex={10000}
      ref={setDomRef}
      onKeyDown={onKeyDown}
      onClick={e => onRowClicked(e, trace)}
    >
      <span className={cellClassName}>
        {trace.raw.get('errorCount') > 0
          ? <Tooltip content="Erroneous root span" align={'bottomLeft'}>
              <SvgIcon className={`${block}__error-icon`} type="error" height={12} color="#40535b" />
            </Tooltip>
          : null}
      </span>
      <span className={cellClassName}>
        {trace.start}
      </span>
      <span className={cellClassName}>
        {trace.name}
      </span>
      <span className={cellClassName}>
        {trace.duration}
      </span>
      <span className={cellClassName}>
        {trace.totalErrorCount}
      </span>
      <span className={cellClassName}>
        {serviceSnapshotId
          ? <EntityColumnContent
              serviceSnapshotId={serviceSnapshotId}
              time={trace.startMillis}
              getLabelCallback={label => getServiceLabelWithEndpoint(label, trace.raw.get('destinationEndpointLabel'))}
            />
          : null}
      </span>
    </div>
  );
}

TraceTableRow.propTypes = {
  onRowClicked: rpt.func.isRequired,
  trace: rpt.object.isRequired,
  selectedTraceId: rpt.string,
  markedTraces: rpt.object
};

function getServiceLabelWithEndpoint(serviceLabel, endpointLabel) {
  if (endpointLabel) {
    return `${serviceLabel} : ${endpointLabel}`;
  }
  return serviceLabel;
}
