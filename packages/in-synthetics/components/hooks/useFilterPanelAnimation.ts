/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useLayoutEffect, useRef } from 'react';
import { animate } from 'motion';

import { generateStableHash } from '@instana/utils';

import { FilterPanelAnimationProps } from 'in-synthetics/utils/constants';
import { ListItem } from 'in-synthetics/components/constants';

import locals from 'in-service-levels/components/SloList/components/FilterPanel.mless';

export default function useFilterPanelAnimation<ITEM_TYPE extends ListItem>({
  page,
  result
}: FilterPanelAnimationProps<ITEM_TYPE>) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  useLayoutEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;
    const tableContent = tableContainer.querySelector('.cds--data-table-content');
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
    const tagFilterContainer = table.querySelector(`#tag-filter-container`);

    if (popoverOpen) {
      panel &&
        animate(panel, { opacity: [1, 0], transform: [`translateX(0px)`, `translateX(-320px)`] }, { duration: 0.25 });
      content && animate(content, { width: '100%', transform: 'translateX(0px)' }, { duration: 0.25 });
      pagination && animate(pagination, { width: '100%', transform: 'translateX(0px)' }, { duration: 0.25 });
      tagFilterContainer &&
        animate(tagFilterContainer, { width: '100%', transform: 'translateX(0px)' }, { duration: 0.25 });
    } else {
      panel &&
        animate(panel, { opacity: [0, 1], transform: [`translateX(-320px)`, `translateX(0px)`] }, { duration: 0.25 });
      content && animate(content, { width: 'calc(100% - 336px)', transform: 'translateX(336px)' }, { duration: 0.25 });
      pagination &&
        animate(pagination, { width: 'calc(100% - 336px)', transform: 'translateX(336px)' }, { duration: 0.25 });
      tagFilterContainer &&
        animate(
          tagFilterContainer,
          { width: 'calc(100% - 336px)', transform: 'translateX(336px)' },
          { duration: 0.25 }
        );
    }
  }

  return { tableContainerRef, animatePanel };
}
