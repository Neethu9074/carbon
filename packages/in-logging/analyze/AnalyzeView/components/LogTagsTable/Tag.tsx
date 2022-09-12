/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { ColumnizedContent, Li, Link, Stack, Ul } from '@instana/components';
import { TagFilter } from '@instana/types';

import {
  ApplicationProps,
  ApplicationsListProps,
  GetContentType,
  ResolvedLinkProps,
  TagEntryProps,
  TagGroupHeaderProps,
  ToggleProps
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/types';
import {
  createGroupingTag,
  createTag,
  trackFilterClick,
  trackGroupClick
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import {
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_DOCKER_SNAPSHOT_ID
} from 'in-logging/queryBuilder';
import ContainerPerformanceSparkcharts from 'in-logging/analyze/AnalyzeView/components/ContainerPerformanceSparkcharts';
import { columnDefinitions } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/constants';
import useResolvedValue from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedValue';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedName';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedLink';
import { logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import IconLink from 'in-components/IconButton/IconLink';
import Overlay from 'in-components/overlays/Overlay';
import Header from 'in-components/Dialog/Header';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

export function TagName({ tag, tagToLabelMap }: TagEntryProps) {
  return useResolvedName(tag, tagToLabelMap);
}

export function TagValue({
  tag,
  uniqueTagName,
  isHovered,
  allowedTagsForGrouping,
  onSelectTagHref,
  getHrefToGroupedView,
  item
}: GetContentType) {
  const value = tag.stringValue || '';
  const resolvedValue = useResolvedValue(uniqueTagName, tag);

  return (
    <Stack direction="horizontal" gap="xxsmall" align="center" distribution="spaceBetween">
      <ResolvedLink tag={tag} item={item} resolvedValue={resolvedValue} uniqueTagName={uniqueTagName} />

      {isHovered && tag.key !== LOG_CUSTOM_KEY_APPLICATION_IDS && (
        <Stack direction="horizontal" gap="disabled" align="center">
          {allowedTagsForGrouping?.has(tag.name || '') && getHrefToGroupedView && (
            <Tooltip content={t('in-logging:tooltipAddAsGroup')}>
              <IconLink
                iconSize={'xs'}
                type="lib_group_by"
                href={getHrefToGroupedView(createGroupingTag(tag.name, tag.key))}
                onClick={() => trackGroupClick(resolvedValue)}
              />
            </Tooltip>
          )}
          {onSelectTagHref && (
            <Tooltip content={t('in-logging:tooltipAddAsFilter')}>
              <IconLink
                iconSize={'xs'}
                type="lib_actions_filter"
                href={onSelectTagHref(createTag(value, tag.name, tag.key) as TagFilter)}
                onClick={() => trackFilterClick(tag, value)}
              />
            </Tooltip>
          )}
          <Tooltip content={t('in-logging:tooltipCopyToClipboard')}>
            <CopyToClipboard getText={() => resolvedValue}>
              {copyToClipboardRef => <IconButton ref={copyToClipboardRef} iconSize={'xs'} type="lib_actions_copy" />}
            </CopyToClipboard>
          </Tooltip>
        </Stack>
      )}
    </Stack>
  );
}

function ResolvedLink({ uniqueTagName, resolvedValue, tag, item }: ResolvedLinkProps) {
  const resolvedLink = useResolvedLink(uniqueTagName, tag, item);

  if (tag.key === LOG_CUSTOM_KEY_APPLICATION_IDS) {
    return (
      <Overlay<ApplicationsListProps>
        content={ApplicationsList}
        props={{ applicationIds: (tag.stringValue || '').split(','), item }}
        align="leftMiddle"
      >
        {({ toggle }: ToggleProps) => (
          <span className={locals.link} onClick={toggle}>
            {resolvedValue}
          </span>
        )}
      </Overlay>
    );
  }

  if (resolvedLink) {
    return (
      <Link
        className={locals.value}
        href={resolvedLink}
        onClick={() => logMessageTagClicked({ tag: { name: tag.name, value: resolvedValue, key: tag.key } })}
      >
        {resolvedValue}
      </Link>
    );
  }
  return <span className={locals.value}>{resolvedValue}</span>;
}

export const TagGroupHeader = ({ groupLabel }: TagGroupHeaderProps) => {
  return (
    <Li className={locals.liGroup} size="compact">
      <strong>{groupLabel}</strong>
    </Li>
  );
};

function ApplicationsList({ applicationIds, item }: ApplicationsListProps) {
  return (
    <div className={locals.applicationListOverlay}>
      <Header title={t('in-logging:applications')} />
      <Ul className={locals.applicationList}>
        {applicationIds.map(applicationId => (
          <Application key={applicationId} applicationId={applicationId} item={item} />
        ))}
      </Ul>
    </div>
  );
}

function Application({ applicationId, item }: ApplicationProps) {
  const resolvedLink =
    useResolvedLink(LOG_CUSTOM_KEY_APPLICATION_ID, { stringValue: applicationId }, item) || undefined;
  const resolvedValue = useResolvedValue(LOG_CUSTOM_KEY_APPLICATION_ID, { stringValue: applicationId });

  return (
    <Li>
      <Link
        className={locals.value}
        href={resolvedLink}
        onClick={() => logMessageTagClicked({ tag: { name: LOG_CUSTOM_KEY_APPLICATION_ID, value: resolvedValue } })}
      >
        {resolvedValue}
      </Link>
    </Li>
  );
}

export function TagEntry({
  tag,
  item,
  uniqueTagName,
  tagToLabelMap,
  allowedTagsForGrouping,
  onSelectTagHref,
  getHrefToGroupedView
}: TagEntryProps) {
  const [isHovered, setIsHovered] = useState(false);
  const isContainerTag = tag.name === LOG_DOCKER_SNAPSHOT_ID;

  return (
    <>
      <Li
        className={locals.li}
        size="compact"
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
      >
        <ColumnizedContent
          columnDefinitions={columnDefinitions}
          onSelectTagHref={onSelectTagHref}
          getHrefToGroupedView={getHrefToGroupedView}
          item={item}
          tag={tag}
          tagToLabelMap={tagToLabelMap}
          allowedTagsForGrouping={allowedTagsForGrouping}
          uniqueTagName={uniqueTagName}
          isHovered={isHovered}
        />
      </Li>
      {isContainerTag && (
        <Li className={locals.sparkchartsLi} size="normal">
          <ContainerPerformanceSparkcharts snapshotId={tag.stringValue} />
        </Li>
      )}
    </>
  );
}
