/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React from 'react';

import WidgetEditorDialogPresenter from './WidgetEditorDialogPresenter';
import { pieWidget } from '../storyData/customDashboardStoryData';
import { getInitialFormState } from './WidgetEditorDialog';

export default {
  component: WidgetEditorDialogPresenter
};

export function PieEdit() {
  const pieForm = getInitialFormState(pieWidget);

  return <WidgetEditorDialogPresenter form={pieForm} />;
}
