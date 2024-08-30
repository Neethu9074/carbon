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
    return false;
  }
}));

describe('AssociationsStep', () => {
  const form = createForm(true, getSimpleBlueprintConfig()[0]);
  const updateForm = jest.fn();
  const setSliderState = jest.fn();
  it('Renders the Associations section correctly for zero associated applications', () => {
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
    expect(screen.getByText('Select applications to associate with this synthetic test')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Associating a synthetic test with an application grants access rights to all users who have access to that application.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('No applications found')).toBeInTheDocument();
  });

  it('Renders the Associations section correctly for one or more associated applications', () => {
    const applications = {
      data: [
        { id: '2xJjXXStSj2tusnfRZCvSw', name: 'mehtest500', supplementary: null },
        {
          id: 'Xmt3alc-Qcmo2Xvnk-Xvzg',
          name: "Marat's test AP without calls",
          supplementary: null
        }
      ]
    } as unknown as Result<GroupPermissionEntity[]>;
    render(
      <AssociationsStep
        form={form}
        updateForm={updateForm}
        applications={applications}
        setSliderState={setSliderState}
      />
    );
    expect(screen.getByText('Select applications to associate with this synthetic test')).toBeInTheDocument();
    expect(
      screen.getByText(
        'Associating a synthetic test with an application grants access rights to all users who have access to that application.'
      )
    ).toBeInTheDocument();
    expect(screen.getByText('mehtest500')).toBeInTheDocument();
    expect(screen.getByText("Marat's test AP without calls")).toBeInTheDocument();
  });
});
