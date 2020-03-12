import { compose } from 'recompose';
import React from 'react';

import { getUniqueErrors, Error } from 'in-new-components/Errors/ErroneousResultPresenter';
import { hasError, isLoading } from 'in-services/util/result';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { Ul, Li } from 'in-new-components/lists/List';
import connectTo from 'in-hoc/connectTo';

import locals from './ItemList.mless';

export default compose(connectTo(({ get }) => (get ? { result: get() } : {})))(ItemList);

function ItemList({ result, columnDefinitions, timeConfig, getItemLink, numSkeletonRows }) {
  if (!result || isLoading(result)) {
    return <LoadingList numSkeletonRows={numSkeletonRows} />;
  }
  if (hasError(result)) {
    return <ErrorList errors={result.errors} />;
  }

  return (
    <Ul className={locals.list}>
      {result.data.items.map((item, rowIndex) => (
        <Li key={rowIndex} className={locals.listItem} href$={getItemLink(item)}>
          {columnDefinitions.map(({ width, ellipsis, getContent }, i2) => (
            <Cell key={i2} width={width} ellipsis={ellipsis}>
              {getContent(item, { result, timeConfig })}
            </Cell>
          ))}
        </Li>
      ))}
    </Ul>
  );
}

export function Cell({ width, children }) {
  return <div style={{ minWidth: width, flexGrow: !width && 1, overflow: !width && 'hidden' }}>{children}</div>;
}

function LoadingList({ numSkeletonRows }) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = (
      <Li key={i}>
        <Skeleton className={locals.skeleton} />
      </Li>
    );
  }

  return <Ul className={locals.list}>{loadingRows}</Ul>;
}

function ErrorList({ errors }) {
  const error = getUniqueErrors(errors)[0];
  return (
    <Ul className={locals.list}>
      <Li key={error}>
        <Error>{error}</Error>
      </Li>
    </Ul>
  );
}
