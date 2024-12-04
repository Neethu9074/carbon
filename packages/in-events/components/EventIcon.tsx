/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useEffect, useState } from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { themes } from '@instana/design-tokens';
import { SvgIcon } from '@instana/components';

import { getIcon, getColorForEventAtFocusedMomentAsStream, getEventType } from 'in-stores/events';
import { EventOrMap } from 'in-events/types';
import Tooltip from 'in-components/Tooltip';

interface EventIconProps {
  event: any;
  tooltipLabel: string;
  size?: Size;
  className?: string;
  disableColorCalculation?: boolean;
}

export default function EventIcon({ className, event, tooltipLabel, size, disableColorCalculation }: EventIconProps) {
  const [color, setColor] = useState<string | undefined>('#40535b');

  useEffect(() => {
    let isSubscribed = true;

    if (disableColorCalculation) {
      setColor(undefined);
      return;
    }

    const colorObserver = getColorForEventAtFocusedMomentAsStream(event as EventOrMap, {
      defaultColor: themes.default.ids.color.option.neutral['700']
    });

    colorObserver.subscribe((colorValue: string) => {
      if (isSubscribed) {
        setColor(colorValue);
      }
    });
    return () => {
      isSubscribed = false;
    };
  }, [event, disableColorCalculation]);

  const eventType = getEventType(event);

  return (
    <Tooltip content={tooltipLabel} align="rightMiddle">
      <SvgIcon color={color || '#40535b'} className={className} type={getIcon(eventType)} size={size || 's'} />
    </Tooltip>
  );
}
