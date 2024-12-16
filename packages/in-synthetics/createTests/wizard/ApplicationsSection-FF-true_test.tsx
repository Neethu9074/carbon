/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { GroupPermissionEntity, Result } from '@instana/types';

import { getSimpleBlueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import ApplicationsSection from 'in-synthetics/createTests/wizard/ApplicationsSection';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';

jest.mock('in-services/featureFlags', () => ({
  get syntheticRbacLimitedEnabled() {
    return true;
  }
}));

describe('ApplicationsSection when syntheticRbacLimitedEnabled is true', () => {
  const form = createForm(true, getSimpleBlueprintConfig()[0]);
  const updateForm = jest.fn();

  it('Renders the Applications section correctly for zero associated applications', () => {
    const applications = {
      data: []
    } as unknown as Result<GroupPermissionEntity[]>;
    render(<ApplicationsSection form={form} updateForm={updateForm} applications={applications} />);

    expect(screen.getByText('No applications found')).toBeInTheDocument();
  });

  it('Renders the Applications section correctly for one or more associated applications', () => {
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
    render(<ApplicationsSection form={form} updateForm={updateForm} applications={applications} />);

    expect(screen.getByText('Select Applications')).toBeInTheDocument();
    screen.debug();
    expect(document.querySelectorAll('input[type="checkbox"].cds--checkbox')).toHaveLength(2);
    expect(screen.getByText('mehtest500')).toBeInTheDocument();
    expect(screen.getByText("Marat's test AP without calls")).toBeInTheDocument();
  });
});
