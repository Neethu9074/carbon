/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import React from 'react';

import { deleteLogsLocalisationStrings } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/localisationStrings';
import { DeleteLogsModal } from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogsModal/DeleteLogsModal';
import DeleteLogs from 'in-settings/tabs/GlobalSettings/pages/logManagement/DeleteLogs/DeleteLogs';

describe('DeleteLogs Component', () => {
  test('renders correctly', () => {
    render(<DeleteLogs />);
    expect(screen.getByText(/Instana logs/i)).toBeInTheDocument();
  });
});

describe('DeleteLogsModal Component', () => {
  let mockSetShowModal: jest.Mock;
  let mockSetIsDeleting: jest.Mock;
  let mockSetRetryCount: jest.Mock;

  beforeEach(() => {
    mockSetShowModal = jest.fn();
    mockSetIsDeleting = jest.fn();
    mockSetRetryCount = jest.fn();
  });

  test('renders modal with correct elements', () => {
    render(
      <DeleteLogsModal
        closeModal={mockSetShowModal}
        setIsDeleting={mockSetIsDeleting}
        isDeleting={false}
        setRetryCount={mockSetRetryCount}
        retryCount={0}
        deletionInProgress={false}
      />
    );

    expect(screen.getByText(deleteLogsLocalisationStrings.confirmDeletion)).toBeInTheDocument();
    expect(screen.getByText(deleteLogsLocalisationStrings.modalDescription)).toBeInTheDocument();
    expect(screen.getByLabelText(deleteLogsLocalisationStrings.deletionUntilDate)).toBeInTheDocument();
    expect(screen.getByLabelText(deleteLogsLocalisationStrings.deletionUntilTime)).toBeInTheDocument();
    expect(screen.getByLabelText(deleteLogsLocalisationStrings.deletionReason)).toBeInTheDocument();
    expect(
      screen.getByRole('button', { name: 'danger ' + deleteLogsLocalisationStrings.deleteLogs })
    ).toBeInTheDocument();
  });

  test('allows user to type in inputs', () => {
    render(
      <DeleteLogsModal
        closeModal={mockSetShowModal}
        setIsDeleting={mockSetIsDeleting}
        isDeleting={false}
        setRetryCount={mockSetRetryCount}
        retryCount={0}
        deletionInProgress={false}
      />
    );

    const reasonInput = screen.getByLabelText(deleteLogsLocalisationStrings.deletionReason);
    fireEvent.change(reasonInput, { target: { value: 'Testing reason' } });
    expect(reasonInput).toHaveValue('Testing reason');
  });

  test('calls handleSubmit when delete button is clicked', async () => {
    render(
      <DeleteLogsModal
        closeModal={mockSetShowModal}
        setIsDeleting={mockSetIsDeleting}
        isDeleting={false}
        setRetryCount={mockSetRetryCount}
        retryCount={0}
        deletionInProgress={false}
      />
    );

    const reasonInput = screen.getByLabelText(deleteLogsLocalisationStrings.deletionReason);
    await userEvent.type(reasonInput, 'Test reason');

    const validationInput = screen.getByLabelText(deleteLogsLocalisationStrings.typeValidation);
    await userEvent.type(validationInput, 'LOGS');

    const deleteButton = screen.getByRole('button', { name: 'danger ' + deleteLogsLocalisationStrings.deleteLogs });
    await userEvent.click(deleteButton);

    await waitFor(() => {
      expect(mockSetIsDeleting).toHaveBeenCalledWith(true);
    });
  });

  test('closes modal when cancel button is clicked', () => {
    render(
      <DeleteLogsModal
        closeModal={mockSetShowModal}
        setIsDeleting={mockSetIsDeleting}
        isDeleting={false}
        setRetryCount={mockSetRetryCount}
        retryCount={0}
        deletionInProgress={false}
      />
    );

    const cancelButton = screen.getByRole('button', { name: deleteLogsLocalisationStrings.cancel });
    fireEvent.click(cancelButton);

    expect(mockSetShowModal).toHaveBeenCalled();
  });
});
