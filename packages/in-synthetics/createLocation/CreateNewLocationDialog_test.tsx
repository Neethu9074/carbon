/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import CreateNewLocationDialogPresenter from 'in-synthetics/createLocation/CreateNewLocationDialogPresenter';
import createNewLocationForm from 'in-synthetics/createLocation/createNewLocationForm';
import DeployTabSelection from 'in-synthetics/createLocation/steps/DeployTabSelection';
import ManagedLocation from 'in-synthetics/createLocation/steps/ManagedLocation';

describe('Synthetic New Location Dialog', () => {
  const updateForm = jest.fn();
  const setSimpleModeStep = jest.fn();
  const onClose = jest.fn();

  it('Renders the new location dialog title correctly', () => {
    render(
      <CreateNewLocationDialogPresenter
        form={createNewLocationForm('private')}
        onClose={onClose}
        formId={'new-location-form'}
        updateForm={updateForm}
        simpleModeStep={0}
        setSimpleModeStep={setSimpleModeStep}
      />
    );
    expect(screen.getByText('New location')).toBeInTheDocument();
  });

  it('Renders PrivateLocation component correctly', () => {
    const { container } = render(<DeployTabSelection downloadKey={''} agentKey={''} syntheticAcceptorURL={''} />);
    expect(screen.getByText('Synthetic PoP commands')).toBeInTheDocument();
    expect(container.getElementsByTagName('li').length).toBe(2);
    expect(container.getElementsByTagName('li')[0]).toHaveTextContent('Simple');
    expect(container.getElementsByTagName('li')[1]).toHaveTextContent('Redis TLS');
    expect(
      screen.getByRole('button', {
        name: 'Copy'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Copy'
      })
    ).not.toBeDisabled();
  });

  it('Renders ManagedLocation component correctly', () => {
    const { container } = render(
      <ManagedLocation form={createNewLocationForm('managed')} datacenters={just([])} updateForm={updateForm} />
    );

    expect(screen.getByText('Datacenters')).toBeInTheDocument();

    expect(container.getElementsByTagName('th').length).toBe(5);
    expect(container.getElementsByTagName('th')[0]).toHaveTextContent('Datacenter code');
    expect(container.getElementsByTagName('th')[1]).toHaveTextContent('Datacenter name');
    expect(container.getElementsByTagName('th')[2]).toHaveTextContent('Provider');
    expect(container.getElementsByTagName('th')[3]).toHaveTextContent('Location name');
    expect(container.getElementsByTagName('th')[4]).toHaveTextContent('Activation status');
  });
});
