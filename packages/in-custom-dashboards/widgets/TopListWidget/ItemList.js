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
    return <LoadingList numSkeletonRows={numSkeletonRows} />;
  }
  if (hasError(result)) {
    return <ErrorList errors={result.errors} />;
  }

  return (
    <Ul className={locals.list}>
      {result.data.items.map((item, i) => {
        return (
          <Li key={i} className={locals.listItem}>
            {columnDefinitions.map(({ column, getContent }, i) => (
              <div key={i} style={{ gridColumn: column }} className={locals.column}>
                {getContent(item, { result, timeConfig })}
              </div>
            ))}
          </Li>
        );
      })}
    </Ul>
  );
}

function LoadingList({ numSkeletonRows }) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = <LoadingListItem key={i} />;
  }

  return <Ul className={locals.list}>{loadingRows}</Ul>;
}

export function LoadingListItem() {
  return (
    <Li className={locals.listItem}>
      <div style={{ gridColumn: '1 / span 9' }}>
        <Skeleton className={locals.skeleton} />
      </div>
    </Li>
  );
}

function ErrorList({ errors }) {
  return (
    <Ul className={locals.list}>
      <ErrorListItem errors={errors} />
    </Ul>
  );
}

export function ErrorListItem({ errors }) {
  const error = getUniqueErrors(errors)[0];
  return (
    <Li key={error} className={locals.listItem}>
      <div style={{ gridColumn: '1 / span 9' }}>
        <Error>ERROR</Error>
      </div>
    </Li>
  );
}
