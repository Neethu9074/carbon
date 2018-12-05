import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Skeleton from 'in-new-components/Loading/Skeleton';
import TreeMap from 'in-new-components/TreeMap';

import locals from './ResultAwareTreeMap.mless';

export default function ResultAwareTreeMap({ result, customHeigt, TreeMapRenderer = TreeMap, treeMapRendererProps }) {
  const isLoading = result.progress.loading;
  if (isLoading) {
    return <Skeleton style={{ height: customHeigt }} className={locals.skeletonTreeMap} />;
  }

  const hasErrors = result.errors.length > 0;
  if (hasErrors) {
    return <ErroneousResultPresenter errors={result.errors} />;
  }

  const enrichedData = mapData(result.data);
  if (enrichedData.ids.length === 0) {
    return null;
  }

  return <TreeMapRenderer {...treeMapRendererProps} data={enrichedData} />;
}

function mapData(data) {
  const ids = [];
  addLevel(ids, 0, data.root.children);

  return {
    ids,
    treeMapData: data
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
