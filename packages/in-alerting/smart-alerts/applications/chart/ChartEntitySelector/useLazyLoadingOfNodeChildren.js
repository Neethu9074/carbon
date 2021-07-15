/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { useObservable } from '@instana/hooks';

import { isLoading } from 'in-services/util/result';

export default function useLazyLoadingOfNodeChildren(node, triggerRenderingAfterUpdated) {
  const loadChildren = node?.loadChildren;
  useObservable(
    loadChildren &&
      (() =>
        loadChildren().map(result => {
          const loading = isLoading(result);
          const resolvedChildren = result?.data?.items;
          if (!loading && resolvedChildren) {
            node.children = resolvedChildren;
            node.loadChildren = undefined;
            triggerRenderingAfterUpdated(node);
          }
          return result;
        })),
    [loadChildren]
  );
}
