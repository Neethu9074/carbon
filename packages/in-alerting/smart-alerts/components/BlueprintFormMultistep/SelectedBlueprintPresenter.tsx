/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { Spacer } from '@instana/components';

import AlertTypography from 'in-alerting/components/AlertTypography';
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
      <AlertTypography variant={'heading-200'} color={'color900'} content={title} noMargin>
        {isBeta && (
          <span className={locals.gap}>
            <BetaBadge />
          </span>
        )}
      </AlertTypography>

      <Spacer vertical="normal" />
      <AlertTypography variant={'body-large'} color={'color600'} content={description} noMargin />
      {children}
    </div>
  );
}
