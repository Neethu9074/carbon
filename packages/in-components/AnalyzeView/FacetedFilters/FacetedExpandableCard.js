/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { SvgIcon } from '@instana/components';
import { Button } from '@instana/legacy';

import { ua2FacetedSearchFilterClosedTracker, ua2FacetedSearchFilterOpenedTracker } from 'in-components/tracker';
import ExpandableCard from './ExpandableCardWithSubtitle';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from './FacetedExpandableCard.mless';

function HeaderButton({ icon, onClick, href, className, tooltip }) {
  return (
    <Tooltip content={tooltip}>
      <Button href={href} className={className} onClick={onClick}>
        {icon}
      </Button>
    </Tooltip>
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
  const icon = <SvgIcon type={'lib_group_by'} size={'xs'} />;
  return (
    <HeaderButton
      icon={icon}
      onClick={onClick}
      href={linkToGroupedView}
      className={locals.headerButton}
      tooltip={t('in-components:analyze.filterSidebar.groupingButton', { group: title })}
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
  const icon = <SvgIcon type={'lib_ungroup'} size={'xs'} />;
  return (
    <HeaderButton
      icon={icon}
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

  return (
    <ExpandableCard
      disabled={disabled}
      useMaxAvailableHeight={false}
      hasMarginBottom
      expansionTracker={({ expanded }) => {
        const tracker = expanded ? ua2FacetedSearchFilterOpenedTracker : ua2FacetedSearchFilterClosedTracker;
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
