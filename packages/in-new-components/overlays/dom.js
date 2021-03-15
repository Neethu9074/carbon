/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { overlayClassName } from 'in-new-components/overlays/OverlayPresenter/SingleOverlayPresenter';
import { findParentNodeByClassName } from 'in-services/util/dom';

export function identifyOverlay(node) {
  return findParentNodeByClassName(node, overlayClassName);
}
