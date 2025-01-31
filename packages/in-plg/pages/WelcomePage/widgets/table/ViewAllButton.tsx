/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React from 'react';

import { CarbonButton } from '@instana/components';

import { IconForButton } from 'in-plg/components/IconForButton/IconForButton';

import locals from './ViewAllButton.mless';

interface ViewAllButtonProps {
  href?: string;
  viewLabel: string;
  isTableEmpty?: boolean;
}

export default function ViewAllButton({ href, viewLabel, isTableEmpty = false }: Readonly<ViewAllButtonProps>) {
  return (
    <CarbonButton
      size="md"
      kind="ghost"
      className={locals.viewAllButtonWrapper}
      renderIcon={() => <IconForButton icon="lib_arrow_right" iconSize="s" iconStyle={locals.viewAllButtonArrowIcon} />}
      href={href}
      aria-label={viewLabel}
      iconDescription={viewLabel}
      disabled={isTableEmpty}
    >
      {viewLabel}
    </CarbonButton>
  );
}
