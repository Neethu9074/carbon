/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import PageTracker from 'in-services/tracking/segment/PageTracker';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { setMeta } from 'in-services/tracking/tracking';
import { emptyObject } from 'in-services/fixedObjects';

interface Props {
  data: any;
}

const useSideEffect = createSideEffectHook(
  (propsList: Props[]) =>
    propsList.reduce(
      (result, props) => ({
        ...result,
        ...props.data
      }),
      emptyObject
    ),
  setMeta
);

export default function ViewTrackingMeta({ data }: Props) {
  const { productArea, pageRootName } = data;
  if (productArea && pageRootName) {
    PageTracker({
      parentProductArea: productArea,
      parentPageName: pageRootName
    });
  }
  useSideEffect(data);
  return null;
}
