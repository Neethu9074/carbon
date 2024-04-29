/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  track,
  SYNTHETIC_NAV_CLICK,
  SYNTHETIC_TAB_INAPP_CLICK,
  SYNTHETIC_TEST_CLICK,
  SYNTHETIC_ADVANCED_CREATE_BUTTON_CLICK,
  SYNTHETIC_WIZARD__CREATE_TEST_TYPE_SWITCH,
  SYNTHETIC_CREATE_ADVANCED_BUTTON_CLICK,
  SYNTHETIC_ADVANCED__CREATE_TEST_TYPE_SWITCH,
  SYNTHETIC_CREATE_BUTTON_CLICK,
  SYNTHETIC_WIZARD_CREATE_BUTTON_CLICK,
  SYNTHETIC_RESULTS_TAB_CLICK,
  SYNTHETIC_CONFIGURATION_TAB_CLICK,
  SYNTHETIC_RESULTS_LIST_DETAIL_CLICK,
  SYNTHETIC_RESULTS_WIDGET_DETAIL_CLICK
} from 'in-services/tracking/tracking';

interface SyntheticTrackerProps {
  detail: string;
}

export const clickSyntheticMonitoringNavigationTracker = (e: SyntheticTrackerProps) => track(SYNTHETIC_NAV_CLICK, e);
export const clickSyntheticMonitoringTestTracker = (e: SyntheticTrackerProps) => track(SYNTHETIC_TEST_CLICK, e);
export const clickSyntheticMonitoringTabInApplicationsTracker = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_TAB_INAPP_CLICK, e);
export const syntheticCreateButtonClick = (e: SyntheticTrackerProps) => track(SYNTHETIC_CREATE_BUTTON_CLICK, e);
export const syntheticWizardCreateTestTypeSwitch = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_WIZARD__CREATE_TEST_TYPE_SWITCH, e);
export const syntheticCreateAdvancedButtonClick = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_CREATE_ADVANCED_BUTTON_CLICK, e);
export const syntheticAdvancedCreateTestTypeSwitch = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_ADVANCED__CREATE_TEST_TYPE_SWITCH, e);
export const syntheticAdvancedCreateButtonClick = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_ADVANCED_CREATE_BUTTON_CLICK, e);
export const syntheticWizardCreateButtonClick = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_WIZARD_CREATE_BUTTON_CLICK, e);
export const clickSyntheticMonitoringResultsTabTracker = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_RESULTS_TAB_CLICK, e);
export const clickSyntheticMonitoringConfigurationTabTracker = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_CONFIGURATION_TAB_CLICK, e);
export const clickSyntheticMonitoringResultsListDetailTracker = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_RESULTS_LIST_DETAIL_CLICK, e);
export const clickSyntheticMonitoringResultsWidgetDetailTracker = (e: SyntheticTrackerProps) =>
  track(SYNTHETIC_RESULTS_WIDGET_DETAIL_CLICK, e);
