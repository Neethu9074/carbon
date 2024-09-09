/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';

import { getSimpleBlueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import AssociationsStep from 'in-synthetics/createTests/wizard/AssociationsStep';

jest.mock('in-services/featureFlags', () => ({
  get syntheticRbacLimitedEnabled() {
    return true;
  }
}));

describe('AssociationsStep', () => {
  const form = createForm(true, getSimpleBlueprintConfig()[0]);
  const updateForm = jest.fn();
  const setSliderState = jest.fn();
  it('Renders the Associations step correctly', () => {
    const applications = {
      data: []
    } as unknown as Result<GroupPermissionEntity[]>;
    render(
      <AssociationsStep
        form={form}
        updateForm={updateForm}
        applications={applications}
        setSliderState={setSliderState}
      />
    );
    expect(screen.getByText('Select what you want to associate with this synthetic test')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Associating a synthetic test with an application, website or mobile app grants access rights to all users who have access to those entities.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('Application(s)')).toBeInTheDocument();
    expect(screen.getByText('Select Applications')).toBeInTheDocument();
    expect(screen.getByText('Website(s)')).toBeInTheDocument();
    expect(screen.getByText('Select Websites')).toBeInTheDocument();
    expect(screen.getByText('Mobile App(s)')).toBeInTheDocument();
    expect(screen.getByText('Select Mobile Apps')).toBeInTheDocument();
  });
});
