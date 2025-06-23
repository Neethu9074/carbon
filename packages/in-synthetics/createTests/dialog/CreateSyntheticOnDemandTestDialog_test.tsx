/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import CreateSyntheticOnDemandTestDialog from 'in-synthetics/createTests/dialog/CreateSyntheticOnDemandTestDialog';
import { t } from 'in-i18n';

describe('Synthetic New Run now test Dialog', () => {
  beforeAll(() => {
    (global as any).ResizeObserver = class {
      observe(): void {
        //Intentionally left empty for this mock
      }
      unobserve(): void {
        //Intentionally left empty for this mock
      }
      disconnect(): void {
        //Intentionally left empty for this mock
      }
    };
  });
  it('Renders the run now dialog title correctly', () => {
    render(
      <CreateSyntheticOnDemandTestDialog
        testId="obN1wYkqefH9ZVslLG0L"
        testLocations={['locations']}
        testType="HTTPAction"
      />
    );
    expect(screen.getByText(t('in-synthetics:dialog.createOnDemandTest.runnowTitle'))).toBeInTheDocument();
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createOnDemandTest.createButtonLabel')
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createOnDemandTest.createButtonLabel')
      })
    ).not.toBeDisabled();
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createOnDemandTest.cancel')
      })
    ).toBeTruthy();
    expect(
      screen.getByRole('button', {
        name: t('in-synthetics:dialog.createOnDemandTest.cancel')
      })
    ).not.toBeDisabled();
  });
});
