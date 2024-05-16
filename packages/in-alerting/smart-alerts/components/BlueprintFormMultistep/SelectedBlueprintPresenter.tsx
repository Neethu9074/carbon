/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Typography } from '@instana/components';

import BetaBadge from 'in-components/BetaBadge/BetaBadge';

import locals from './SelectedBlueprintPresenter.mless';

interface Props {
  title: string;
  description?: string;
  children?: React.ReactNode;
  isBeta?: boolean;
}

export default function SelectedBlueprintPresenter({ title, description, isBeta, children }: Props) {
  return (
    <div>
      <Typography variant="heading-200" noMargin>
        <span className={locals.color900}> {title} </span>
        {isBeta && <BetaBadge />}
      </Typography>
      <div className={locals.gap} />
      {description && (
        <Typography variant="body-large">
          <span className={locals.color600}>{description}</span>
        </Typography>
      )}
      {children}
    </div>
  );
}
