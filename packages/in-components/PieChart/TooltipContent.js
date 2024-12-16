/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { Spacer } from '@instana/components';

import { getLastValueTooltipLabel } from 'in-custom-dashboards/widgets/_shared/lastTimeConfig';
import AggregationSymbol from 'in-components/AggregationSymbol';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { percentage } from 'in-services/formatters/number';

import locals from './TooltipContent.mless';

export default function TooltipContent({ slice, formatter, timeConfig, displayLabel = false }) {
  return (
    <div className={locals.wrapper}>
      {displayLabel && (
        <>
          <span className={locals.dot} style={{ background: slice.color }} />
          <span className={locals.label}>{slice.label}</span>
        </>
      )}

      {slice.timeShift.offset !== 0 && (
        <span className={locals.timeShift}>{`(${getTimeShiftLabel(slice.timeShift)})`}</span>
      )}
      <Spacer horizontal="small" />
      {slice.aggregation && <AggregationSymbol aggregation={slice.aggregation} />}
      <Spacer horizontal="xxsmall" />
      <strong>{formatter(slice.value)}</strong>
      <span className={locals.percentage}> {`(${percentage.detailed(slice.percentage)})`}</span>
      {slice.lastValue && (
        <span className={locals.adjustedWindowSize}>{`- ${getLastValueTooltipLabel(timeConfig)}`}</span>
      )}
    </div>
  );
}

TooltipContent.propTypes = {
  slice: rpt.object.isRequired,
  formatter: rpt.func.isRequired,
  timeConfig: rpt.object.isRequired,
  displayLabel: rpt.bool
};
