/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { MouseEvent } from 'react';

import { Button } from '@instana/components';

import { t } from 'in-i18n';

import locals from './EntityTablePaginator.mless';

/**
 * Props for the current component
 * which expects to be only rendered if the pagination should be visible
 */
interface Props {
  loadMore: () => void;
}

/**
 * Actual component
 * @param param0 to provide the loadMore function
 * @returns Paginator - including a wrapper to  centralize the button
 */
export default function EntityTablePaginator({ loadMore }: Props) {
  return (
    <div className={locals.wrapper}>
      <Button
        kind="action"
        onClick={(e: MouseEvent) => {
          e.preventDefault();
          e.stopPropagation();
          // @ts-expect-error typing is missing blur function
          e.target.blur();
          loadMore();
        }}
      >
        {t('in-settings:general.loadMore')}
      </Button>
    </div>
  );
}
