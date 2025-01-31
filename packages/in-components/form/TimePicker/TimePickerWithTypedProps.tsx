/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

import { TimePickerProps } from 'in-components/form/TimePicker/types';
import TimePicker from 'in-components/form/TimePicker/TimePicker';

export const TimePickerWithTypedProps = (props: TimePickerProps) => <TimePicker {...props} />;
