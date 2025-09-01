/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import classNames from 'classnames';
import React from 'react';

import { IconButtonSvgSizes } from '@instana/components/types/components/IconButton/types';
import { themes } from '@instana/design-tokens';
import { useObservable } from '@instana/hooks';
import { SvgIcon } from '@instana/components';
import { IconButton } from '@instana/carbon';

import {
  EVENT_TYPES,
  getColorForEventAtFocusedMomentAsStream,
  getEventStatusAtFocusMoment,
  getEventType,
  getIcon
} from 'in-stores/events';

import locals from 'in-events/components/EventIcon.mless';

interface EventIconProps {
  event: any;
  tooltipLabel: string;
  size?: IconButtonSvgSizes;
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

  const IconElement = (
    <SvgIcon
      color={finalColor || 'var(--cds-icon-on-color-disabled)'}
      style={{ fill: finalColor || 'var(--cds-icon-on-color-disabled)' }}
      className={classNames(className, {
        [locals.waringIcon]: isIssueWarning && eventOpenOrClosed
      })}
      type={getIcon(eventType)}
      size={size || 's'}
    />
  );

  return (
    <IconButton
      kind={'ghost'}
      label={tooltipLabel}
      align="right"
      size={'sm'}
      type="reset"
      className={classNames({ [locals.iconButton]: size === ('regular' as unknown as IconButtonSvgSizes) })}
    >
      {IconElement}
    </IconButton>
  );
}
