/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import CreateNewLocationDialogPresenter from 'in-synthetics/createLocation/CreateNewLocationDialogPresenter';
import createNewLocationForm from 'in-synthetics/createLocation/createNewLocationForm';

describe('CreateNewLocationDialogPresenter', () => {
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
    expect(screen.getByText('New Location')).toBeInTheDocument();
  });

  // it('highlights Private type when Private Location is chosen', () => {
  //   render(
  //     <CreateNewLocationDialogPresenter
  //       form={createNewLocationForm('private')}
  //       onClose={onClose}
  //       formId={'new-location-form'}
  //       updateForm={updateForm}
  //       simpleModeStep={0}
  //       setSimpleModeStep={setSimpleModeStep}
  //     />
  //   );

  //   expect(screen.getAllByRole('listitem')[0].className.includes('selected')).toBeTruthy();
  //   expect(screen.getAllByRole('listitem')[1].className.includes('selected')).toBeFalsy();
  // });

  it('verify Next and Cancel button is present', () => {
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
    ).not.toBeDisabled();
  });
});
