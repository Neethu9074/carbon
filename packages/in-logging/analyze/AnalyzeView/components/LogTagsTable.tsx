/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import React from 'react';

import { Ul, Li, ColumnizedContent } from '@instana/components';
import { useObservable } from '@instana/hooks';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';
import IconButton from 'in-components/IconButton/IconButton';
import CopyToClipboard from 'in-components/CopyToClipboard';
import { pendingResult } from 'in-services/fixedObjects';
import getLog from 'in-logging/subscriptions/getLog';
import { LogItem, LogTag } from 'in-types';

// @ts-ignore
import locals from './LogTagsTable.mless';

interface LogTagsTableProps {
  item: LogItem;
}

interface GetContentType {
  tag: LogTag;
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
    getContent({ tag }: GetContentType) {
      const value = tag.stringValue;
      return (
        <div>
          {value}
          <CopyToClipboard getText={() => value}>
            {copyToClipboardRef => <IconButton ref={copyToClipboardRef} iconSize="s" type="lib_actions_copy" />}
          </CopyToClipboard>
        </div>
      );
    }
  }
];

export default function LogTagsTable({ item }: LogTagsTableProps) {
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
        <Li key={`${tag.name}-${tag.key}`}>
          <ColumnizedContent columnDefinitions={columnDefinitions} tag={tag} />
        </Li>
      ))}
    </Ul>
  );
}

