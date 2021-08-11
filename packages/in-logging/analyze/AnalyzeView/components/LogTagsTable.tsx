/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link, Stack, Ul, Li, ColumnizedContent } from '@instana/components';
import { useObservable } from '@instana/hooks';

import { filterAdded, logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
import { getResolvedLink } from 'in-logging/analyze/AnalyzeView/components/linkResolver';
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
  presentedName: string;
  onSelectTagHref: OnSelectTagHref;
}

const columnDefinitions = [
  {
    id: 'name',
    width: '30%',
    getContent({ presentedName }: GetContentType) {
      return <div>{presentedName}</div>;
    }
  },
  {
    id: 'value',
    getContent({ tag, item, presentedName, onSelectTagHref }: GetContentType) {
      const value = tag.stringValue ?? '';
      const resolvedLink = getResolvedLink(presentedName)?.(tag, item);

      return (
        <Stack direction="horizontal" gap="xxsmall" align="center" distribution="spaceBetween">
          {resolvedLink ? (
            <Link
              className={locals.value}
              href$={resolvedLink}
              onClick={() => logMessageTagClicked({ tag: { name: tag.name, value, key: tag.key } })}
            >
              {value}
            </Link>
          ) : (
            <span className={locals.value}>{value}</span>
          )}

          <Stack direction="horizontal" gap="xxsmall" align="center">
            <IconLink
              iconSize={16}
              type="lib_actions_filter"
              href={onSelectTagHref({ name: tag.name ?? '', value, key: tag.key ?? '' })}
              onClick={() =>
                filterAdded({ source: 'log message filter button', filter: { name: tag.name, value, key: tag.key } })
              }
            />
            <CopyToClipboard getText={() => value}>
              {(copyToClipboardRef: any) => (
                <IconButton ref={copyToClipboardRef} iconSize={16} type="lib_actions_copy" />
              )}
            </CopyToClipboard>
          </Stack>
        </Stack>
      );
    }
  }
];

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
      {tags.map(tag => {
        const presentedName = getPresentedName(tag);

        return (
          <Li key={`${tag.name}-${tag.key}`} size="compact">
            <ColumnizedContent
              /* will be fixed with https://github.com/instana/ui-foundation/pull/168 */
              /* @ts-ignore */
              columnDefinitions={columnDefinitions}
              tag={tag}
              item={item}
              onSelectTagHref={onSelectTagHref}
              presentedName={presentedName}
            />
          </Li>
        );
      })}
    </Ul>
  );
}

function getPresentedName(tag: LogTag) {
  if (tag.key) {
    return `${tag.name}-${tag.key}`;
  }
  return tag.name;
}
