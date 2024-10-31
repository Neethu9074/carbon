/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { DialogWrapper } from 'in-settings/tabs/SecurityAndAccess/pages/accessControl/ApiTokens/DialogWrapper';

const getProps = () => {
  const children = <div data-testid="dialog-children" />;
  const footer = <div data-testid="dialog-footer" />;
  return {
    title: 'title',
    onClickCancel: onClickCancel,
    children,
    footer
  };
};

const onClickCancel = jest.fn();

describe('in-settings/tabs/SecurityAndAccess/pages/Users/Users', () => {
  beforeEach(() => {
    jest.resetModules();
  });

  it('should render the DialogSlideInView comp in DialogWrapper', async () => {
    const { getByTestId } = renderDailogWrapper();
    expect(getByTestId('dialog-slide-in-view')).toBeInTheDocument();
  });

  it('should render dialog children', async () => {
    const { getByTestId } = renderDailogWrapper();
    expect(getByTestId('dialog-children')).toBeInTheDocument();
  });

  it('should render dialog footer', async () => {
    const { getByTestId } = renderDailogWrapper();
    expect(getByTestId('dialog-footer')).toBeInTheDocument();
  });

  it('should render title', async () => {
    const { getByText } = renderDailogWrapper();
    expect(getByText(getProps().title)).toBeInTheDocument();
  });

  it('should call onClickCancel when click on outside of dialog', async () => {
    const { getByTestId } = renderDailogWrapper();
    fireEvent.click(getByTestId('dialog-slide-in-view'));
    expect(onClickCancel).toHaveBeenCalled();
  });
});

function renderDailogWrapper() {
  return render(<DialogWrapper {...getProps()} />);
}
