/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { SvgIcon, CarbonButton } from '@instana/components';
import { ChatContainer } from '@instana/ai-chat';

import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
import TableChartSwitcher from 'in-events/components/AIChat/TableChartSwitcher';
import { useSegmentTracking } from 'in-services/tracking/useSegmentTracking';
import EditableOptions from 'in-events/components/AIChat/EditableOptions';
import NLGResponse from 'in-events/components/AIChat/NLGResponse';

import locals from './AIChat.mless';

const LAUNCHER_BUTTON_ID = 'aiChatLauncher';
const DRAGGABLE_ICON = 'aiChatDraggableIcon';

// Helper function when needing to reposition the launcher icon
export function MoveAIChatLauncher(pixel) {
  const launcherIcon = document.getElementById(LAUNCHER_BUTTON_ID);
  if (launcherIcon) {
    launcherIcon.style.right = pixel;
  }
}

function setDragListener() {
  const elements = document.getElementsByTagName('cds-aichat-internal');
  const selector = '.WACBotContainer .WACHeader__CenterContainer';
  if (elements.length !== 1) {
    return;
  }
  const movable = elements[0].shadowRoot.getElementById('WACWidget');
  const AIChatHeader = elements[0].shadowRoot.querySelector(selector);
  if (!AIChatHeader) {
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
  AIChatHeader.addEventListener('pointerdown', e => {
    // Used for mouse movement delta
    const initialX = e.clientX;
    const initialY = e.clientY;

    // Initial location of chat window
    const offsetX = parseInt(movable.style.right);
    const offsetY = parseInt(movable.style.bottom);

    // We need to remove the slide up animation in order to drag vertically.
    // If the user closes the chat window and reopens it, the animation will be re-added
    const upAnimation = movable.getAnimations()[0];
    if (upAnimation) {
      upAnimation.cancel();
    }

    const onPointerMove = moveEvent => {
      movable.style.right = `${initialX - moveEvent.clientX + offsetX}px`;
      movable.style.bottom = `${initialY - moveEvent.clientY + offsetY}px`;
    };

    const onPointerUp = () => {
      document.removeEventListener('pointermove', onPointerMove);
      document.removeEventListener('pointerup', onPointerUp);
    };

    document.addEventListener('pointermove', onPointerMove);
    document.addEventListener('pointerup', onPointerUp);
  });
}

// Configuration to be passed to the AI Chat
const config = {
  messaging: {
    disablePDFViewer: true,
    customSendMessage: CustomSendMessages
  },
  showLauncher: false
};

export function AIChat() {
  // This timeout is needed because we need to wait for the Chat window
  // to be rendered before setting the drag listener
  useEffect(() => {
    setTimeout(() => {
      setDragListener();
    }, 500);
  });
  // This will move the Chat launcher back to original location.
  // This is needed because we need it to reset on page navigation
  MoveAIChatLauncher('50px');
  const { trackCta } = useSegmentTracking();

  return (
    <>
      <ChatContainer
        config={config}
        renderUserDefinedResponse={({ messageItem }, instance) => {
          if (!messageItem) {
            return;
          }
          switch (messageItem.user_defined?.user_defined_type) {
            case `editable_options`:
              return <EditableOptions messageItem={messageItem} instance={instance} />;
            case 'table_chart':
              return <TableChartSwitcher messageItem={messageItem} />;
            case 'nlg_response':
              return <NLGResponse messageItem={messageItem} />;
            default:
              return undefined;
          }
        }}
        onBeforeRender={instance => {
          instance.trackCta = trackCta;
        }}
        onAfterRender={instance => {
          const launcherElement = document.getElementById(LAUNCHER_BUTTON_ID);
          const draggableIcon = document.getElementById(DRAGGABLE_ICON);

          // Simple listener to stop clicks onto the launcher
          draggableIcon.addEventListener('click', e => {
            e.stopPropagation();
          });

          // Listen to when the launcher is clicked and open mainWindow
          launcherElement.addEventListener('click', e => {
            instance?.changeView('mainWindow');
            launcherElement.style.display = 'none';
            const elements = document.getElementsByTagName('cds-aichat-internal');
            if (elements.length === 1) {
              const movable = elements[0].shadowRoot.getElementById('WACWidget');
              movable.style.right = `32px`;
              movable.style.bottom = `32px`;
            }
            // Still need to wait for render
            setTimeout(() => {
              setDragListener();
            }, 500);
          });
          // Whenever the chat window opens / closes we want to hide / show the launcher button
          instance.on({
            type: 'view:change',
            handler: event => {
              if (event.newViewState.mainWindow) {
                launcherElement.style.display = 'none';
              } else {
                launcherElement.style.display = '';
              }
            }
          });

          // Drag Element will make the Ai Launcher Button Draggable across the screen
          dragElement(document.getElementById(DRAGGABLE_ICON));
          function dragElement(element) {
            var pos1 = 0,
              pos2 = 0,
              pos3 = 0,
              pos4 = 0;

            const dragMouseDown = e => {
              e = e || window.event;
              e.preventDefault();
              // Get position on start and call function on move
              pos3 = e.clientX;
              pos4 = e.clientY;
              document.onmouseup = closeDragElement;
              document.onmousemove = elementDrag;
            };
            const elementDrag = e => {
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
              newElem.style.top = newElem.offsetTop - pos2 + 'px';
              newElem.style.left = newElem.offsetLeft - pos1 + 'px';
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
        }}
      />
      <CarbonButton className={locals.aiChatDraggableButton} id={LAUNCHER_BUTTON_ID}>
        <SvgIcon type={'lib_actions_chat_launch'} size="regular" />
        <SvgIcon type={'lib_actions_reorder'} size="xxs" className={locals.draggableSvg} id={DRAGGABLE_ICON} />
      </CarbonButton>
    </>
  );
}
