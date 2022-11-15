/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React from 'react';

export default function AddKeyToRoutes(routesArray) {
  return routesArray.map((item, i) => React.cloneElement(item, { key: i }));
}
