/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { useLayoutEffect, useRef } from 'react';
import { animate } from 'motion';

import { PaginatedResult, Result } from '@instana/types';
import { generateStableHash } from '@instana/utils';

import locals from 'in-service-levels/components/SloList/components/FilterPanel.mless';

const PANEL_WIDTH_PX = 320;
const CONTENT_OFFSET_PX = 336;
const ANIMATION_OPTIONS = { duration: 0.25 };

export interface FilterPanelAnimationProps {
  page: number;
  result: Result<PaginatedResult<any>>;
}

export default function useFilterPanelAnimation({ page, result }: FilterPanelAnimationProps) {
  const tableContainerRef = useRef<HTMLDivElement>(null);

  // Extract complex expression for dependency array
  const resultHash = result ? generateStableHash(result) : null;

  useLayoutEffect(() => {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;
    const tableContent = tableContainer.querySelector('.cds--data-table-content');
    if (tableContent && tableContent.clientHeight > 0) {
      tableContainer.style.setProperty('--table-height', `${tableContent.clientHeight}px`);
    }
  }, [page, resultHash]);

  /**
   * Animates the filter panel and related elements
   * @param popoverOpen Whether the filter panel is being opened (false) or closed (true)
   */
  function animatePanel(popoverOpen: boolean) {
    const tableContainer = tableContainerRef.current;
    if (!tableContainer) return;

    const panel = tableContainer.querySelector(`.${locals['panel--container']}`) as HTMLElement;
    const content = tableContainer.querySelector(`.cds--data-table-content`) as HTMLElement;
    const pagination = tableContainer.querySelector(`.cds--pagination`) as HTMLElement;

    if (popoverOpen) {
      // Panel is closing - animate out
      animateElementIfExists(panel, {
        opacity: [1, 0],
        transform: [`translateX(0px)`, `translateX(-${PANEL_WIDTH_PX}px)`]
      });

      // Content and pagination expand to full width
      const fullWidthProps = {
        width: '100%',
        transform: 'translateX(0px)'
      };

      animateElementIfExists(content, fullWidthProps);
      animateElementIfExists(pagination, fullWidthProps);
    } else {
      // Panel is opening - animate in
      animateElementIfExists(panel, {
        opacity: [0, 1],
        transform: [`translateX(-${PANEL_WIDTH_PX}px)`, `translateX(0px)`]
      });

      // Content and pagination shrink to make room for panel
      const reducedWidthProps = {
        width: `calc(100% - ${CONTENT_OFFSET_PX}px)`,
        transform: `translateX(${CONTENT_OFFSET_PX}px)`
      };

      animateElementIfExists(content, reducedWidthProps);
      animateElementIfExists(pagination, reducedWidthProps);
    }
  }

  /**
   * Helper function to animate an element if it exists
   */
  function animateElementIfExists(element: HTMLElement | null, properties: Record<string, any>) {
    if (element) {
      animate(element, properties, ANIMATION_OPTIONS);
    }
  }

  return { tableContainerRef, animatePanel };
}
