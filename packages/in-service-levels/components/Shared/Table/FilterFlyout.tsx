/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useRef, useState } from 'react';
import { Filter } from '@carbon/icons-react';

import { Layer, Popover, IconButton, PopoverContent, ButtonSet, Button } from '@instana/carbon';
import { Spacer, Typography } from '@instana/components';

import { t } from 'in-i18n';

import locals from './FilterFlyout.mless';

interface FilterFlyoutProps {
  onClickPrimary: () => void;
  onClose: () => void;
  onClickSecondary: () => void;
  filters: React.ReactNode;
  disabled?: boolean;
}

export default function FilterFlyout({
  filters,
  onClickPrimary,
  onClickSecondary,
  onClose,
  disabled
}: FilterFlyoutProps) {
  const [popoverOpen, setPopoverOpen] = useState(false);
  const popoverRef = useRef<HTMLSpanElement>(null);
  const returnFocusToFlyoutTrigger = () => {
    if (popoverRef?.current) {
      const triggerButton = popoverRef?.current.querySelector('button');
      triggerButton?.focus();
    }
  };
  return (
    <Layer>
      <Popover
        open={popoverOpen}
        isTabTip
        onRequestClose={() => {
          setPopoverOpen(false);
          onClose();
        }}
        align="bottom-end"
        autoAlign
        ref={popoverRef}
      >
        <IconButton
          onClick={() => setPopoverOpen(prev => !prev)}
          label={t('in-service-levels:general.filtering.filterLabel')}
          kind="ghost"
          disabled={disabled}
        >
          <Filter />
        </IconButton>
        <PopoverContent>
          <div className={locals['flyout--container']}>
            <Typography variant="body-compact-01">
              <span className={locals['flyout--label']}>{t('in-service-levels:general.filtering.filterLabel')}</span>
            </Typography>
            <Spacer vertical="normal" />
            <div className={locals['flyout--container__filters']}>{filters}</div>
          </div>
          <ButtonSet className={locals['filter-flyout-button-set']}>
            <Button
              kind="secondary"
              onClick={() => {
                onClickSecondary();
                setPopoverOpen(false);
                returnFocusToFlyoutTrigger();
              }}
            >
              {t('in-service-levels:general.filtering.clearLabel')}
            </Button>
            <Button
              kind="primary"
              onClick={() => {
                onClickPrimary();
                setPopoverOpen(false);
                returnFocusToFlyoutTrigger();
              }}
            >
              {t('in-service-levels:general.filtering.filterLabel')}
            </Button>
          </ButtonSet>
        </PopoverContent>
      </Popover>
    </Layer>
  );
}
