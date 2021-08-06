/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { OverlayMounterProps } from 'in-components/overlays/Overlay/types';
import createSideEffectHook from 'in-hooks/createSideEffectHook';
import { set } from 'in-components/overlays/overlayStore';

const useSideEffect = createSideEffectHook((a: OverlayMounterProps[]) => a, set);

export default function OverlayMounter(props: OverlayMounterProps) {
  useSideEffect(props);
  return null;
}
