/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { TimePickerProps } from './types';
import TimePicker from './TimePicker';

export const TimePickerWithTypedProps = (props: TimePickerProps) => <TimePicker {...props} />;
