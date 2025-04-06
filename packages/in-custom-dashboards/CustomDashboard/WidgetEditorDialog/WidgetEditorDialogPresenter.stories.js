/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  pieWidget,
  timeSeriesWidget6Dataset2Axis
} from 'in-custom-dashboards/CustomDashboard/storyData/customDashboardStoryData';
import WidgetEditorDialogPresenter from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialogPresenter';
import { getInitialFormState } from 'in-custom-dashboards/CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';

export default {
  component: WidgetEditorDialogPresenter
};

export function PieEdit() {
  let initialFormState = getInitialFormState(pieWidget);
  const [state, setState] = useState({ form: initialFormState });

  function setForm(form) {
    setState({
      ...state,
      form
    });
  }
  return (
    <WidgetEditorDialogPresenter
      isEditing
      form={state.form}
      onChange={(path, fn) => setForm(state.form.updateIn(path, fn))}
    />
  );
}
export function SixDatasetTwoAxisTimeSeries() {
  let initialFormState = getInitialFormState(timeSeriesWidget6Dataset2Axis);
  const [state, setState] = useState({ form: initialFormState });

  function setForm(form) {
    setState({
      ...state,
      form
    });
  }
  return (
    <WidgetEditorDialogPresenter
      isEditing
      form={state.form}
      onChange={(path, fn) => setForm(state.form.updateIn(path, fn))}
    />
  );
}
