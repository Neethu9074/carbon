/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useState } from 'react';

import { SvgIcon } from '@instana/components';

import LightCard from 'in-alerting/components/LightCard/LightCard';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ExpandableLightCard.mless';

export default function ExpandableLightCard({
  title,
  preview,
  children,
  header,
  titleSubContent,
  expansionTracker,
  headerClassName,
  bodyWithoutPadding,
  openByDefault = false,
  className,
  framed,
  label,
  darkFrame,
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
    <LightCard
      title={title}
      label={label}
      titleSubContent={expanded ? titleSubContent : preview}
      leftHeaderContent={expanded ? titleSubContent : preview}
      header={rightSide}
      withoutPadding={!expanded || bodyWithoutPadding}
      framed={framed}
      onHeaderBackgroundClicked={() => setExpanded(!expanded)}
      className={className}
      headerClassName={headerClassName}
      darkFrame={darkFrame}
      useMaxAvailableHeight={useMaxAvailableHeight}
      size={size}
    >
      {expanded && children}
    </LightCard>
  );
}
