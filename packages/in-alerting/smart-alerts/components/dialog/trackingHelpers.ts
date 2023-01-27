/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { Field, MapForm } from 'formalistic';

export function getTrackingObject(form: MapForm, paramsObj: object): object {
  return {
    bluePrint: (form.getIn(['rule', 'alertType']) as Field<string>).value,
    ...paramsObj
  };
}
