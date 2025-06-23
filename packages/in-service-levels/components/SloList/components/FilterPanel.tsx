/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { Typography } from '@instana/components';
import { ButtonSet } from '@instana/carbon';

import locals from './FilterPanel.mless';

interface FilterPanelProps {
  filters: React.ReactNode;
  closeButton: React.ReactNode;
  primaryButton: React.ReactNode;
  secondaryButton: React.ReactNode;
  popoverOpen: boolean;
}

export default function FilterPanel({
  filters,
  closeButton,
  primaryButton,
  secondaryButton,
  popoverOpen
}: FilterPanelProps) {
  return (
    <div className={locals['panel--container']}>
      {popoverOpen && (
        <>
          <div className={locals['filter--panel__content']}>
            <div className={locals['filter--panel__header']}>
              {closeButton}
              <Typography variant="body-bold">Filter</Typography>
              <span className={locals['scroll-divider']} />
            </div>
            <div className={locals['flyout--container']}>{filters}</div>
          </div>
          <ButtonSet className={locals['filter-panel-button-set']}>
            {secondaryButton}
            {primaryButton}
          </ButtonSet>
        </>
      )}
    </div>
  );
}
