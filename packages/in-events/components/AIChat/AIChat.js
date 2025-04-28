/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React, { useEffect } from 'react';

import { SvgIcon, CarbonButton } from '@instana/components';
import { ChatContainer } from '@instana/ai-chat';

import { CustomSendMessages } from 'in-events/components/AIChat/CustomSendMessages';
import EditableOptions from 'in-events/components/AIChat/EditableOptions';
import DisplayChart from 'in-events/components/AIChat/DisplayChart';

import locals from './AIChat.mless';

export const LAUNCHER_BUTTON_ID = 'aiChatLauncher';

function customSortRow(lhs, rhs, collator) {
  const nlhs = Number(lhs);
  const nrhs = Number(rhs);
  if (!Number.isNaN(nlhs) && !Number.isNaN(nrhs)) {
    return nlhs - nrhs;
  }
  return collator.compare(lhs, rhs);
}

function setCustomSortRow() {
  const tables = document.querySelector('cds-aichat-internal').shadowRoot.querySelectorAll('cds-aichat-table');
  // NodeList needs to be [] to iterate
  [...tables].forEach(elm => {
    const table = elm.shadowRoot.querySelector('cds-table');
    if (table && !table.hasCustomSort) {
      table.customSortRow = customSortRow;
      table.hasCustomSort = true;
    }
  });
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
  useEffect(() => {
    setTimeout(() => {
      setDragListener();
    }, 500);
  });

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
            case 'bar_chart':
              return <DisplayChart messageItem={messageItem} />;
            default:
              return undefined;
          }
        }}
        onAfterRender={instance => {
          instance.on({
            type: 'receive',
            handler: msg => {
              if (msg.data?.output?.generic?.[0]?.response_type === 'table') {
                // Wait for table to display
                setTimeout(() => {
                  setCustomSortRow();
                }, 500);
              }
            }
          });
          // HACK -- To keep the greeting message from popping up we add a LONG delay.
          // TODO -- Update this once aichat packages version bumps where new function
          // allows you to cancel all together
          instance.showLauncherGreetingMessage(100000000000000, 'desktop');
          // isDragging is shared accross the various functions to synchronize actions accordingly
          let isDragging = false;
          const launcherElement = document.getElementById(LAUNCHER_BUTTON_ID);
          // Listen to when the launcher is clicked
          // Clicks could mean two things, dragging or opening
          launcherElement.addEventListener('click', () => {
            // If its NOT isDragging we open the window, otherwise do nothing
            if (!isDragging) {
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
            }
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
          dragElement(document.getElementById(LAUNCHER_BUTTON_ID));
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
              isDragging = true;
              e = e || window.event;
              e.preventDefault();
              // Determine new cursor position and then
              // set the elements position
              pos1 = pos3 - e.clientX;
              pos2 = pos4 - e.clientY;
              pos3 = e.clientX;
              pos4 = e.clientY;
              element.style.top = element.offsetTop - pos2 + 'px';
              element.style.left = element.offsetLeft - pos1 + 'px';
              element.style.right = 'auto';
              element.style.bottom = 'auto';
            };
            const closeDragElement = () => {
              // When click is released stop moving
              document.onmouseup = null;
              document.onmousemove = null;
              // Set a slight delay so then a second click would open the chat
              setTimeout(() => {
                isDragging = false;
              }, 25);
            };
            element.onmousedown = dragMouseDown;
          }
        }}
      />
      <CarbonButton className={locals.aiChatDraggableButton} id={LAUNCHER_BUTTON_ID}>
        <SvgIcon type={'lib_actions_chat_launch'} size="regular" />
      </CarbonButton>
    </>
  );
}
