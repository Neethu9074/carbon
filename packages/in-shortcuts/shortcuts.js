/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { keyCodes } from '@instana/components';
import { on } from '@instana/observables';

import { onLeftArrow, onRightArrow, onUpArrow, onDownArrow } from 'in-shortcuts/keys/navigationViaArrows';
import { AI_CHAT_TAG_NAME } from 'in-events/components/AIChat/utils';
import onQuestionMarkPressed from 'in-shortcuts/keys/QuestionMark';
import onEscapePressed from 'in-shortcuts/keys/Esc';
import onFPressed from 'in-shortcuts/keys/F';
import onVPressed from 'in-shortcuts/keys/V';
import onCPressed from 'in-shortcuts/keys/C';

const {
  isCtrl,
  isAlt,
  isMeta,
  isEscape,
  isF,
  isV,
  isC,
  isQuestionMarkOrMinus,
  isArrowLeft,
  isArrowRight,
  isArrowUp,
  isArrowDown
} = keyCodes;

export function init() {
  on(window, 'keydown').subscribe(keyEvent => {
    const targetType = keyEvent.target.tagName.toLowerCase();
    const targetRole = keyEvent.target.role?.toLowerCase();
    if (
      targetType === 'input' ||
      targetType === 'textarea' ||
      targetType === AI_CHAT_TAG_NAME ||
      targetRole === 'textbox'
    ) {
      return;
    }

    if (isCtrl(keyEvent) || isAlt(keyEvent) || isMeta(keyEvent)) {
      return;
    }

    if (isEscape(keyEvent)) {
      return onEscapePressed(keyEvent);
    }
    if (isF(keyEvent)) {
      return onFPressed(keyEvent);
    }
    if (isV(keyEvent)) {
      return onVPressed(keyEvent);
    }
    if (isC(keyEvent)) {
      return onCPressed(keyEvent);
    }
    if (isQuestionMarkOrMinus(keyEvent)) {
      return onQuestionMarkPressed(keyEvent);
    }
    if (isArrowLeft(keyEvent)) {
      return onLeftArrow(keyEvent);
    }
    if (isArrowRight(keyEvent)) {
      return onRightArrow(keyEvent);
    }
    if (isArrowUp(keyEvent)) {
      return onUpArrow(keyEvent);
    }
    if (isArrowDown(keyEvent)) {
      return onDownArrow(keyEvent);
    }
  });
}
