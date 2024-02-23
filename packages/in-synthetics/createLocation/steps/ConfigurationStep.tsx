/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { MapForm } from 'formalistic';
import React from 'react';

import { SyntheticDatacenter, Result } from '@instana/types';
import { Observable } from '@instana/observables';

import NoDataAvailable from 'in-components/Errors/NoDataAvailable/NoDataAvailable';
import PrivateLocation from 'in-synthetics/createLocation/steps/PrivateLocation';
import ManagedLocation from 'in-synthetics/createLocation/steps/ManagedLocation';
import { LocationsBluePrint } from 'in-synthetics/createLocation/bluePrints';
import { getDatacenters } from 'in-synthetics/api';

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
    // passing id to getDatacenters() so as to memoize response until new form is created
    const datacenters: Observable<SyntheticDatacenter[]> = getDatacenters(form.get('id').value)
      .map(result => {
        return (result as Result<SyntheticDatacenter[]>)?.data;
      })
      .map(result => result ?? ([] as SyntheticDatacenter[]));

    return <ManagedLocation form={form} datacenters={datacenters} updateForm={updateForm} />;
  }

  // If for some random case there is no private or managed location defined,
  // we default to display the NoDataAvailable component with some text.
  return <NoDataAvailable />;
};

export default ConfigurationStep;
