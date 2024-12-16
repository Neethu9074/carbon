/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import BeaconSelectInSection from 'in-custom-dashboards/widgets/SloLegacy/sli/BeaconSelectInSection';
import { noop } from 'in-services/fixedObjects';
import { t } from 'in-i18n';

describe('in-custom-dashboards/widgets/SloLegacy/sli/BeaconSelectInSection.tsx', () => {
  it('renders all beacon types with appropriate labels', async () => {
    // Given
    const onChange = noop;
    const beaconOptions = ['httpRequest', 'custom', 'pageLoad'] as const;
    const hasError = false;
    const value = 'httpRequest';

    // When
    render(
      <BeaconSelectInSection onChange={onChange} beaconOptions={beaconOptions} hasError={hasError} value={value} />
    );

    const options = await screen.findAllByRole('option');

    // Then
    expect(options).toHaveLength(3);

    expect(options[0]).toHaveAttribute('value', 'httpRequest');
    expect(options[0]).toHaveTextContent(
      t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel_httpRequest')
    );

    expect(options[1]).toHaveAttribute('value', 'custom');
    expect(options[1]).toHaveTextContent(t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel_custom'));

    expect(options[2]).toHaveAttribute('value', 'pageLoad');
    expect(options[2]).toHaveTextContent(t('in-custom-dashboards:widgets.slo.sliFormPresenter.beaconLabel_pageLoad'));
  });
});
