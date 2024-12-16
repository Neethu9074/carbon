/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render } from '@testing-library/react';
import React from 'react';

import CustomEvent from 'in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEvent';
import { createCustomThresholdBasedEventSpecification } from 'in-api/eventSpecificationsHelpers';

jest.mock('in-api/eventSpecificationsHelpers', () => {
  return {
    ...jest.requireActual('in-api/eventSpecificationsHelpers'),
    createCustomThresholdBasedEventSpecification: jest.fn()
  };
});

describe('in-settings/tabs/GlobalSettings/pages/eventsAndAlerts/Events/CustomEvent', () => {
  it('Disables submit button if legacy event is already migrated.', () => {
    // GIVEN
    const migratedEntity = {
      migrated: true
    };
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
});
