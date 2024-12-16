/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { render } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import { ApplicationPerspectiveLabel } from 'in-custom-dashboards/widgets/SloLegacy/sli/components/list/ApplicationPerspectiveLabel';
import getServiceLabel from 'in-applications/subscriptions/getServiceLabel';
import getEndpointInfo from 'in-applications/subscriptions/getEndpointInfo';
import getApplication from 'in-applications/subscriptions/getApplication';
import { success } from 'in-services/util/result';

jest.mock('in-applications/subscriptions/getApplication', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('in-applications/subscriptions/getServiceLabel', () => ({
  __esModule: true,
  default: jest.fn()
}));
jest.mock('in-applications/subscriptions/getEndpointInfo', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/SloLegacy/sli/components/list/ApplicationPerspectiveLabel', () => {
  it('renders only the sliName if no IDs are provided', () => {
    // Given
    const sliName = 'stans sli';
    const sliEntity = {};
    // When
    const { container } = render(<ApplicationPerspectiveLabel sliName={sliName} sliEntity={sliEntity} />);

    // Then
    expect(container).toHaveTextContent('stans sli');
  });

  it('fetches and renders the application label if an applicationId is provided', () => {
    // Given

    const sliEntity = {
      applicationId: 'some applicationId'
    };
    getApplication.mockReturnValue(just(success({ label: 'stans lab' })));

    // When
    const { container } = render(<ApplicationPerspectiveLabel sliName="" sliEntity={sliEntity} />);

    // Then
    expect(container).toHaveTextContent('stans lab');
  });

  it('fetches and renders  the service label if a serviceId is provided', () => {
    // Given
    const sliEntity = {
      applicationId: 'some applicationId',
      endpointId: null,
      serviceId: 'some serviceId'
    };
    getServiceLabel.mockReturnValue(just(success({ label: 'stans snack dispenser' })));

    // When
    const { container } = render(<ApplicationPerspectiveLabel sliName="" sliEntity={sliEntity} />);

    // Then
    expect(container).toHaveTextContent('stans snack dispenser');
  });

  it('fetches and renders the endpoint label if an endpointId is provided', () => {
    // Given
    const sliEntity = {
      applicationId: 'some applicationId',
      serviceId: 'some serviceId',
      endpointId: 'some endpointId'
    };
    getEndpointInfo.mockReturnValue(just(success({ label: 'GET snack' })));

    // When
    const { container } = render(<ApplicationPerspectiveLabel sliName="" sliEntity={sliEntity} />);

    // Then
    expect(container).toHaveTextContent('GET snack');
  });
});
