/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useState } from 'react';

import {
  timeSeriesWidget2Axis1Datasett,
  timeSeriesWidget6Dataset2Axis,
  timeSeriesWidget6Dataset2AxisLastOnRight
} from '../../../CustomDashboard/storyData/customDashboardStoryData';
import { getInitialFormState } from '../../../CustomDashboard/WidgetEditorDialog/WidgetEditorDialog';
import AxesConfigurator from './AxesConfigurator';
import { getShortMetricKey } from '../util';

export default {
  component: AxesConfigurator
};

export function SixDataSetTwoAxesConfigurator() {
  let initialFormState = getInitialFormState(timeSeriesWidget6Dataset2Axis);
  const [state, setState] = useState({ form: initialFormState });

  function setForm(form) {
    setState({
      ...state,
      form
    });
  }

  function onChange(path, fn) {
    setForm(state.form.updateIn(path, fn));
  }

  return (
    <AxesConfigurator
      form={state.form.get(`config`)}
      onChange={(path, fn) => onChange(['config', ...path], fn)}
      getShortMetricKey={getShortMetricKey}
    />
  );
}

export function SixDataSetTwoAxesConfiguratorLastOnRight() {
  let initialFormState = getInitialFormState(timeSeriesWidget6Dataset2AxisLastOnRight);
  const [state, setState] = useState({ form: initialFormState });

  function setForm(form) {
    setState({
      ...state,
      form
    });
  }

  function onChange(path, fn) {
    setForm(state.form.updateIn(path, fn));
  }

  return (
    <AxesConfigurator
      form={state.form.get(`config`)}
      onChange={(path, fn) => onChange(['config', ...path], fn)}
      getShortMetricKey={getShortMetricKey}
    />
  );
}

export function OneDataSetTwoAxesConfiguratorLastOnRight() {
  let initialFormState = getInitialFormState(timeSeriesWidget2Axis1Datasett);
  const [state, setState] = useState({ form: initialFormState });

  function setForm(form) {
    setState({
      ...state,
      form
    });
  }

  function onChange(path, fn) {
    setForm(state.form.updateIn(path, fn));
  }

  return (
    <AxesConfigurator
      form={state.form.get(`config`)}
      onChange={(path, fn) => onChange(['config', ...path], fn)}
      getShortMetricKey={getShortMetricKey}
    />
  );
}
