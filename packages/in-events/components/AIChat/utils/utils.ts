/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { getViewTrackingMetaData } from 'in-components/ViewTrackingMeta';
import { eventTracker } from 'in-services/tracking/segment/EventTracker';
import { CTA_CLICKED } from 'in-services/util/constants';
import { track } from 'in-services/tracking/trackers';
import { user } from 'in-stores/user';

// This is the defined tag name used by the AI Chat
export const AI_CHAT_TAG_NAME = 'cds-aichat-react';

// Constants for launcher button
export const LAUNCHER_BUTTON_ID = 'aiChatLauncher';
export const DRAGGABLE_ICON = 'aiChatDraggableIcon';

/**
 * Handle tracking for a specific element click.
 * @param {string} trackingName - The name of the tracking event.
 * @param {Object} additionalData - Optional for passing in data
 */
export function handleTracking(trackingName: string, additionalData?: Object): void {
  const { pageRootName, productArea } = getViewTrackingMetaData();
  if (pageRootName && productArea) {
    const data = {
      parentPageName: pageRootName,
      parentPageCategory: productArea,
      CTA: trackingName,
      path: location.hash,
      ...(additionalData || {})
    };
    eventTracker({ data, segmentEventName: CTA_CLICKED });
  }
  track(trackingName, { author: user?.preferredName || '' });
}

/**
 * Helper function when needing to reposition the launcher icon
 * @param pixel - The right position in pixels
 */
export function moveAIChatLauncher(pixel: string): void {
  const launcherIcon = document.getElementById(LAUNCHER_BUTTON_ID);
  if (launcherIcon) {
    launcherIcon.style.right = pixel;
  }
}

/**
 * Set up drag listener for the AI Chat header
 */
export function setDragListener() {
  const elements = document.getElementsByTagName(AI_CHAT_TAG_NAME);
  const selector = '.WACBotContainer .WACHeader__CenterContainer';
  if (elements.length !== 1) {
    return;
  }
  const movable = elements[0].shadowRoot?.getElementById('WACWidget');
  const AIChatHeader = elements[0].shadowRoot?.querySelector(selector);
  if (!AIChatHeader || !movable) {
    // If page loads with chat closed
    return;
  }
  if (AIChatHeader.getAttribute('data-draggable-event')) {
    // Subsequent "window:open" events do not need to do anything here
    return;
  }
  AIChatHeader.setAttribute('data-draggable-event', 'true');
  movable.style.right = `32px`;
  movable.style.bottom = `32px`;
  AIChatHeader.addEventListener('pointerdown', (e: Event) => {
    const pointerEvent = e as PointerEvent;
    // Used for mouse movement delta
    const initialX = pointerEvent.clientX;
    const initialY = pointerEvent.clientY;

    // Initial location of chat window
    const offsetX = parseInt(movable.style.right);
    const offsetY = parseInt(movable.style.bottom);

    // We need to remove the slide up animation in order to drag vertically.
    // If the user closes the chat window and reopens it, the animation will be re-added
    const upAnimation = movable.getAnimations()[0];
    if (upAnimation) {
      upAnimation.cancel();
    }

    const onPointerMove = (moveEvent: Event) => {
      const pointerMoveEvent = moveEvent as PointerEvent;
      movable.style.right = `${initialX - pointerMoveEvent.clientX + offsetX}px`;
      movable.style.bottom = `${initialY - pointerMoveEvent.clientY + offsetY}px`;
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  });
}

/**
 * Make an element draggable
 * @param element - The element to make draggable
 */
export function dragElement(element: HTMLElement): void {
  let pos1 = 0,
    pos2 = 0,
    pos3 = 0,
    pos4 = 0;

  const dragMouseDown = (e: MouseEvent) => {
    e = e || window.event;
    e.preventDefault();
    // Get position on start and call function on move
    pos3 = e.clientX;
    pos4 = e.clientY;
    document.onmouseup = closeDragElement;
    document.onmousemove = elementDrag;
  };

  const elementDrag = (e: MouseEvent) => {
    e = e || window.event;
    e.preventDefault();
    // Determine new cursor position and then
    // set the elements position
    pos1 = pos3 - e.clientX;
    pos2 = pos4 - e.clientY;
    pos3 = e.clientX;
    pos4 = e.clientY;
    // Move the Launcher button location
    const newElem = document.getElementById(LAUNCHER_BUTTON_ID);
    if (!newElem) return;

    // These if else statements help keep the launcher from being
    // dragged OUTSIDE of the screen view.
    if (e.clientY < 55) {
      // Top of the screen
      newElem.style.top = '0px';
    } else if (e.clientY > window.innerHeight - 5) {
      // Bottom of the screen
      newElem.style.top = window.innerHeight - 57 + 'px';
    } else {
      // All other positions
      newElem.style.top = newElem.offsetTop - pos2 + 'px';
    }
    if (e.clientX > window.innerWidth - 25) {
      // Right of the screen
      newElem.style.left = window.innerWidth - 57 + 'px';
    } else if (newElem.offsetLeft - pos1 <= 0) {
      // Left of the screen
      newElem.style.left = '0px';
    } else {
      // All other positions
      newElem.style.left = newElem.offsetLeft - pos1 + 'px';
    }
    newElem.style.right = 'auto';
    newElem.style.bottom = 'auto';
  };

  const closeDragElement = () => {
    // When click is released stop moving
    document.onmouseup = null;
    document.onmousemove = null;
  };

  element.onmousedown = dragMouseDown;
}

/**
 * Set up all drag listeners for the AI Chat
 */
export function setupDragListeners(): void {
  // This timeout is needed because we need to wait for the Chat window
  // to be rendered before setting the drag listener
  setTimeout(() => {
    setDragListener();
  }, 500);

  // Drag Element will make the Ai Launcher Button Draggable across the screen
  const draggableIcon = document.getElementById(DRAGGABLE_ICON);
  if (draggableIcon) {
    dragElement(draggableIcon);

    // Simple listener to stop clicks onto the launcher
    draggableIcon.addEventListener('click', e => {
      e.stopPropagation();
    });
  }
}

/**
 * Set up custom language pack for the AI Chat
 * @param instance - The chat instance
 */
export function setupCustomLanguagePack(instance: any): void {
  const customLanguagePack = {
    ai_slug_title: ' ',
    ai_slug_description: ' '
  };
  instance.updateLanguagePack(customLanguagePack);
}
