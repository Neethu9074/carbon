/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';
import React from 'react';

import { identifyOverlay } from 'in-new-components/overlays/dom';
import { emptyArray } from 'in-services/fixedObjects';
import keyCodes from 'in-components/keyCodes';

/**
 * The `<CloseWrapper/>` component registers your callback on the document
 * when rendered. Powers the `<Overlay/>` component. This is used achieve modal
 * style behavior where your callback is triggered when the user tries to
 * interact with the rest of the document or hits the `esc` key.
 */
export default class CloseWrapper extends React.Component {
  constructor(props) {
    super(props);
    this.closeFunctionsToExecute = emptyArray;
  }

  componentDidMount() {
    // Use capture for this listener so it fires before React's listener, to
    // avoid false positives in the contains() check below if the target DOM
    // element is removed in the React mouse callback.
    document.documentElement.addEventListener('click', this.handleMouseCapture, true);
    document.documentElement.addEventListener('click', this.handleMouse);
    document.documentElement.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    document.documentElement.removeEventListener('click', this.handleMouseCapture, true);
    document.documentElement.removeEventListener('click', this.handleMouse);
    document.documentElement.removeEventListener('keyup', this.handleKeyUp);
  }

  handleMouseCapture = e => {
    this.closeFunctionsToExecute = [];

    if (keyCodes.isModifierPressed(e) || !keyCodes.isLeftClick(e)) {
      return;
    }

    const clickedOverlayElement = identifyOverlay(e.target);
    if (clickedOverlayElement == null) {
      // fast path: Clicking outside of all overlays must close all overlays
      this.closeFunctionsToExecute = this.props.overlays.filter(o => o.parentOverlay == null).map(o => o.close);
      return;
    }

    // hard path: Anaylse in what overlay the user clicked and then find all the parent overlays so that
    // we can keep them open. Close all other overlays
    const clickedOverlayId = clickedOverlayElement.dataset.overlayId;
    const overlaysToRetain = getAllOverlaysForWhichToRetainVisibility(this.props.overlays, clickedOverlayId);

    this.closeFunctionsToExecute = this.props.overlays
      .filter(o => overlaysToRetain.indexOf(o.id) === -1)
      .map(o => o.close);
  };

  handleMouse = e => {
    const toClose = this.closeFunctionsToExecute;
    this.closeFunctionsToExecute = emptyArray;
    toClose.filter(o => o.parentOverlay == null).forEach(f => f(e));
  };

  handleKeyUp = e => {
    if (e.keyCode === keyCodes.escape) {
      this.props.overlays.slice().forEach(o => o.parentOverlay == null && o.close(e));
    }
  };

  render() {
    return this.props.children;
  }
}

function getAllOverlaysForWhichToRetainVisibility(overlays, startOverlayId) {
  const result = [];

  let idToRetain = startOverlayId;
  while (idToRetain) {
    const overlay = find(overlays, o => o.id === idToRetain);
    if (overlay != null) {
      result.push(overlay.id);
      idToRetain = overlay.parentOverlay;
    } else {
      idToRetain = null;
    }
  }

  return result;
}
