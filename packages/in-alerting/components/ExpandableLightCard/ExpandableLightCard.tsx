/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { ReactNode, useState } from 'react';

import { IconButton } from '@instana/components';

import LightCard from 'in-alerting/components/LightCard/LightCard';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './ExpandableLightCard.mless';

interface Props {
  title?: ReactNode;
  preview?: ReactNode;
  titleSubContent?: ReactNode;
  children?: ReactNode;
  header?: ReactNode;
  label?: string;

  className?: string;
  headerClassName?: string;
  darkFrame?: boolean;
  framed?: boolean;
  useMaxAvailableHeight?: boolean;

  bodyWithoutPadding?: boolean;

  tooltipDisabled?: boolean;
  openByDefault?: boolean;
  expansionTracker?: ({ expanded }: { expanded: boolean }) => void;
  isTearSheetView?: boolean;
}

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
  tooltipDisabled = false,
  isTearSheetView
}: Props) {
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
        delay={500}
      >
        <IconButton
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
          size="normal"
          kind="action"
        />
      </Tooltip>
    </div>
  );

  return (
    <LightCard
      title={title}
      label={label}
      titleSubContent={expanded ? titleSubContent : preview}
      header={rightSide}
      withoutPadding={!expanded || bodyWithoutPadding}
      framed={framed}
      onHeaderBackgroundClicked={() => setExpanded(!expanded)}
      className={className}
      headerClassName={headerClassName}
      darkFrame={darkFrame}
      useMaxAvailableHeight={useMaxAvailableHeight}
      isTearSheetView={isTearSheetView}
    >
      {expanded && children}
    </LightCard>
  );
}
