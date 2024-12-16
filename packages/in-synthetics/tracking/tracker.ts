/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
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
  SYNTHETIC_RESULTS_WIDGET_DETAIL_CLICK,
  SYNTHETIC_CONFIGURATION_TAB_EDIT_CLICK,
  SYNTHETIC_CONFIGURATION_TAB_DELETE_CLICK,
  SYNTHETIC_CREDENTIAL_OPEN_CREATE_DIALOG_CLICK,
  SYNTHETIC_CREDENTIAL_SWITCH_TAB_CLICK,
  SYNTHETIC_CREDENTIAL_CREATE_BUTTON_CLICK,
  SYNTHETIC_CREDENTIAL_EDIT_SUBMIT_BUTTON_CLICK,
  SYNTHETIC_CREDENTIAL_DELETE_SUBMIT_BUTTON_CLICK
} from 'in-services/tracking/tracking';
import { AdvancedBluePrint } from 'in-synthetics/createTests/data/advancedModeBluePrints';
import { BluePrint } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { CtaTrackingFunction } from 'in-services/tracking/useSegmentTracking';

export const clickSyntheticMonitoringTestTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_TEST_CLICK, {
    type: 'Link',
    text: 'View Synthetic test dashboard'
  });
};
export const clickSyntheticMonitoringTabInApplicationsTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_TAB_INAPP_CLICK, {
    type: 'TabView',
    text: 'Synthetic Monitoring tab in Applications section'
  });
};
export const syntheticCreateButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREATE_BUTTON_CLICK, {
    type: 'Button',
    text: 'Add Synthetic Test'
  });
};
export const syntheticWizardCreateTestTypeSwitch = (trackCta: CtaTrackingFunction, item: BluePrint) => {
  trackCta(SYNTHETIC_WIZARD__CREATE_TEST_TYPE_SWITCH, {
    type: 'Menu',
    text: `Switched to create ${item.type} test section from wizard mode`
  });
};
export const syntheticCreateAdvancedButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREATE_ADVANCED_BUTTON_CLICK, {
    type: 'Button',
    text: 'Switch to advanced mode'
  });
};
export const syntheticAdvancedCreateTestTypeSwitch = (trackCta: CtaTrackingFunction, item: AdvancedBluePrint) => {
  trackCta(SYNTHETIC_ADVANCED__CREATE_TEST_TYPE_SWITCH, {
    type: 'Menu',
    text: `Switched to create ${item.type} test section from advanced mode`
  });
};
export const syntheticAdvancedCreateButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_ADVANCED_CREATE_BUTTON_CLICK, {
    type: 'Button',
    text: `Create a test using advanced mode`
  });
};
export const syntheticWizardCreateButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_WIZARD_CREATE_BUTTON_CLICK, {
    type: 'Button',
    text: `Create a test using wizard mode`
  });
};
export const clickSyntheticMonitoringResultsTabTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_RESULTS_TAB_CLICK, {
    type: 'Tab',
    text: 'Results tab from synthetic Test Dashboard'
  });
};
export const clickSyntheticMonitoringConfigurationTabTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CONFIGURATION_TAB_CLICK, {
    type: 'Tab',
    text: 'Configuration tab from synthetic Test Dashboard'
  });
};
export const clickSyntheticMonitoringResultsListDetailTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_RESULTS_LIST_DETAIL_CLICK, {
    type: 'Link',
    text: 'Results details from Results list'
  });
};
export const clickSyntheticMonitoringResultsWidgetDetailTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_RESULTS_WIDGET_DETAIL_CLICK, {
    type: 'Link',
    text: 'Results details from Results widget'
  });
};
export const clickSyntheticMonitoringConfigurationTabEditTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CONFIGURATION_TAB_EDIT_CLICK, {
    type: 'Button',
    text: 'Update test configuration from edit dialog.'
  });
};
export const clickSyntheticMonitoringConfigurationTabDeleteTracker = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CONFIGURATION_TAB_DELETE_CLICK, {
    type: 'Button',
    text: 'Delete action from edit dialog view.'
  });
};

export const syntheticSwitchCredentialTab = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREDENTIAL_SWITCH_TAB_CLICK, {
    type: 'Tab',
    text: 'Switch to credential view.'
  });
};

export const syntheticOpenCredentialDialogButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREDENTIAL_OPEN_CREATE_DIALOG_CLICK, {
    type: 'Button',
    text: 'Open create credentials dialog.'
  });
};

export const syntheticCreateCredentialButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREDENTIAL_CREATE_BUTTON_CLICK, {
    type: 'Button',
    text: 'Create credential button clicked.'
  });
};

export const syntheticCredentialEditSubmitButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREDENTIAL_EDIT_SUBMIT_BUTTON_CLICK, {
    type: 'Button',
    text: 'Update credential button clicked'
  });
};

export const syntheticCredentialDeleteSubmitButtonClick = (trackCta: CtaTrackingFunction) => {
  trackCta(SYNTHETIC_CREDENTIAL_DELETE_SUBMIT_BUTTON_CLICK, {
    type: 'Button',
    text: 'Delete credential button clicked'
  });
};
