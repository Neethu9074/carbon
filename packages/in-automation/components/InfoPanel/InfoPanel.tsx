/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import React, { useState } from 'react';

import { Stack, DashboardButton, SvgIconSizes } from '@instana/components';
import { t } from '@instana/i18n-react';

import locals from './InfoPanel.mless';

interface contentColumn {
  text?: string;
  link?: {
    label: string;
    url?: string;
  };
}

interface infoPanelProps {
  id?: string;
  ariaLabel?: string;
  collapsible?: boolean;
  showLabel?: string;
  hideLabel?: string;
  expanded?: string | boolean;
  content: {
    title?: string;
    columns: contentColumn[];
  };
}

export default function InfoPanel({
  id = 'infoPanel',
  ariaLabel = 'Task guidance',
  collapsible = true,
  showLabel = 'Show tasks',
  hideLabel = 'Hide tasks',
  expanded = true,
  content
}: infoPanelProps) {
  const [isExpanded, setIsExpanded] = useState(
    typeof expanded === 'string' ? (localStorage.getItem(expanded) as unknown as boolean) ?? true : expanded
  );

  const toggleVisibility = () => {
    setIsExpanded((prev: boolean) => !prev);
  };

  return (
    <section id={id} aria-label={ariaLabel}>
      <h1>{content.title ?? null}</h1>
      {isExpanded && (
        <div className={locals.carouselStack}>
          <p>column text</p>
        </div>
      )}
      {collapsible && (
        <div className={`${locals.toolbarSection} ${!isExpanded ? locals.expanded : ''}`}>
          <Stack direction="horizontal" align="center" distribution="spaceBetween">
            <Stack align="start">
              <DashboardButton
                kind="ghost"
                size="sm"
                className={locals.hideButton}
                icon={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                iconSize={SvgIconSizes.s}
                onClick={toggleVisibility}
              >
                <p> {t(isExpanded ? hideLabel : showLabel)} </p>
              </DashboardButton>
            </Stack>
          </Stack>
        </div>
      )}
    </section>
  );
}
