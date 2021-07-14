/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Button, SvgIcon } from '@instana/components';

import { ua2FacetedSearchFilterClosedTracker, ua2FacetedSearchFilterOpenedTracker } from 'in-components/tracker';
import { openFacetedSearchByDefault } from 'in-services/featureFlags';
import ExpandableCard from './ExpandableCardWithSubtitle';

import locals from './FacetedExpandableCard.mless';

function HeaderButton({ icon, onClick, href, className }) {
  return (
    <Button href={href} className={className} onClick={onClick}>
      {icon}
    </Button>
  );
}

function GroupByHeaderButton({ groupByTracker, tag, dataSource, linkToGroupedView }) {
  const onClick = e => {
    // required to hinder the ExpandableCard from collapsing when clicking in its header
    e.stopPropagation();
    groupByTracker({
      tag: tag,
      dataSource: dataSource
    });
  };
  const icon = <SvgIcon type={'lib_group_by'} size={'xs'} />;
  return <HeaderButton icon={icon} onClick={onClick} href={linkToGroupedView} className={locals.headerButton} />;
}

function UngroupHeaderButton({ linkToUngroupedView }) {
  const onClick = e => {
    // required to hinder the ExpandableCard from collapsing when clicking in its header
    e.stopPropagation();
  };
  const icon = <SvgIcon type={'lib_ungroup'} size={'xs'} />;
  return <HeaderButton icon={icon} onClick={onClick} href={linkToUngroupedView} className={locals.headerButton} />;
}

function GroupingButton({ isGrouped, groupByTracker, tag, dataSource, linkToGroupedView, linkToUngroupedView }) {
  if (isGrouped) {
    return <UngroupHeaderButton linkToUngroupedView={linkToUngroupedView} />;
  }
  return (
    <GroupByHeaderButton
      groupByTracker={groupByTracker}
      tag={tag}
      dataSource={dataSource}
      linkToGroupedView={linkToGroupedView}
    />
  );
}

export default function FacetedExpandableCard(props) {
  const {
    openByDefault = openFacetedSearchByDefault,
    tag,
    entity,
    dataSource,
    isActiveGroup,
    disabled,
    enableUseAsGroup,
    groupByTracker,
    getHrefToGroupedView,
    getHrefToUngroupedView,
    children
  } = props;

  return (
    <ExpandableCard
      disabled={disabled}
      useMaxAvailableHeight={false}
      hasMarginBottom
      tooltipDisabled
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
            tag={tag}
            entity={entity}
            dataSource={dataSource}
            groupByTracker={groupByTracker}
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
