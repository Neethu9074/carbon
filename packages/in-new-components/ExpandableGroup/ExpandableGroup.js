/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React, { useState } from 'react';
import { t } from 'in-i18n';

import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';

import locals from './ExpandableGroup.mless';

export default function ExpandableGroup({ title, expandedTitle, children, defaultExpanded }) {
  const [isExpanded, setIsExpanded] = useState(defaultExpanded ? true : false);

  return (
    <div className={locals.wrapper}>
      <div className={locals.header}>
        <div className={locals.headerContent}>{isExpanded && expandedTitle ? expandedTitle : title}</div>
        {children && (
          <div className={locals.headerActions}>
            <Tooltip content={t('in-new-components:expandableGroup.tooltipShowContent')}>
              <SvgIcon
                className={locals.expandIcon}
                type={isExpanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
                aria-label={t('in-new-components:expandableGroup.labelExpandButtonForContent')}
                tabIndex={0}
                onClick={() => setIsExpanded(!isExpanded)}
              />
            </Tooltip>
          </div>
        )}
      </div>
      {isExpanded && <div className={locals.expandedContentWrapper}>{children}</div>}
    </div>
  );
}
