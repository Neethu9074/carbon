/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { find } from 'lodash';
import React from 'react';

import { keyCodes } from '@instana/components';

import { identifyOverlay } from 'in-components/overlays/dom';
import { emptyArray } from 'in-services/fixedObjects';

const reactContainer = document.getElementById('main');
const { isModifierPressed, isEscape, isLeftClick } = keyCodes;

/**
 * The `<OverlayCloseIdentification/>` component registers your callback on the document
 * when rendered. Powers the `<Overlay/>` component. This is used achieve modal
 * style behavior where your callback is triggered when the user tries to
 * interact with the rest of the document or hits the `esc` key.
 */
export default class OverlayCloseIdentification extends React.Component {
  constructor(props) {
    super(props);
    this.closeFunctionsToExecute = emptyArray;
  }

  componentDidMount() {
    // Use capture for this listener so it fires before React's listener, to
    // avoid false positives in the contains() check below if the target DOM
    // element is removed in the React mouse callback.
    //
    // We need to attach the click event listener to the React root node in
    // order to avoid conflicts with React's event delegation system.
    // Also see:
    // https://reactjs.org/blog/2020/10/20/react-v17.html#changes-to-event-delegation
    // https://instana.kanbanize.com/ctrl_board/103/cards/66722/details
    reactContainer.addEventListener('click', this.handleMouseCapture, true);
    reactContainer.addEventListener('click', this.handleMouse);
    document.documentElement.addEventListener('keyup', this.handleKeyUp);
  }

  componentWillUnmount() {
    reactContainer.removeEventListener('click', this.handleMouseCapture, true);
    reactContainer.removeEventListener('click', this.handleMouse);
    document.documentElement.removeEventListener('keyup', this.handleKeyUp);
  }

  handleMouseCapture = e => {
    this.closeFunctionsToExecute = [];

    if (isModifierPressed(e) || !isLeftClick(e)) {
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
    if (isEscape(e)) {
      this.props.overlays.slice().forEach(o => o.parentOverlay == null && o.close(e));
    }
  };

  render() {
    return null;
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
