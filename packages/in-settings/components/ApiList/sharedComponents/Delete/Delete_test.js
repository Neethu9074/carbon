/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import Delete from 'in-settings/components/ApiList/sharedComponents/Delete';
import { addActiveDialog } from 'in-components/DialogPresenter/store';
import { setActiveTooltip } from 'in-components/Tooltip/store';

jest.mock('in-components/Tooltip/store', () => ({
  clearActiveTooltip: jest.fn(),
  setActiveTooltip: jest.fn()
}));
jest.mock('in-components/DialogPresenter/store', () => ({
  addActiveDialog: jest.fn(),
  close: jest.fn()
}));

describe('in-settings/components/ApiList/sharedComponents/Delete', () => {
  beforeEach(jest.clearAllMocks);

  // Tooltip is rendered far away in the DOM from the original element it is attached to,
  // so the way to test this with react-test-library is to check whether the setter of
  // the content (setActiveTooltip) has been called

  it('renders a delete icon and sets tooltip when tooltipContent prop is provided', () => {
    // When
    render(<Delete tooltipContent="tooltipTest" />);

    const deleteIcon = screen.queryByTestId('deleteIcon');
    fireEvent.mouseEnter(deleteIcon);

    // Then
    expect(deleteIcon).toBeInTheDocument();
    expect(setActiveTooltip).toHaveBeenCalled();
  });

  it('renders a delete icon and does not set the tooltip when no tooltipContent prop is provided', () => {
    // When
    render(<Delete />);

    const deleteIcon = screen.queryByTestId('deleteIcon');
    fireEvent.mouseEnter(deleteIcon);

    // Then
    expect(deleteIcon).toBeInTheDocument();
    expect(setActiveTooltip).not.toHaveBeenCalled();
  });

  it('renders a loading icon when isDeleting prop is set to true', () => {
    // When
    render(<Delete isDeleting />);
    const deleteIcon = screen.queryByTestId('deleteIcon');
    const loadingIcon = screen.queryByTestId('loadingIcon');

    // Then
    expect(deleteIcon).not.toBeInTheDocument();
    expect(loadingIcon).toBeInTheDocument();
  });

  it('does not call addActiveDialog or doDelete when component is disabled', () => {
    // Given
    const doDelete = jest.fn();

    // When
    render(<Delete disabled doDelete={doDelete} />);
    const deleteIcon = screen.queryByTestId('deleteIcon');
    fireEvent.click(deleteIcon);

    // Then
    expect(doDelete).not.toHaveBeenCalled();
    expect(addActiveDialog).not.toHaveBeenCalled();
  });

  it('сalls doDelete, but does not call addActiveDialog when option skipDialog prop is set to true', () => {
    // Given
    const doDelete = jest.fn();

    // When
    render(<Delete doDelete={doDelete} skipDialog />);
    const deleteIcon = screen.queryByTestId('deleteIcon');
    fireEvent.click(deleteIcon);

    // Then
    expect(doDelete).toHaveBeenCalledTimes(1);
    expect(addActiveDialog).not.toHaveBeenCalled();
  });

  it('calls addActiveDialog and does not call doDelete when component is not disabled and skipDialog prop is set to false', () => {
    // Given
    const doDelete = jest.fn();

    // When
    render(<Delete doDelete={doDelete} />);
    const deleteIcon = screen.queryByTestId('deleteIcon');
    fireEvent.click(deleteIcon);

    // Then
    expect(doDelete).not.toHaveBeenCalled();
    expect(addActiveDialog).toHaveBeenCalledTimes(1);
  });
});
