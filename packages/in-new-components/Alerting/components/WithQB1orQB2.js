/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import { isQB2ModeInSmartAlertsEnabled } from 'in-services/featureFlags';

/*
  This is a helper to switch components which are using the old QB1 or new QB2
  TODO: Delete this component when QB2 is released (GA)

  Usage: To prevent errors caused by accidental initialization of e.g. a QB2 component,
  you need to provide a function returning the respective component with all necessary props provided.
  This enables lazy initialization and we ensure that not both component will be instantiated.

  WithQB1orQB2({
    onUsesQB1 = () => { MyQb1Components({...props}),
    onUsesQB2 = () => { MyQb2Components({...props}),
    shouldFallbackToQB2 => isQB2Config => isQB2Config(convertedTagFilterExpression) // + anything else you need to put into that function
  })
*/
export default function WithQB1orQB2({ onUsesQB1, onUsesQB2, shouldFallbackToQB2 = null }) {
  return switchQB1orQB2Helper(onUsesQB1, onUsesQB2, shouldFallbackToQB2);
}

export function switchQB1orQB2Helper(onUsesQB1, onUsesQB2, shouldFallbackToQB2 = null) {
  if (isQB2ModeInSmartAlertsEnabled) {
    return onUsesQB2();
  }
  if (shouldFallbackToQB2?.(isQB2Config)) {
    return onUsesQB2();
  }
  return onUsesQB1();
}

export function isQB2Config(convertedTagFilterExpression) {
  return convertedTagFilterExpression === false;
}
