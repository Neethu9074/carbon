/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import React from 'react';

import { SvgIcon, CarbonButton } from '@instana/components';

import { LAUNCHER_BUTTON_ID, DRAGGABLE_ICON } from 'in-events/components/AIChat/utils/utils';

import locals from '../AIChat.mless';

/**
 * LauncherButton component for the AI Chat
 * Includes the main button and the draggable icon
 */
export const LauncherButton = () => {
  return (
    <CarbonButton className={locals.aiChatDraggableButton} id={LAUNCHER_BUTTON_ID}>
      <SvgIcon type={'lib_actions_chat_launch'} size="regular" />
      {/* @ts-ignore - Adding id prop to SvgIcon */}
      <SvgIcon type={'lib_actions_reorder'} size="xxs" className={locals.draggableSvg} id={DRAGGABLE_ICON} />
    </CarbonButton>
  );
};

export default LauncherButton;
