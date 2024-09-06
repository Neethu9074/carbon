/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { render, screen } from '@testing-library/react';
import React from 'react';

import { just } from '@instana/observables';

import AboutInstanaDialog from 'in-components/AboutInstanaDialog/AboutInstanaDialog';
import getUiBackendVersion from 'in-subscription/getUiBackendVersion';
import { close } from 'in-components/DialogPresenter/store';

jest.mock('in-stores/navigation');
jest.mock('in-components/DialogPresenter/store');
jest.mock('in-subscription/getUiBackendVersion');

const UibackendVersion = {
  branch: 'develop',
  commit: '458895ef87a33744312808d67e0079c845ef2406',
  imageTag: '2.211.139'
};

test('AboutInstanaDialog uiBackendVersion subscription', () => {
  getUiBackendVersion.mockReturnValue(just(UibackendVersion));

  render(<AboutInstanaDialog />);
  screen.getByText(UibackendVersion.imageTag);
  screen.getByText(UibackendVersion.commit.substring(0, 12));
});

test('AboutInstanaDialog handle close clicking', () => {
  const { container } = render(<AboutInstanaDialog />);
  container.querySelector('button.rightAligned').click();
  expect(close).toHaveBeenCalled();
});
