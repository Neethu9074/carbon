import React, { Fragment } from 'react';
import { compose } from 'recompose';

import { getUniqueErrors, Error } from 'in-new-components/Errors/ErroneousResultPresenter';
import { evaluateClassNames } from 'in-services/util/classnames';
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
    <div className={locals.grid}>
      {result.data.items.map((item, i) => {
        return (
          <Fragment key={i}>
            {columnDefinitions.map(({ column, ellipsis, getContent }, i2) => (
              <Cell
                key={`${i}_${i2}`}
                column={column}
                ellipsis={ellipsis}
                firstCellInRow={i2 === 0}
                inOddRow={i % 2 === 1}
                isLastRow={i === result.data.items.length - 1}
              >
                {getContent(item, { result, timeConfig })}
              </Cell>
            ))}
          </Fragment>
        );
      })}
    </div>
  );
}

export function Cell({ children, column, ellipsis, firstCellInRow, inOddRow, isLastRow }) {
  return (
    <div
      style={{ gridColumn: column, overflow: ellipsis && 'hidden' }}
      className={evaluateClassNames({
        [locals.cell]: true,
        [locals.firstCellInRow]: firstCellInRow,
        [locals.cellOfOddRow]: inOddRow,
        [locals.cellOfLastRow]: isLastRow
      })}
    >
      {children}
    </div>
  );
}

function LoadingList({ numSkeletonRows }) {
  const loadingRows = [];
  for (let i = 0; i < numSkeletonRows; i++) {
    loadingRows[i] = <LoadingListItem key={i} />;
  }

  return <Ul className={locals.list}>{loadingRows}</Ul>;
}

function LoadingListItem() {
  return (
    <Li>
      <Skeleton className={locals.skeleton} />
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

function ErrorListItem({ errors }) {
  const error = getUniqueErrors(errors)[0];
  return (
    <Li key={error}>
      <Error>{error}</Error>
    </Li>
  );
}
