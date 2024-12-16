/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import React, { useContext } from 'react';

import ApplicationTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/ApplicationTagFilterBuilder';
import WebsiteTagFilterBuilder from 'in-service-levels/components/ConfigDialog/components/FormComponents/TagFilterBuilder/WebsiteTagFilterBuilder';
import SloFormContext from 'in-service-levels/components/ConfigDialog/createSloForm/SloFormContext';

export default function TagFilterBuilder() {
  const { form } = useContext(SloFormContext);
  const entityType = form.getIn(['entity', 'type']).value;

  if (entityType === 'application') return <ApplicationTagFilterBuilder />;

  return <WebsiteTagFilterBuilder />;
}
