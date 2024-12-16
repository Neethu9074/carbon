/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React, { useMemo } from 'react';

import { timeout } from '@instana/observables';
import { useObservable } from '@instana/hooks';

import useServerTableUrlState from 'in-components/tables/ServerTable/hooks/useServerTableUrlState';
import ServerTablePresenter from 'in-components/tables/ServerTable/ServerTablePresenter';
import { emptyArray, pendingResult } from 'in-services/fixedObjects';

import locals from './ServerTablePresenter.mless';

export default function createServerTableWithUrlState({
  paginationResettingUrlParameters = emptyArray,
  columnDefinitions: staticColumnDefinitions,
  defaultOrderBy,
  defaultOrderDirection,
  defaultPageSize,
  defaultPageSizes,
  defaultQuery,
  defaultDisabledColumns,
  settingsKey,
  pathSegment,
  matrixPrefix = '',
  isSearchable = true,
  Renderer = ServerTablePresenter
}) {
  return function ServerTable(props) {
    const [urlState, setUrlState] = useServerTableUrlState({
      pathSegment,
      matrixPrefix,
      settingsKey,
      defaultOrderBy: defaultOrderBy ?? staticColumnDefinitions[0].id,
      defaultOrderDirection,
      defaultPageSize,
      defaultPageSizes,
      defaultQuery,
      defaultDisabledColumns,
      paginationResettingUrlParameters
    });

    const propsForObservable = useMemo(
      () => ({
        ...props,
        ...urlState
      }),
      // We use the values from the props object to only rerender if specific values changing
      // eslint-disable-next-line react-hooks/exhaustive-deps
      [...Object.values(props), urlState]
    );

    const observable =
      props.query?.length > 0
        ? timeout(800).flatMap(() => props.get(propsForObservable))
        : props.get(propsForObservable);

    const result = useObservable(observable, [propsForObservable]) ?? pendingResult;

    const resultPrecision = result?.resultPrecisionDetails?.resultPrecision;

    const columnDefinitions =
      useObservable(props.columnDefinitions && props.columnDefinitions({ ...propsForObservable, result }), [
        propsForObservable,
        result
      ]) ?? (props.columnDefinitions ? emptyArray : staticColumnDefinitions);

    const optionalColumns = useMemo(
      () => columnDefinitions.filter(columnDefinition => columnDefinition.optional),
      [columnDefinitions]
    );
    const totalHits = result?.data?.totalHits;
    const leftHeader = (title, totalHits, result) => {
      if (totalHits === 0 || result?.progress?.loading) {
        return <h1 className={locals.title}>{title} </h1>;
      }
      return (
        <h1 className={locals.title}>
          {title} ({totalHits})
        </h1>
      );
    };
    const rendererProps = {
      ...propsForObservable,
      result,
      columnDefinitions,
      isSearchable,
      optionalColumns,
      onChange: setUrlState,
      resultPrecision
    };

    return (
      <Renderer
        leftHeader={props.showHeaderCount ? leftHeader(props.title, totalHits, result) : undefined}
        {...rendererProps}
      />
    );
  };
}
