/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2024
 */

// Assisted by WCA@IBM
// Latest GenAI contribution: ibm/granite-8b-code-instruct
import React from 'react';
import { render } from '@testing-library/react';

import AssociationsContentPresenter from 'in-synthetics/dashboards/global/tabs/tests/components/AssociationsContentPresenter';

describe('AssociationsContentPresenter', () => {
  it('should render without errors', () => {
    render(
      <AssociationsContentPresenter
        applicationIds={['appOne, appTwo']}
        applicationLabels={['App 1', 'App 2']}
        websiteIds={['websiteOne', 'websiteTwo']}
        websiteLabels={['website 1', 'website 2']}
        mobileAppIds={['mobileOne', 'mobileTwo']}
        mobileAppLabels={['Mobile 1', 'Mobile 2']}
        applicationIdsCanBeLinked={['appOne']}
        websiteIdsCanBeLinked={['websiteTwo']}
        mobileAppIdsCanBeLinked={['mobileOne']}
      />
    );
  });

  it('Should render an overlay with 6 Associations', () => {
    const { getByText } = render(
      <AssociationsContentPresenter
        applicationIds={['appOne, appTwo']}
        applicationLabels={['App 1', 'App 2']}
        websiteIds={['websiteOne', 'websiteTwo']}
        websiteLabels={['website 1', 'website 2']}
        mobileAppIds={['mobileOne', 'mobileTwo']}
        mobileAppLabels={['Mobile 1', 'Mobile 2']}
        applicationIdsCanBeLinked={['appOne']}
        websiteIdsCanBeLinked={['websiteTwo']}
        mobileAppIdsCanBeLinked={['mobileOne']}
      />
    );
    expect(getByText('6 Associations')).toBeTruthy();
  });

  it('Should not render an overlay if there are no associations', () => {
    const { getByTestId } = render(
      <AssociationsContentPresenter
        applicationIds={[]}
        applicationLabels={[]}
        websiteIds={[]}
        websiteLabels={[]}
        mobileAppIds={[]}
        mobileAppLabels={[]}
        applicationIdsCanBeLinked={[]}
        websiteIdsCanBeLinked={[]}
        mobileAppIdsCanBeLinked={[]}
      />
    );
    expect(getByTestId('noAssociations')).not.toBeNull();
  });
});
