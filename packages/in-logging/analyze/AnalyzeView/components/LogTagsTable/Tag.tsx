/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { ColumnizedContent, Li, Link, Ul } from '@instana/components';
import { useObservable } from '@instana/hooks';
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
  createTagFilter,
  getSnapshotId,
  trackFilterClick,
  trackGroupClick
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/utils';
import {
  containerSnapshotIds,
  LOG_CUSTOM_KEY_APPLICATION_ID,
  LOG_CUSTOM_KEY_APPLICATION_IDS
} from 'in-logging/queryBuilder';
import ContainerPerformanceSparkcharts from 'in-logging/analyze/AnalyzeView/components/ContainerPerformanceSparkcharts';
// @ts-expect-error needs TS migration
import { getHealthInfoAtFocusedMoment } from 'in-stores/events';
import { columnDefinitions } from 'in-logging/analyze/AnalyzeView/components/LogTagsTable/constants';
import useResolvedValue from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedValue';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedName';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedLink';
import { logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import IconLink from 'in-components/IconButton/IconLink';
import HealthDot from 'in-components/health/HealthDot';
import Overlay from 'in-components/overlays/Overlay';
import Header from 'in-components/Dialog/Header';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

export function TagName({ tag, tagToLabelMap }: TagEntryProps) {
  const name = useResolvedName(tag, tagToLabelMap);

  return <span className={locals.tagName}>{name}</span>;
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
  const entitySnapshotId = getSnapshotId(tag, item);

  return (
    <div className={locals.tagValue}>
      <div className={locals.tagLink}>
        {entitySnapshotId && <EntityHealthDot snapshotId={entitySnapshotId} />}
        <ResolvedLink tag={tag} item={item} resolvedValue={resolvedValue} uniqueTagName={uniqueTagName} />
      </div>
      {isHovered && tag.key !== LOG_CUSTOM_KEY_APPLICATION_IDS && (
        <div className={locals.tagActions}>
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
                href={onSelectTagHref(createTagFilter(value, item.tags, tag.name, tag.key) as TagFilter)}
                onClick={() => trackFilterClick(tag, value)}
              />
            </Tooltip>
          )}
          <Tooltip content={t('in-logging:tooltipCopyToClipboard')}>
            <CopyToClipboard getText={() => resolvedValue}>
              {copyToClipboardRef => <IconButton ref={copyToClipboardRef} iconSize={'xs'} type="lib_actions_copy" />}
            </CopyToClipboard>
          </Tooltip>
        </div>
      )}
    </div>
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
  const isContainerTag = containerSnapshotIds.includes(tag.name as string);

  return (
    <>
      <Li
        className={classNames(locals.li, isContainerTag && locals.sparkchartsLi)}
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
        {isContainerTag && (
          <>
            <div className={locals.break} />
            <div className={locals.sparkcharts}>
              <ContainerPerformanceSparkcharts snapshotId={tag.stringValue} />
            </div>
          </>
        )}
      </Li>
    </>
  );
}

function EntityHealthDot({ snapshotId }: { snapshotId: string }) {
  const snapshot = useObservable<Map<string, string | number>, []>(getHealthInfoAtFocusedMoment(snapshotId), []);

  if (!snapshot) return null;

  const severity = snapshot.get('maxSeverity') as number | undefined;
  const numberOfIssues = snapshot.get('numberOfOpenEvents');
  const tooltipText =
    numberOfIssues === 0
      ? t('in-logging:tooltipEntityHealthNoIssues')
      : t('in-logging:tooltipEntityHealthIssues', { numberOfIssues });

  return (
    <Tooltip align="leftMiddle" delay={300} content={tooltipText}>
      <div>
        <HealthDot severity={severity} />
      </div>
    </Tooltip>
  );
}
