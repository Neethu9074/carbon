/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecifications';
import CustomEvent from './CustomEvent';

jest.mock('in-api/eventSpecifications', () => {
  const { Map } = require('immutable');
  return {
    ...jest.requireActual('in-api/eventSpecifications'),
    createCustomThresholdBasedEventSpecification: jest.fn(() => Map())
  };
});

describe('in-settings/tabs/TeamSettings/pages/eventsAndAlerts/Events/CustomEvent', () => {
  it('Disables submit button if legacy event is already migrated.', () => {
    // GIVEN
    const migratedEntity = { migrated: true };
    createCustomThresholdBasedEventSpecification.mockReturnValueOnce(migratedEntity);

    const props = {
      match: { params: { id: undefined } },
      saveEnabled: true
    };

    // WHEN
    const { container } = render(<CustomEvent {...props} />);

    // THEN
    expect(container.querySelector('button[type="submit"]')).toBeDisabled();
  });

  it('Has submit button enabled for non–legacy events and legacy events that are not migrated.', () => {
    // GIVEN
    const props = {
      match: { params: { id: undefined } },
      saveEnabled: true
    };

    // WHEN
    const { container } = render(<CustomEvent {...props} />);

    // THEN
    expect(container.querySelector('button[type="submit"]')).toBeEnabled();
  });
});
