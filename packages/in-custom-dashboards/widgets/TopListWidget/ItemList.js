import { compose } from 'recompose';
import React from 'react';

import { getUniqueErrors, Error } from 'in-new-components/Errors/ErroneousResultPresenter';
import { hasError, isLoading } from 'in-services/util/result';
import Skeleton from 'in-new-components/Loading/Skeleton';
import { Ul, Li } from 'in-new-components/lists/List';
import connectTo from 'in-hoc/connectTo';

import locals from './ItemList.mless';

export default compose(connectTo(({ get }) => (get ? { result: get() } : {})))(ItemList);

function ItemList({ result, columnDefinitions, timeConfig, numSkeletonRows }) {
  if (!result || isLoading(result)) {
    return <LoadingList numSkeletonRows={numSkeletonRows} columnDefinitions={columnDefinitions} />;
  }

  if (hasError(result)) {
    return <ErrorList errors={result.errors} />;
  }

  return (
    <Ul className={locals.list}>
      {result.data.items.map((item, i) => {
        return (
          <Li key={i} className={locals.listItem}>
            {columnDefinitions.map(({ width, getContent }, i) => (
              <div key={i} style={{ maxWidth: width, minWidth: width }} className={locals.column}>
                {getContent(item, { result, timeConfig })}
              </div>
            ))}
          </Li>
        );
      })}
    </Ul>
  );
}

function LoadingList({ columnDefinitions, numSkeletonRows }) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = (
      <Li key={i} className={locals.listItem}>
        {columnDefinitions.map(({ width }, i) => {
          return <Skeleton key={i} style={{ maxWidth: width, minWidth: width }} className={locals.skeleton} />;
        })}
      </Li>
    );
  }

  return <Ul className={locals.list}>{loadingRows}</Ul>;
}

function ErrorList({ errors }) {
  return (
    <Ul className={locals.list}>
      {getUniqueErrors(errors).map(error => (
        <Li key={error} className={locals.listItem}>
          <Error>{error}</Error>
        </Li>
      ))}
    </Ul>
  );
}
