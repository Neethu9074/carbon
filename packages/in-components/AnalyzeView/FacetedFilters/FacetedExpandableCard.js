/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { IconButton } from '@instana/components';

import { useAnalyzeTracker } from 'in-analyze/hooks/useAnalyzeTracker';
import ExpandableCard from './ExpandableCardWithSubtitle';
import { t } from 'in-i18n';

import locals from './FacetedExpandableCard.mless';

function HeaderButton({ type, onClick, href, className, tooltip }) {
  return (
    <IconButton
      isWrapperedByTooltip
      iconDescription={tooltip}
      kind="action"
      className={className}
      type={type}
      onClick={onClick}
      size="compact"
      href={href}
    />
  );
}

function GroupByHeaderButton({ tracker, tag, title, dataSource, linkToGroupedView }) {
  const onClick = e => {
    // required to hinder the ExpandableCard from collapsing when clicking in its header
    e.stopPropagation();
    tracker.groupClicked({
      tag,
      dataSource
    });
  };

  return (
    <HeaderButton
      tooltip={t('in-components:analyze.filterSidebar.groupingButton', { group: title })}
      className={locals.headerButton}
      type={'lib_group_by'}
      onClick={onClick}
      href={linkToGroupedView}
    />
  );
}

function UngroupHeaderButton({ linkToUngroupedView, tag, dataSource, tracker }) {
  const onClick = e => {
    // required to hinder the ExpandableCard from collapsing when clicking in its header
    e.stopPropagation();
    tracker.groupRemoved({
      tag,
      dataSource
    });
  };

  return (
    <HeaderButton
      type={'lib_ungroup'}
      onClick={onClick}
      href={linkToUngroupedView}
      className={locals.headerButton}
      tooltip={t('in-components:analyze.filterSidebar.ungroupButton')}
    />
  );
}

function GroupingButton({ isGrouped, tracker, title, tag, dataSource, linkToGroupedView, linkToUngroupedView }) {
  if (isGrouped) {
    return (
      <UngroupHeaderButton
        linkToUngroupedView={linkToUngroupedView}
        tag={tag}
        title={title}
        dataSource={dataSource}
        tracker={tracker}
      />
    );
  }
  return (
    <GroupByHeaderButton
      tracker={tracker}
      tag={tag}
      title={title}
      dataSource={dataSource}
      linkToGroupedView={linkToGroupedView}
    />
  );
}

export default function FacetedExpandableCard(props) {
  const {
    openByDefault = false,
    tag,
    entity,
    dataSource,
    isActiveGroup,
    disabled,
    enableUseAsGroup,
    tracker,
    getHrefToGroupedView,
    getHrefToUngroupedView,
    children,
    title
  } = props;

  const { trackUa2FacetedSearchFilterOpened, trackUa2FacetedSearchFilterClosed } = useAnalyzeTracker();
  return (
    <ExpandableCard
      disabled={disabled}
      useMaxAvailableHeight={false}
      hasMarginBottom
      expansionTracker={({ expanded }) => {
        const tracker = expanded ? trackUa2FacetedSearchFilterOpened : trackUa2FacetedSearchFilterClosed;
        tracker({
          tag,
          dataSource
        });
      }}
      {...props}
      rightHeaderContent={
        enableUseAsGroup &&
        !disabled && (
          <GroupingButton
            isGrouped={isActiveGroup}
            title={title}
            tag={tag}
            entity={entity}
            dataSource={dataSource}
            tracker={tracker}
            linkToGroupedView={getHrefToGroupedView({
              tag,
              tagEntity: entity
            })}
            linkToUngroupedView={getHrefToUngroupedView()}
          />
        )
      }
      openByDefault={openByDefault}
    >
      {children}
    </ExpandableCard>
  );
}
