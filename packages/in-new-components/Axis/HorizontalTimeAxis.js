/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { Fragment } from 'react';

import { getAxisConfig } from 'in-new-components/Axis/timeFormatting';
import HorizontalAxis from 'in-new-components/Axis/HorizontalAxis';
import { getTickPositions } from 'in-services/ticks/horizontal';
import { formatDateShort } from 'in-services/formatters/date';
import createScale from 'in-services/scale';

import locals from 'in-new-components/Axis/components/Ticks.mless';

export default function HorizontalTimeAxis(props) {
  const { width = 300, scale } = props;
  const formattingConfig = getAxisConfig(scale.to - scale.from);

  function format(timestamp) {
    const time = formattingConfig
      .formatter(timestamp)
      .replace(/^\d\d\d\d-\d\d-\d\d/, '')
      .trim();
    return (
      <Fragment>
        {time && <div className={locals.horizontalTickFirstLabel}>{time}</div>}
        <span>{formatDateShort(timestamp)}</span>
      </Fragment>
    );
  }

  return (
    <HorizontalAxis
      {...props}
      fixedTickPositions={getAxisTickPositions(formattingConfig, width, scale)}
      formatter={{
        compact: format,
        detailed: format
      }}
    />
  );
}

export function getAxisTickPositions(formatting, width, scale) {
  const x = createScale();
  x.setDomainFrom(scale.from);
  x.setDomainTo(scale.to);
  x.setRangeFrom(0);
  x.setRangeTo(width);

  return getTickPositions({
    scale: x,
    axisConfig: formatting
  });
}
