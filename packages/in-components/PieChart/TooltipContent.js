/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import rpt from 'prop-types';
import React from 'react';

import { Spacer, SpacerSizes } from '@instana/components';

import AggregationSymbol from 'in-components/AggregationSymbol';
import { getTimeShiftLabel } from 'in-stores/time/shifting';
import { percentage } from 'in-services/formatters/number';

import locals from './TooltipContent.mless';

export default function TooltipContent({ slice, formatter }) {
  return (
    <div className={locals.wrapper}>
      <span className={locals.dot} style={{ background: slice.color }} />
      <span className={locals.label}>{slice.label}</span>
      {slice.timeShift.offset !== 0 && (
        <span className={locals.timeShift}>{`(${getTimeShiftLabel(slice.timeShift)})`}</span>
      )}
      <Spacer horizontal={SpacerSizes.small} />
      {slice.aggregation && <AggregationSymbol aggregation={slice.aggregation} />}
      <Spacer horizontal={SpacerSizes.xxsmall} />
      <strong>{formatter(slice.value)}</strong>
      <span className={locals.percentage}> {`(${percentage.detailed(slice.percentage)})`}</span>
    </div>
  );
}

TooltipContent.propTypes = {
  slice: rpt.object.isRequired,
  formatter: rpt.func.isRequired
};
