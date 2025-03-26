/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// Assisted by WCA@IBM
// Latest GenAI contribution: ibm/granite-8b-code-instruct
import { render } from '@testing-library/react';
import React from 'react';

import AssociationsCommonSection from 'in-synthetics/createTests/wizard/AssociationsCommonSection';
import { getSimpleBlueprintConfig } from 'in-synthetics/createTests/data/simpleModeBluePrints';
import { createForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';

describe('AssociationsCommonSection', () => {
  it('renders without crashing', () => {
    const form = createForm(true, getSimpleBlueprintConfig()[0]);
    const updateForm = jest.fn();
    const setSliderState = jest.fn();
    render(<AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />);
  });

  it('renders all expected elements', () => {
    const form = createForm(true, getSimpleBlueprintConfig()[0]);
    const updateForm = jest.fn();
    const setSliderState = jest.fn();
    const { getByText } = render(
      <AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />
    );
    expect(getByText('Application(s)')).toBeTruthy();
    expect(getByText('Website(s)')).toBeTruthy();
    expect(getByText('Mobile App(s)')).toBeTruthy();
  });

  it('renders no data available message when no entities are selected', () => {
    const form = createForm(true, getSimpleBlueprintConfig()[0]);
    const updateForm = jest.fn();
    const setSliderState = jest.fn();
    const { container } = render(
      <AssociationsCommonSection form={form} updateForm={updateForm} setSliderState={setSliderState} />
    );
    const skeletonTableText = container.querySelector('table.cds--skeleton');
    expect(skeletonTableText).toBeTruthy();
  });
});
