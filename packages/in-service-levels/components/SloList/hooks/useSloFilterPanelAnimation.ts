/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useLayoutEffect, useRef } from 'react';
import { animate } from 'motion';

import { PaginatedResult, Result } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import { SloListItem } from 'in-service-levels/types';

import locals from 'in-service-levels/components/SloList/components/FilterPanel.mless';

export interface SloFilterPanelAnimationProps {
  page: number;
  result: Result<PaginatedResult<SloListItem>>;
}

export default function useSloFilterPanelAnimation({ page, result }: SloFilterPanelAnimationProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;
    const tableContent = tableContainer.querySelector('.cds--data-table-content') as HTMLDivElement | null;
    if (tableContent) {
      const height = tableContent.clientHeight;
      if (height > 0) {
        tableContainer.style.setProperty('--table-height', `${height}px`);
      }
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [page, generateStableHash(result)]);

  // animate the filter panel content
  function animatePanel(popoverOpen: boolean) {
    const table = tableContainerRef.current;
    if (!table) return;
    const panel = table.querySelector(`.${locals['panel--container']}`);
    const content = table.querySelector(`.cds--data-table-content`);
    const pagination = table.querySelector(`.cds--pagination`);

    if (popoverOpen) {
      panel &&
        animate(panel, { opacity: [1, 0], transform: [`translateX(0px)`, `translateX(-320px)`] }, { duration: 0.25 });
      content && animate(content, { width: '100%', transform: 'translateX(0px)' }, { duration: 0.25 });
      pagination && animate(pagination, { width: '100%', transform: 'translateX(0px)' }, { duration: 0.25 });
    } else {
      panel &&
        animate(panel, { opacity: [0, 1], transform: [`translateX(-320px)`, `translateX(0px)`] }, { duration: 0.25 });
      content && animate(content, { width: 'calc(100% - 336px)', transform: 'translateX(336px)' }, { duration: 0.25 });
      pagination &&
        animate(pagination, { width: 'calc(100% - 336px)', transform: 'translateX(336px)' }, { duration: 0.25 });
    }
  }

  return { tableContainerRef, animatePanel };
}
