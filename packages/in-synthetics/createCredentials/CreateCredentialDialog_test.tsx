/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import CreateCredentialDialog from 'in-synthetics/createCredentials/CreateCredentialDialog';

describe(CreateCredentialDialog, () => {
  const onClose = jest.fn();

  it('should render without crashing', () => {
    render(<CreateCredentialDialog onClose={onClose} />);
  });

  it('renders the Create a synthetic credential dialog title correctly', () => {
    render(<CreateCredentialDialog onClose={onClose} />);

    expect(screen.getByText('Create a synthetic credential')).toBeInTheDocument();

    expect(screen.getByRole('heading', { name: 'Name and value' })).toBeInTheDocument();
  });

  it('verify Next and Cancel button is present', () => {
    render(<CreateCredentialDialog onClose={onClose} />);

    expect(
      screen.getByRole('button', {
        name: 'Cancel'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Cancel'
      })
    ).not.toBeDisabled();

    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).toBeDisabled();
  });

  it('verify Next button is disabled initially and enabled when Name and Value are valid', () => {
    render(<CreateCredentialDialog onClose={onClose} />);

    const nameField = document.querySelector('input[placeholder="Credential name"]');
    const valueField = document.querySelector('input[placeholder="Credential value"]');

    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).toBeTruthy();

    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).toBeDisabled();

    fireEvent.change(nameField!, { target: { value: 'cred1' } });
    fireEvent.change(valueField!, { target: { value: 123 } });

    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).not.toBeDisabled();

    fireEvent.change(nameField!, { target: { value: '1cred1' } });

    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).toBeDisabled();

    fireEvent.change(nameField!, { target: { value: 'cred1' } });
    fireEvent.change(valueField!, { target: { value: '' } });

    expect(
      screen.getByRole('button', {
        name: 'Next'
      })
    ).toBeDisabled();
  });
});
