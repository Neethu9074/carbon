/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import {
  Airplane as CarbonAirplane,
  CalendarEvent as CarbonCalendarEvent,
  TimePlot as CarbonTimePlot
} from '@carbon/pictograms-react';
import React from 'react';

export default {
  component: CarbonAirplane
};

const args = {
  width: 56,
  color: '#0F62FE'
};

const argTypes = {
  width: {
    control: {
      type: 'number'
    }
  },
  color: {
    control: {
      type: 'text'
    }
  }
};

export const Airplane = props => {
  return <CarbonAirplane {...props} />;
};

Airplane.args = args;

Airplane.argTypes = argTypes;

export const CalendarEvent = props => {
  return <CarbonCalendarEvent {...props} />;
};

CalendarEvent.args = args;

CalendarEvent.argTypes = argTypes;

export const TimePlot = props => {
  return <CarbonTimePlot {...props} />;
};

TimePlot.args = args;

TimePlot.argTypes = argTypes;
