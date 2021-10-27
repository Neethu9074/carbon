/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

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

export default function ViewTrackingMeta(props: Props) {
  useSideEffect(props);
  return null;
}
