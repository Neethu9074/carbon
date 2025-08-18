/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { Size } from '@instana/components/types/components/SvgIcon/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';

import {
  getIcon,
  getColorForEventAtFocusedMomentAsStream,
  getEventType,
  EVENT_TYPES,
  getEventStatusAtFocusMoment
} from 'in-stores/events';
import Tooltip from 'in-components/Tooltip';

import locals from 'in-events/components/EventIcon.mless';

interface EventIconProps {
  event: any;
  tooltipLabel: string;
  size?: Size;
  className?: string;
  disableColorCalculation?: boolean;
}

export default function EventIcon({ className, event, tooltipLabel, size, disableColorCalculation }: EventIconProps) {
  const eventType = getEventType(event);

  const eventOpenOrClosed = useObservable(getEventStatusAtFocusMoment(event), [event]);

  const isIssueWarning = eventType === EVENT_TYPES.ISSUE_WARNING;

  const colorObservable = disableColorCalculation
    ? null
    : getColorForEventAtFocusedMomentAsStream(event, {
        defaultColor: themes.default.ids.color.option.neutral['700']
      });

  const color = useObservable(colorObservable, [event]);
  const finalColor = typeof color === 'string' ? color : 'var(--cds-icon-on-color-disabled)';

  return (
    <Tooltip content={tooltipLabel} align="rightMiddle">
      <SvgIcon
        color={finalColor || 'var(--cds-icon-on-color-disabled)'}
        className={classNames(className, {
          [locals.waringIcon]: isIssueWarning && eventOpenOrClosed
        })}
        type={getIcon(eventType)}
        size={size || 's'}
      />
    </Tooltip>
  );
}
