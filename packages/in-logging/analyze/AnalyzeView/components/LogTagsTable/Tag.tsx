/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';
import classNames from 'classnames';

import { ColumnizedContent, IconButton, Li, Link } from '@instana/components';
import { LogTag, TagFilter } from '@instana/types';
import { formatDate } from '@instana/format-date';
import { useObservable } from '@instana/hooks';

import {
  ApplicationsListTag,
  columnDefinitions,
  createGroupingTag,
  createTagFilter,
  EntityHealthDot,
  GetContentType,
  getSnapshotId,
  LogFilePathTag,
  ResolvedLinkProps,
  TagEntryProps,
  TagGroupHeaderProps,
  trackFilterClick,
  trackGroupClick
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import {
  containerSnapshotIds,
  ID_HOST,
  LOG_CUSTOM_KEY_APPLICATION_IDS,
  LOG_FILE_PATH,
  LOG_RETENTION_TIME
} from 'in-logging/queryBuilder';
import ContainerPerformanceSparkcharts from 'in-logging/analyze/AnalyzeView/components/ContainerPerformanceSparkcharts';
import useResolvedValue, { resolveInfraLabel } from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedValue';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedName';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedLink';
import { logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import CopyToClipboard from 'in-components/CopyToClipboard';
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
  const iconColor = 'var(--ids-color-option-neutral-900)';

  const { location, navigate } = useNavigation();

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
              <IconButton
                color={iconColor}
                iconSize={'xs'}
                type="lib_group_by"
                onClick={() => {
                  location.pathname += getHrefToGroupedView(createGroupingTag(tag.name, tag.key));
                  trackGroupClick(resolvedValue);
                  navigate(location);
                }}
                className={locals.squareHover}
              />
            </Tooltip>
          )}
          {onSelectTagHref && (
            <Tooltip content={t('in-logging:tooltipAddAsFilter')}>
              <IconButton
                color={iconColor}
                iconSize={'xs'}
                type="lib_actions_filter"
                onClick={() => {
                  location.pathname += onSelectTagHref(
                    createTagFilter(value, item.tags, tag.name, tag.key) as TagFilter
                  );
                  trackFilterClick(tag, value);
                  navigate(location);
                }}
                className={locals.squareHover}
              />
            </Tooltip>
          )}
          <Tooltip content={t('in-logging:tooltipCopyToClipboard')}>
            <CopyToClipboard getText={() => resolvedValue}>
              {copyToClipboardRef => (
                <IconButton
                  color={iconColor}
                  className={locals.squareHover}
                  ref={copyToClipboardRef}
                  iconSize={'xs'}
                  type="lib_actions_copy"
                />
              )}
            </CopyToClipboard>
          </Tooltip>
        </div>
      )}
    </div>
  );
}

function ResolvedLink({ uniqueTagName, resolvedValue, tag, item }: ResolvedLinkProps) {
  const idHostStringValue = item.tags.find(tag => tag.name === ID_HOST)?.stringValue as string;
  const isApplicationsTag = tag.key === LOG_CUSTOM_KEY_APPLICATION_IDS;
  const isLogFilePathTag = tag.name === LOG_FILE_PATH;
  const isExpirationTime = tag.name === LOG_RETENTION_TIME;
  const expirationValue = tag.longValue && timestampToLocaleDate(tag.longValue);
  const hostTag = item.tags.find(tag => tag.name === ID_HOST) as LogTag;

  //As long as we have to put the link and the name of the Log Id Host, we are faking the tag name and the tag object
  //to the hooks for getting the correct name and the correct link, only when we are facing the log.file.path tagRow
  const universalTagName = uniqueTagName === LOG_FILE_PATH ? ID_HOST : uniqueTagName;
  const universalTag = uniqueTagName === LOG_FILE_PATH ? hostTag : tag;

  const resolveIdHostLink = resolveInfraLabel(idHostStringValue || '');
  const resolvedLogTagName = useObservable(resolveIdHostLink, [idHostStringValue], {
    resetStateOnObservableChange: true
  });

  const resolvedLink = useResolvedLink(universalTagName, universalTag, item);

  if (isApplicationsTag) {
    return <ApplicationsListTag resolvedValue={resolvedValue} stringValue={tag.stringValue} item={item} />;
  }

  if (isLogFilePathTag && resolvedLogTagName) {
    return (
      <LogFilePathTag
        resolvedLink={resolvedLink}
        resolvedValue={resolvedValue}
        resolvedLogTagName={resolvedLogTagName}
        tag={tag}
      />
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

  return <span className={locals.value}>{!isExpirationTime ? resolvedValue : expirationValue}</span>;
}

export const TagGroupHeader = ({ groupLabel }: TagGroupHeaderProps) => {
  return (
    <Li className={locals.liGroup} size="compact">
      <strong>{groupLabel}</strong>
    </Li>
  );
};

export function TagEntry(props: TagEntryProps) {
  const { tag, item, uniqueTagName, tagToLabelMap, allowedTagsForGrouping, onSelectTagHref, getHrefToGroupedView } =
    props;
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

const timestampToLocaleDate = (timestamp: number) => {
  const timestampDate = new Date(timestamp * 1000);
  return formatDate(timestampDate);
};
