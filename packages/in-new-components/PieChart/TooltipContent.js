/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { aggregationLabels } from 'in-stores/metric/metric';
import { percentage } from 'in-services/formatters/number';

import locals from './TooltipContent.mless';

export default function TooltipContent({ slice, formatter }) {
  const notes = [];
  if (slice.timeShift.offset !== 0) {
    notes.push(getTimeShiftLabel(slice.timeShift).toLowerCase());
  }
  if (slice.aggregation) {
    notes.push(aggregationLabels[slice.aggregation]);
  }
  return (
    <div className={locals.tooltip}>
      <div>
        <span className={locals.toltipDot} style={{ background: slice.color }} />
        <span>{slice.label}</span>
        {notes.length > 0 && <span className={locals.secText}>({notes.join(', ')})</span>}
      </div>
      <div />
      <div>
        <strong>{formatter(slice.value)}</strong>
        <span className={locals.secText}>{`(${percentage.detailed(slice.percentage)})`}</span>
      </div>
    </div>
  );
}

TooltipContent.propTypes = {
  slice: rpt.object.isRequired,
  formatter: rpt.func.isRequired
};
