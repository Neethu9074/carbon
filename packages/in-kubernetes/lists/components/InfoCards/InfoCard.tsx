/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { CarbonClickableTile, Typography, SvgIcon, Stack, Spacer } from '@instana/components';
import { themes } from '@instana/design-tokens';

import { Card } from 'in-kubernetes/lists/utils';

import locals from './InfoCards.mless';

export default function InfoCard({ cardTitle, subtitle, counter, additionalInfo, href, onClick }: Card) {
  return (
    <CarbonClickableTile
      href={href}
      onClick={onClick}
      className={locals.tile}
      renderIcon={() => (
        <div className={locals.icon}>
          <SvgIcon type="lib_arrow_right" color={themes.default.cds.link.primary} />
        </div>
      )}
    >
      <Typography variant="heading-compact-01" component="h3">
        {cardTitle}
      </Typography>
      <div className={locals.tileContent}>
        <Stack direction="horizontal" gap="xlarge">
          {additionalInfo ?? (
            <Typography variant="heading-05" component="h4" noMargin>
              <span>{counter}</span>
            </Typography>
          )}
        </Stack>
        <Spacer vertical="xsmall" />
        <Typography variant="body-01" component="div">
          <span className={locals.subtitle}>{subtitle}</span>
        </Typography>
      </div>
    </CarbonClickableTile>
  );
}
