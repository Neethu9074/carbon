/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { compose } from 'recompose';
import React from 'react';

import { ColumnizedContent, Ul, Li } from '@instana/components';

import LoadingList from 'in-new-components/lists/List/sharedComponents/LoadingList';
import ErrorList from 'in-new-components/lists/List/sharedComponents/ErrorList';
import { hasError, isLoading } from 'in-services/util/result';
import connectTo from 'in-hoc/connectTo';

import locals from './ItemList.mless';

export default compose(connectTo(({ get }) => (get ? { result: get() } : {})))(ItemList);

function ItemList({ result, columnDefinitions, timeConfig, getItemLink, numSkeletonRows }) {
  if (!result || isLoading(result)) {
    return <LoadingList className={locals.list} numSkeletonRows={numSkeletonRows} />;
  }
  if (hasError(result)) {
    return <ErrorList className={locals.list} errors={result.errors} />;
  }

  return (
    <Ul className={locals.list}>
      {result.data.items.map((item, rowIndex) => (
        <Li key={rowIndex} href$={getItemLink(item)}>
          <ColumnizedContent
            columnDefinitions={columnDefinitions}
            item={item}
            result={result}
            timeConfig={timeConfig}
          />
        </Li>
      ))}
    </Ul>
  );
}
