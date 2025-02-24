/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import classNames from 'classnames';
import React from 'react';

import { CarbonClickableTile, Typography, SvgIcon, Tooltip, LoadingSkeleton } from '@instana/components';
import { themes } from '@instana/design-tokens';

import locals from './InfoCard.mless';

interface InfoCardTileProps {
  title: string;
  href: string;
  subtitle?: string;
  counter: string;
  hasIssues?: boolean;
  hasWarnings?: boolean;
  isLoading?: boolean;
  tooltip?: string;
}

export default function InfoCardTile(props: Readonly<InfoCardTileProps>) {
  const { title, subtitle, counter, href, isLoading, hasIssues, hasWarnings, tooltip } = props;

  const counterWithOrWithoutTooltip = tooltip ? (
    <Tooltip content={tooltip} align="auto">
      <div>{counter}</div>
    </Tooltip>
  ) : (
    counter
  );

  return (
    <CarbonClickableTile
      href={href}
      className={locals.tile}
      renderIcon={() => (
        <div className={locals.icon}>
          <SvgIcon type="lib_arrow_right" color={themes.default.cds.link.primary} />
        </div>
      )}
    >
      <Typography variant="heading-compact-01" component="h3">
        {title}
      </Typography>
      <div className={locals.tileContent}>
        <Typography variant="heading-05" component="h4">
          <span
            className={classNames({
              [locals.hasWarnings]: hasWarnings,
              [locals.hasIssues]: hasIssues
            })}
          >
            {!isLoading ? counterWithOrWithoutTooltip : <LoadingSkeleton className={locals.skeleton} />}
          </span>
        </Typography>
        <Typography variant="body-01" component="div">
          <span className={locals.subtitle}>
            {!isLoading ? subtitle : <LoadingSkeleton className={locals.skeletonSubtitle} />}
          </span>
        </Typography>
      </div>
    </CarbonClickableTile>
  );
}
