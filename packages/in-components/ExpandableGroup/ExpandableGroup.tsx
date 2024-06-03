/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ExpandableGroup.mless';

interface ExpandableGroupProps {
  title: string | JSX.Element;
  expandedTitle?: string;
  children: React.ReactNode;
  defaultExpanded?: boolean;
  onToggle?: (isToggled: boolean) => void;
  expanded?: boolean;
}

export default function ExpandableGroup({
  title,
  expandedTitle,
  children,
  defaultExpanded,
  onToggle,
  expanded: expandedProp
}: ExpandableGroupProps) {
  const [isExpanded, setIsExpanded] = useState(!!defaultExpanded);

  const expanded = typeof expandedProp === 'boolean' ? expandedProp : isExpanded;

  return (
    <div className={locals.wrapper}>
      <div className={locals.header}>
        <div className={locals.headerContent}>{isExpanded && expandedTitle ? expandedTitle : title}</div>
        {children && (
          <div className={locals.headerActions}>
            <Tooltip
              content={
                expanded
                  ? t('in-components:expandableGroup.tooltipHideContent')
                  : t('in-components:expandableGroup.tooltipShowContent')
              }
            >
              <SvgIcon
                className={locals.expandIcon}
                type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                aria-label={t('in-components:expandableGroup.labelExpandButtonForContent')}
                tabIndex={0}
                onClick={() => {
                  onToggle?.(!isExpanded);
                  setIsExpanded(!isExpanded);
                }}
              />
            </Tooltip>
          </div>
        )}
      </div>
      {expanded && <div className={locals.expandedContentWrapper}>{children}</div>}
    </div>
  );
}
