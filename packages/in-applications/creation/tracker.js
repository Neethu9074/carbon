/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import {
  track,
  APPLICATION_CREATION_OPEN_DIALOG_CLICK,
  APPLCATION_CREATION_CLOSE_DIALOG_CLICK,
  APPLICATION_CREATION_STEP_SWITCH,
  APPLICATION_CREATION_MODE_SWITCH,
  APPLICATION_CREATION_CREATE_CLICK,
  APPLICATION_CREATION_SELECTED_BLUEPRINT,
  APPLICATION_CREATION_ADD_TAG,
  APPLICATION_CREATION_REMOVE_TAG,
  APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT,
  APPLICATION_CREATION_SCOPE_SELECT
} from 'in-services/tracking/tracking';

export const applicationCreationOpenDialogClick = e => track(APPLICATION_CREATION_OPEN_DIALOG_CLICK, e);
export const applicationCreationCloseDialogClick = e => track(APPLCATION_CREATION_CLOSE_DIALOG_CLICK, e);
export const applicationCreationStepSwitch = e => track(APPLICATION_CREATION_STEP_SWITCH, e);
export const applicationCreationModeSwitch = e => track(APPLICATION_CREATION_MODE_SWITCH, e);
export const applicationCreationCreateClick = e => track(APPLICATION_CREATION_CREATE_CLICK, e);
export const applicationCreationSelectedBlueprint = e => track(APPLICATION_CREATION_SELECTED_BLUEPRINT, e);
export const applicationCreationAddTag = e => track(APPLICATION_CREATION_ADD_TAG, e);
export const applicationCreationRemoveTag = e => track(APPLICATION_CREATION_REMOVE_TAG, e);
export const applicationCreationBoundaryScopeSelect = e => track(APPLICATION_CREATION_BOUNDARY_SCOPE_SELECT, e);
export const applicationCreationScopeSelect = e => track(APPLICATION_CREATION_SCOPE_SELECT, e);
