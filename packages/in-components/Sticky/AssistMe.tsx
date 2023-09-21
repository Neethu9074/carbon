/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

interface AssistMeKeys {
  productId: string;
  topSpacing: string;
  zIndex: number;
}
const value = {
  productId: 'a875055db9b7697d9da869d8f5db0f7c',
  topSpacing: '46px',
  zIndex: 4500
};
var assistMeController: AssistMeKeys;
function init() {
  // @ts-expect-error defined in AssistMe controller.js AssistMe
  assistMeController = window.initAssistMeController(value);
}
export function openAssistMe() {
  if (!assistMeController) {
    init();
  }
  //@ts-expect-error defined in AssistMe controller.js
  return assistMeController.isOpen() ? assistMeController.close() : assistMeController.open();
}
