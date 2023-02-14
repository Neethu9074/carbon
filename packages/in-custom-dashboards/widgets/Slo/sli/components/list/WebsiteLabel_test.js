/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { render } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import { WebsiteLabel } from 'in-custom-dashboards/widgets/Slo/sli/components/list/WebsiteLabel';
import getWebsite from 'in-websites/subscriptions/getWebsite';
import { success } from 'in-services/util/result';

jest.mock('in-websites/subscriptions/getWebsite', () => ({
  __esModule: true,
  default: jest.fn()
}));

describe('in-custom-dashboards/widgets/Slo/sli/components/list/WebsiteLabel', () => {
  it('renders only the sliName if no IDs are provided', () => {
    // Given
    const sliName = 'stans sli';
    const sliEntity = {};
    // When
    const { container } = render(<WebsiteLabel sliName={sliName} sliEntity={sliEntity} />);

    // Then
    expect(container).toHaveTextContent('stans sli');
  });

  it('fetches and renders the website label if an websiteId is provided', () => {
    // Given

    const sliEntity = {
      websiteId: 'some websiteId'
    };
    getWebsite.mockReturnValue(just(success({ label: 'stans lab' })));

    // When
    const { container } = render(<WebsiteLabel sliName="" sliEntity={sliEntity} />);

    // Then
    expect(container).toHaveTextContent('stans lab');
  });
});
