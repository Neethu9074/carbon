import React from 'react';

import ErroneousResultPresenter from 'in-new-components/Errors/ErroneousResultPresenter';
import Skeleton from 'in-new-components/Loading/Skeleton';
import connectTo from 'in-hoc/connectTo';

import locals from './ServerTreeMap.mless';

export default connectTo(
  ({ getTreeMap$ }) => ({
    result: getTreeMap$()
  }),
  function ServerTreeMap({ result, customHeigt, TreeMapRenderer, treeMapRendererProps }) {
    const isLoading = result.progress.loading;
    if (isLoading) {
      return <Skeleton style={{ height: customHeigt }} className={locals.skeletonTreeMap} />;
    }

    const hasErrors = result.errors.length > 0;
    if (hasErrors) {
      return <ErroneousResultPresenter errors={result.errors} />;
    }

    return <TreeMapRenderer {...treeMapRendererProps} data={mapData(result.data)} />;
  }
);

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
