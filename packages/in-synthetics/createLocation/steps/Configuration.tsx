/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import PrivateLocation from 'in-synthetics/createLocation/steps/PrivateLocation';
import ManagedLocation from 'in-synthetics/createLocation/steps/ManagedLocation';
import { LocationsBluePrint } from 'in-synthetics/createLocation/bluePrints';

interface Props {
  selectedBlueprint: LocationsBluePrint;
  form: MapForm<any>;
  updateForm: (form: MapForm<any>) => void;
}

const ConfigurationStep = ({ selectedBlueprint, form, updateForm }: Props) => {
  const isPrivateLocation = selectedBlueprint.type === 'private';
  const isManagedLocation = selectedBlueprint.type === 'managed';

  if (isPrivateLocation) {
    return <PrivateLocation />;
  }

  if (isManagedLocation) {
    return <ManagedLocation form={form} updateForm={updateForm} />;
  }

  // If for some random case there is no private or managed location defined,
  // we default to display the NoDataAvailable component with some text.
  return <NoDataAvailable />;
};

export default ConfigurationStep;
