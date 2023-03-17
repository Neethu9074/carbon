/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import { ColumnizedContent, Li, Ul } from '@instana/components';

import LoadingList from 'in-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';
import unwrapLink from 'in-stores/navigation/unwrapLink';

import locals from './ItemList.mless';

export default function ItemList({ result, columnDefinitions, timeConfig, getItemLink, numSkeletonRows }) {
  if (!result || isLoading(result)) {
    return <LoadingList className={locals.list} numSkeletonRows={numSkeletonRows} />;
  }
  if (hasError(result)) {
    return <ErrorList className={locals.list} errors={result.errors} />;
  }

  return (
    <Ul className={locals.list}>
      {result.data?.items.map((item, rowIndex) => {
        const { href, href$ } = unwrapLink(getItemLink(item));

        return (
          <Li key={rowIndex} href$={href$} href={href}>
            <ColumnizedContent
              columnDefinitions={columnDefinitions}
              item={item}
              result={result}
              timeConfig={timeConfig}
            />
          </Li>
        );
      })}
    </Ul>
  );
}
