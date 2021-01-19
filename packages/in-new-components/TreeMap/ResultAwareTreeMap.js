/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { get } from 'lodash';
import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import NoDataAvailable from 'in-new-components/Errors/NoDataAvailable';
import Skeleton from 'in-new-components/Loading/Skeleton';
import TreeMap from 'in-new-components/TreeMap';

import locals from './ResultAwareTreeMap.mless';

export default function ResultAwareTreeMap({
  result,
  customHeigt = 300,
  TreeMapRenderer = TreeMap,
  treeMapRendererProps
}) {
  const isLoading = result.progress.loading;
  if (isLoading) {
    return <Skeleton style={{ height: customHeigt }} className={locals.skeletonTreeMap} />;
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  if (get(result.data, ['root', 'children', 'length']) === 0) {
    return <NoDataAvailable height={customHeigt} />;
  }

  return <TreeMapRenderer {...treeMapRendererProps} data={addIds(result.data)} />;
}

function addIds(data) {
  const ids = [];
  addLevel(ids, 0, data.root.children);

  return {
    ids,
    root: data.root
  };
}

function addLevel(ids, i, children) {
  if (!children) {
    return;
  }

  for (let index = 0; index < children.length; index++) {
    const child = children[index];
    if (!ids[i]) {
      ids[i] = [];
    }
    ids[i].push(child.id);
    addLevel(ids, i + 1, child.children);
  }
}
