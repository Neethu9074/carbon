/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render } from '@testing-library/react';
import React from 'react';

import ApiTokenFormDialog from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokenFormDialog';
import { addActiveDialog } from 'in-components/DialogPresenter/store';

jest.mock('in-components/DialogPresenter/store');

const getProps = (id: string, duplicateFrom?: string) => ({ match: { params: { id, duplicateFrom } } });
describe('in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/ApiTokenFormDialog', () => {
  beforeEach(() => {
    jest.resetModules();
    // @ts-expect-error
    addActiveDialog.mockClear();
  });

  it('should show dialog when comp is mounted or updated when id is changed', async () => {
    render(<ApiTokenFormDialog {...getProps('new')} />);
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
    render(<ApiTokenFormDialog {...getProps('123')} />);
    expect(addActiveDialog).toHaveBeenCalledTimes(2);
  });
});
