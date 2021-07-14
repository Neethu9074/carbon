/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';
import { Card } from '@instana/components';

import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ExpandableCard.mless';

export default function ExpandableCard({
  title,
  preview,
  children,
  header,
  titleSubContent,
  expansionTracker,
  headerClassName,
  bodyClassName,
  openByDefault = false,
  className,
  useMaxAvailableHeight,
  size,
  tooltipDisabled = false
}) {
  const [expanded, setExpanded] = useState(openByDefault);

  const rightSide = (
    <div className={locals.rightSide}>
      {header}

      <Tooltip
        content={
          !tooltipDisabled &&
          (expanded
            ? t('in-components:expandableCard.tooltipShowLess')
            : t('in-components:expandableCard.tooltipShowMore'))
        }
      >
        <SvgIcon
          className={locals.icon}
          type={expanded ? 'lib_arrow_expand_up' : 'lib_arrow_expand_down'}
          onClick={() => {
            if (expansionTracker) {
              expansionTracker({
                expanded: !expanded
              });
            }
            setExpanded(!expanded);
          }}
          size="s"
        />
      </Tooltip>
    </div>
  );

  return (
    <Card
      title={title}
      leftHeaderContent={expanded ? titleSubContent : preview}
      rightHeaderContent={rightSide}
      onHeaderBackgroundClicked={() => setExpanded(!expanded)}
      className={className}
      bodyClassName={bodyClassName}
      headerClassName={headerClassName}
      useMaxAvailableHeight={useMaxAvailableHeight}
      size={size}
    >
      {expanded && children}
    </Card>
  );
}
