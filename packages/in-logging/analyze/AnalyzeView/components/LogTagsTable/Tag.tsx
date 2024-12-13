/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { CarbonContainedListItem, IconButton, Link } from '@instana/components';
import { LogTag, TagFilter } from '@instana/types';
import { useObservable } from '@instana/hooks';

import {
  ApplicationsListTag,
  createGroupingTag,
  createTagFilter,
  EntityHealthIcon,
  GetContentType,
  getSnapshotId,
  LogFilePathTag,
  ResolvedLinkProps,
  TagEntryProps,
  TagGroupHeaderProps,
  trackFilterClick,
  trackGroupClick
} from 'in-logging/analyze/AnalyzeView/components/LogTagsTable';
import useResolvedValue, {
  longValues,
  resolveInfraLabel
} from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedValue';
import ContainerPerformanceSparkcharts from 'in-logging/analyze/AnalyzeView/components/ContainerPerformanceSparkcharts';
import { containerSnapshotIds, ID_HOST, LOG_CUSTOM_KEY_APPLICATION_IDS, LOG_FILE_PATH } from 'in-logging/queryBuilder';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedName';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/hooks/useResolvedLink';
import { ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED } from 'in-services/tracking/eventNames';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import { useNavigation } from 'in-stores/navigation/hooks/useNavigation';
import CopyToClipboard from 'in-components/CopyToClipboard';
import Tooltip from 'in-components/Tooltip';
import { t } from 'in-i18n';

import locals from 'in-logging/analyze/AnalyzeView/components/LogTagsTable.mless';

export function Actions({
  allowedTagsForGrouping,
  getHrefToGroupedView,
  tag,
  resolvedValue,
  onSelectTagHref,
  uniqueTagName,
  item
}: GetContentType) {
  const { trackCta } = useSegmentTracking();
  const { location, navigate } = useNavigation();

  const iconColor = 'var(--ids-color-option-neutral-900)';
  const value = !longValues.includes(uniqueTagName) ? tag.stringValue || '' : tag.longValue || 0;

  return (
    <div className={locals.actions}>
      {allowedTagsForGrouping?.has(tag.name || '') && getHrefToGroupedView && (
        <Tooltip align={'bottomRight'} content={t('in-logging:tooltipAddAsGroup')}>
          <IconButton
            id="group-action"
            color={iconColor}
            iconSize={'xs'}
            type="lib_group_by"
            onClick={() => {
              location.pathname += getHrefToGroupedView(createGroupingTag(tag.name, tag.key));
              trackGroupClick(trackCta, resolvedValue);
              navigate(location);
            }}
          />
        </Tooltip>
      )}
      {onSelectTagHref && (
        <Tooltip align={'bottomRight'} content={t('in-logging:tooltipAddAsFilter')}>
          <IconButton
            id="filter-action"
            color={iconColor}
            iconSize={'xs'}
            type="lib_actions_filter"
            onClick={() => {
              location.pathname += onSelectTagHref(createTagFilter(value, item.tags, tag.name, tag.key) as TagFilter);
              trackFilterClick(trackCta, tag, value);
              navigate(location);
            }}
          />
        </Tooltip>
      )}
      <Tooltip align={'bottomRight'} content={t('in-logging:tooltipCopyToClipboard')}>
        <CopyToClipboard getText={() => resolvedValue}>
          {copyToClipboardRef => (
            <IconButton
              id="copy-action"
              color={iconColor}
              ref={copyToClipboardRef}
              iconSize={'xs'}
              type="lib_actions_copy"
            />
          )}
        </CopyToClipboard>
      </Tooltip>
    </div>
  );
}

export function TagName({ tag, tagToLabelMap }: TagEntryProps) {
  const name = useResolvedName(tag, tagToLabelMap);

  return <span data-testid="log-tag-label">{name}</span>;
}

export function TagValue({ tag, uniqueTagName, resolvedValue, item }: GetContentType) {
  const entitySnapshotId = getSnapshotId(tag, item);

  return (
    <div data-testid="log-tag-value" className={locals.tagValue}>
      {entitySnapshotId && <EntityHealthIcon snapshotId={entitySnapshotId} />}
      <ResolvedLink tag={tag} item={item} resolvedValue={resolvedValue} uniqueTagName={uniqueTagName} />
    </div>
  );
}

function ResolvedLink({ uniqueTagName, resolvedValue, tag, item }: ResolvedLinkProps) {
  const idHostStringValue = item.tags.find(tag => tag.name === ID_HOST)?.stringValue as string;
  const isApplicationsTag = tag.key === LOG_CUSTOM_KEY_APPLICATION_IDS;
  const isLogFilePathTag = tag.name === LOG_FILE_PATH;
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
  const { trackCta } = useSegmentTracking();
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
        href={resolvedLink}
        onClick={() =>
          trackCta(ANALYZE_LOGGING_LOG_MESSAGE_TAG_CLICKED, {
            tag: { name: tag.name, value: resolvedValue, key: tag.key }
          })
        }
      >
        {resolvedValue}
      </Link>
    );
  }

  return <span>{resolvedValue}</span>;
}

export const TagGroupHeader = ({ groupLabel }: TagGroupHeaderProps) => {
  return (
    <CarbonContainedListItem className={locals.groupHeader}>
      <strong>{groupLabel}</strong>
    </CarbonContainedListItem>
  );
};

export function TagEntry(props: TagEntryProps) {
  const { tag, item, uniqueTagName, tagToLabelMap, allowedTagsForGrouping, onSelectTagHref, getHrefToGroupedView } =
    props;

  const [isHovered, setIsHovered] = useState(false);
  const isContainerTag = containerSnapshotIds.includes(tag.name as string);
  const resolvedValue = useResolvedValue(uniqueTagName, tag);

  const handleHover = {
    onMouseEnter: () => setIsHovered(true),
    onMouseLeave: () => setIsHovered(false)
  };

  const TagActions = (
    <Actions
      onSelectTagHref={onSelectTagHref}
      item={item}
      tag={tag}
      allowedTagsForGrouping={allowedTagsForGrouping}
      resolvedValue={resolvedValue}
      uniqueTagName={uniqueTagName}
      getHrefToGroupedView={getHrefToGroupedView}
    />
  );

  return (
    <CarbonContainedListItem {...handleHover}>
      <div className={locals.tagContent}>
        <TagName uniqueTagName={uniqueTagName} tag={tag} item={item} tagToLabelMap={tagToLabelMap} />
        <TagValue resolvedValue={resolvedValue} item={item} tag={tag} uniqueTagName={uniqueTagName} />
        {isContainerTag && (
          <div className={locals.sparkcharts}>
            <ContainerPerformanceSparkcharts snapshotId={tag.stringValue} />
          </div>
        )}
        {isHovered && TagActions}
      </div>
    </CarbonContainedListItem>
  );
}
