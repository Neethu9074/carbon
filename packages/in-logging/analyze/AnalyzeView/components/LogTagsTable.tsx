/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Link, Stack, Ul, Li, ColumnizedContent } from '@instana/components';
import { useObservable } from '@instana/hooks';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import { logMessageTagClicked } from 'in-logging/analyze/AnalyzeView/tracker';
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
  onSelectTagHref: OnSelectTagHref;
}

const columnDefinitions = [
  {
    id: 'name',
    width: '30%',
    getContent({ tag }: GetContentType) {
      return <div>{tag.name}</div>;
    }
  },
  {
    id: 'value',
    getContent({ tag, onSelectTagHref }: GetContentType) {
      const value = tag.stringValue ?? '';
      return (
        <Stack direction="horizontal" gap="xxsmall" align="center" distribution="spaceBetween">
          {canBeResolved(tag) ? (
            <Link href="#" onClick={() => logMessageTagClicked({ name: tag.name, value, key: tag.key })}>
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
              onClick={() => logMessageTagClicked({ name: tag.name, value, key: tag.key })}
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
      {tags.map(tag => (
        <Li key={`${tag.name}-${tag.key}`} size="compact">
          {/* will be fixed with https://github.com/instana/ui-foundation/pull/168 */}
          {/* @ts-ignore */}
          <ColumnizedContent columnDefinitions={columnDefinitions} tag={tag} onSelectTagHref={onSelectTagHref} />
        </Li>
      ))}
    </Ul>
  );
}

function canBeResolved(tag: LogTag): boolean {
  return true;
}
