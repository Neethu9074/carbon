/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { toInteractiveElement } from '@instana/components';

import { clearActiveTooltip } from 'in-components/Tooltip/store';
import { t } from 'in-i18n';

import locals from './PotentialProblemMarker.mless';

export default function PotentialProblemMarker({ eventData, xScale, onClick }) {
  const height = 8; // it's the same value as the --item-heigh var in the respective CSS file
  const { duration } = eventData;
  let durationWidth = duration ? xScale?.getRangeArea(duration) : null;
  if (!durationWidth) return null;
  if (durationWidth < height) durationWidth = height;

  const clickHandler = !onClick
    ? undefined
    : () => {
        onClick(eventData);
        clearActiveTooltip();
      };

  return (
    <div
      className={locals.marker}
      style={{
        transform: `translateX(${durationWidth / 2}px)`,
        width: durationWidth
      }}
      onClick={clickHandler}
      {...toInteractiveElement({
        ariaLabel: t('in-alerting:potentialProblems.labelPotentialProblem'),
        onDefaultInteraction: clickHandler
      })}
    />
  );
}
