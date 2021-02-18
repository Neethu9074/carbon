/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { t } from 'in-i18n';
import React from 'react';

import BasicWrapper from 'in-new-components/Errors/BasicWrapper';
import SvgIcon from 'in-components/SvgIcon';

import locals from './InfiniteCircle.mless';

export default function InfiniteCircle({ width, height, percentage, customText, className }) {
  const angle = !percentage ? 270 : 360 * percentage;

  return (
    <BasicWrapper
      className={className}
      width={width}
      height={height}
      text={customText || t('in-new-components:loading.labelLoadingData')}
      renderIcon={size => (
        <SvgIcon
          className={locals.icon}
          viewBox="0 0 24 24"
          iconPath={describeArc(12, 12, 8, 2, 0, angle)}
          size={size}
          spinning
        />
      )}
    />
  );
}

export function describeArc(x, y, radius, arcWidth, startAngle, endAngle) {
  const startOuter = polarToCartesian(x, y, radius, endAngle);
  const endOuter = polarToCartesian(x, y, radius, startAngle);
  const startInner = polarToCartesian(x, y, radius - arcWidth, startAngle);
  const endInner = polarToCartesian(x, y, radius - arcWidth, endAngle);

  const largeArcFlagOuter = endAngle - startAngle <= 180 ? '0' : '1';
  const largeArcFlagInner = endAngle - startAngle <= 180 ? '0' : '1';

  return [
    'M',
    startOuter.x,
    startOuter.y,
    'A',
    radius,
    radius,
    0,
    largeArcFlagOuter,
    0,
    endOuter.x,
    endOuter.y,
    'L',
    startInner.x,
    startInner.y,
    'A',
    -(radius - arcWidth),
    -(radius - arcWidth),
    0,
    largeArcFlagInner,
    1,
    endInner.x,
    endInner.y,
    'Z'
  ].join(' ');
}

function polarToCartesian(centerX, centerY, radius, angleInDegrees) {
  const angleInRadians = ((angleInDegrees - 90) * Math.PI) / 180.0;

  return {
    x: centerX + radius * Math.cos(angleInRadians),
    y: centerY + radius * Math.sin(angleInRadians)
  };
}
