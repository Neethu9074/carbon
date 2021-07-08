/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import { on } from '@instana/observables';

import {
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
} from 'in-components/keyCodes';
import { onLeftArrow, onRightArrow, onUpArrow, onDownArrow } from 'in-services/shortcuts/shortcuts/navigationViaArrows';
import onQuestionMarkPressed from 'in-services/shortcuts/shortcuts/QuestionMark';
import onEscapePressed from 'in-services/shortcuts/shortcuts/Esc';
import onFPressed from 'in-services/shortcuts/shortcuts/F';
import onVPressed from 'in-services/shortcuts/shortcuts/V';
import onCPressed from 'in-services/shortcuts/shortcuts/C';

export function init() {
  on(window, 'keydown').subscribe(keyEvent => {
    const targetType = keyEvent.target.tagName.toLowerCase();
    if (targetType === 'input' || targetType === 'textarea') {
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
