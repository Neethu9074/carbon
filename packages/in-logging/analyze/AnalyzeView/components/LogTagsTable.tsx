/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React, { useState } from 'react';

import { Link, Stack, Ul, Li, ColumnizedContent } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { filterAdded, logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import useResolvedValue from 'in-logging/analyze/AnalyzeView/components/useResolvedValue';
import useResolvedLink from 'in-logging/analyze/AnalyzeView/components/useResolvedLink';
import useResolvedName from 'in-logging/analyze/AnalyzeView/components/useResolvedName';
import { LOG_CUSTOM_KEY_SERVICE_ID, LOG_SPAN_ID } from 'in-logging/queryBuilder';
import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { ClickedTag } from 'in-logging/analyze/AnalyzeView/components/types';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';
import IconButton from 'in-components/IconButton/IconButton';
import IconLink from 'in-components/IconButton/IconLink';
// @ts-ignore
import CopyToClipboard from 'in-components/CopyToClipboard';
import { pendingResult } from 'in-services/fixedObjects';
import getLog from 'in-logging/subscriptions/getLog';
import { LogItem, LogTag } from 'in-types';

// @ts-ignore
import locals from './LogTagsTable.mless';

type OnSelectTagHref = (tag: ClickedTag) => string;
interface LogTagsTableProps {
  item: LogItem;
  onSelectTagHref: OnSelectTagHref;
}

interface GetContentType {
  tag: LogTag;
  item: LogItem;
  uniqueTagName: string;
  onSelectTagHref: OnSelectTagHref;
  isHovered: boolean;
}

const columnDefinitions = [
  {
    id: 'name',
    width: '30%',
    getContent: TagName
  },
  {
    id: 'value',
    getContent: TagValue
  }
];

const restrictedTags = new Set<string>([LOG_CUSTOM_KEY_SERVICE_ID, LOG_SPAN_ID]);

export default function LogTagsTable({ item, onSelectTagHref }: LogTagsTableProps) {
  const logResult = useObservable(() => getLog({ itemId: item.itemId }), [item.itemId]) ?? pendingResult;

  if (!logResult || isLoading(logResult)) {
    return <LoadingList numSkeletonRows={5} />;
  }
  if (hasError(logResult)) {
    return <ErrorList errors={logResult.errors} />;
  }

  const tags: LogTag[] = logResult.data?.tags;
  return (
    <Ul>
      {tags.filter(filterTag).map(tag => {
        const uniqueTagName = tag.key ? `${tag.name}-${tag.key}` : tag.name ?? '';
        return (
          <TagEntry
            key={uniqueTagName}
            uniqueTagName={uniqueTagName}
            tag={tag}
            item={item}
            onSelectTagHref={onSelectTagHref}
          />
        );
      })}
    </Ul>
  );
}

interface TagEntryProps extends LogTagsTableProps {
  tag: LogTag;
  uniqueTagName: string;
}

function TagEntry({ tag, item, uniqueTagName, onSelectTagHref }: TagEntryProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Li
      className={locals.li}
      size="compact"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <ColumnizedContent
        columnDefinitions={columnDefinitions}
        onSelectTagHref={onSelectTagHref}
        item={item}
        tag={tag}
        uniqueTagName={uniqueTagName}
        isHovered={isHovered}
      />
    </Li>
  );
}

function TagName({ tag, uniqueTagName }: GetContentType) {
  return useResolvedName(uniqueTagName, tag);
}

function TagValue({ tag, uniqueTagName, isHovered, onSelectTagHref, item }: GetContentType) {
  const value = tag.stringValue ?? '';
  const resolvedLink = useResolvedLink(uniqueTagName, tag, item);
  const resolvedValue = useResolvedValue(uniqueTagName, tag);

  return (
    <Stack direction="horizontal" gap="xxsmall" align="center" distribution="spaceBetween">
      {resolvedLink ? (
        <Link
          className={locals.value}
          href={resolvedLink}
          onClick={() => logMessageTagClicked({ tag: { name: tag.name, value: resolvedValue, key: tag.key } })}
        >
          {resolvedValue}
        </Link>
      ) : (
        <span className={locals.value}>{resolvedValue}</span>
      )}

      {isHovered && (
        <Stack direction="horizontal" gap="xxsmall" align="center">
          <IconLink
            iconSize={16}
            type="lib_actions_filter"
            href={onSelectTagHref({ name: tag.name ?? '', value, key: tag.key ?? '' })}
            onClick={() =>
              filterAdded({ source: 'log message filter button', filter: { name: tag.name, value, key: tag.key } })
            }
          />
          <CopyToClipboard getText={() => resolvedValue}>
            {(copyToClipboardRef: any) => <IconButton ref={copyToClipboardRef} iconSize={16} type="lib_actions_copy" />}
          </CopyToClipboard>
        </Stack>
      )}
    </Stack>
  );
}

function filterTag(tag: LogTag): boolean {
  return !restrictedTags.has(tag.name ?? '') && !restrictedTags.has(tag.key ?? '');
}
