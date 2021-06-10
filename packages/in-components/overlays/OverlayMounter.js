/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { set } from 'in-components/overlays/overlayStore';
import { identity } from 'in-services/util/function';

const useSideEffect = createSideEffectHook(identity, set);

export default function OverlayMounter(props) {
  useSideEffect(props);
  return null;
}
