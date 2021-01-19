/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
// import { isInternalVisible$ } from 'in-new-components/MainNavigation/components/ViewSwitcher/isInternalVisibleStore';
// import useObservable from 'in-hooks/useObservable';
import { newAnalyticsEnabled, smartAlertsQB2Enabled } from 'in-services/featureFlags';

/*
  This is a helper to swith components which are using the old QB1 or new QB2
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
  // Because this function is also used outside of a React file, we can't use "useLocation"
  // TODO: since window.location and the router location (useLocation) can be out of sync, we want
  // to avoid using window.location. In this case we use it because it got deleted when QB2 will be available
  // in Website Smart Alerts.
  const isWebsiteMonitoring = window.location.hash.startsWith('#/websiteMonitoring');

  if (isQB2ModeEnabled && !isWebsiteMonitoring) {
    return onUsesQB2();
  } else {
    if (shouldFallbackToQB2?.(isQB2Config)) {
      return onUsesQB2();
    }
    return onUsesQB1();
  }
}

export const isQB2ModeEnabled = newAnalyticsEnabled && smartAlertsQB2Enabled;

export function isQB2Config(convertedTagFilterExpression) {
  return convertedTagFilterExpression === false;
}
