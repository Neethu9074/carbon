/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import { getIcon, getColorForEventAtFocusedMomentAsStream, getEventType } from 'in-stores/events';
// import { EventOrMap } from 'in-events/types';
import Tooltip from 'in-components/Tooltip';

interface EventIconProps {
  event: any;
  tooltipLabel: string;
  size?: Size;
  className?: string;
  disableColorCalculation?: boolean;
}

export default function EventIcon({ className, event, tooltipLabel, size, disableColorCalculation }: EventIconProps) {
  const colorObservable = disableColorCalculation
    ? null
    : getColorForEventAtFocusedMomentAsStream(event, {
        defaultColor: themes.default.ids.color.option.neutral['700']
      });

  const color = useObservable(colorObservable, [event]);

  const finalColor = typeof color === 'string' ? color : '#40535b';

  const eventType = getEventType(event);

  return (
    <Tooltip content={tooltipLabel} align="rightMiddle">
      <SvgIcon color={finalColor || '#40535b'} className={className} type={getIcon(eventType)} size={size || 's'} />
    </Tooltip>
  );
}
