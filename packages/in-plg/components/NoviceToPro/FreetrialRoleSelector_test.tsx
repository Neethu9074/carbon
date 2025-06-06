/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import FreetrialRoleSelector from 'in-plg/components/NoviceToPro/FreetrialRoleSelector';

jest.mock('@instana/ibm-products', () => ({
  Tearsheet: ({ children, actions }: any) => (
    <div data-testid="tearsheet">
      {children}
      {actions?.map((action: any) => (
        <button key={action.label} disabled={action.disabled} onClick={action.onClick}>
          {action.label}
        </button>
      ))}
    </div>
  )
}));

jest.mock('@carbon/react', () => ({
  ...jest.requireActual('@carbon/react'),
  ProgressIndicator: ({ children, onChange }: any) => (
    <div data-testid="progress-indicator">
      <button onClick={() => onChange(1)}>stepTwo</button>
      {children}
    </div>
  ),
  ProgressStep: ({ label, current, index }: any) => (
    <div data-testid={`progress-step-${index}`} aria-current={current ? 'step' : undefined}>
      {label}
    </div>
  ),
  Typography: ({ children, variant }: any) => {
    if (variant === 'heading-04') {
      return <h4 data-testid="freetrial-header-title">{children}</h4>;
    }
    return <span>{children}</span>;
  }
}));

jest.mock('in-plg/components/NoviceToPro/assets/RoleSelector.png', () => 'mock-image-path');

const mockProps = {
  selectedRole: 'Developer',
  setSelectedRole: jest.fn(),
  customRole: '',
  setCustomRole: jest.fn(),
  handleSubmit: jest.fn(),
  currentStep: 0,
  setCurrentStep: jest.fn(),
  checked: false,
  setChecked: jest.fn()
};

jest.mock('in-i18n', () => ({
  t: (key: string, options?: any) => {
    if (key === 'in-plg:trialNoviceToProDialog.welcometitle' && options?.username) {
      return `Welcome, ${options.username}`;
    }
    if (key === 'in-plg:trialNoviceToProDialog.steps.stepOne') return 'stepOne';
    if (key === 'in-plg:trialNoviceToProDialog.steps.stepTwo') return 'stepTwo';
    if (key === 'in-plg:trialNoviceToProDialog.next') return 'Next';
    return key;
  }
}));

jest.mock('in-stores/user', () => ({
  useUser: () => ({ fullName: 'Jane Doe' })
}));

describe('FreetrialRoleSelector', () => {
  it('disables Next button if selectedRole is empty', () => {
    render(<FreetrialRoleSelector {...mockProps} selectedRole="" currentStep={0} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('disables Next button if selectedRole is "other" and customRole is empty', () => {
    render(<FreetrialRoleSelector {...mockProps} selectedRole="other" customRole=" " currentStep={0} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });

  it('enables Next button if selectedRole is "other" and customRole is filled', () => {
    render(<FreetrialRoleSelector {...mockProps} selectedRole="other" customRole="My Custom Role" />);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).not.toBeDisabled();
  });

  it('enables Next button if selectedRole is valid and not "other"', () => {
    render(<FreetrialRoleSelector {...mockProps} selectedRole="Developer" />);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).not.toBeDisabled();
  });

  it('calls handleSubmit when selectedRole is "other" and customRole is provided', () => {
    const mockHandleSubmit = jest.fn();
    render(
      <FreetrialRoleSelector
        {...mockProps}
        selectedRole="other"
        customRole="My Custom Role"
        handleSubmit={mockHandleSubmit}
      />
    );
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('renders role selector image', () => {
    render(<FreetrialRoleSelector {...mockProps} />);
    const image = screen.getByAltText('Visual');
    expect(image).toHaveAttribute('src', 'mock-image-path');
  });

  it('calls handleSubmit when selectedRole is a valid predefined role', () => {
    const mockHandleSubmit = jest.fn();
    render(
      <FreetrialRoleSelector {...mockProps} selectedRole="Developer" customRole="" handleSubmit={mockHandleSubmit} />
    );
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    expect(mockHandleSubmit).toHaveBeenCalledTimes(1);
  });

  it('does not show Next button when currentStep is not 0', () => {
    render(<FreetrialRoleSelector {...mockProps} currentStep={1} />);
    expect(screen.queryByRole('button', { name: 'Next' })).toBeNull();
  });

  it('disables Next button if customRole has only whitespace', () => {
    render(<FreetrialRoleSelector {...mockProps} selectedRole="other" customRole="    " />);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    expect(nextButton).toBeDisabled();
  });

  it('renders tearsheet with correct test id', () => {
    render(<FreetrialRoleSelector {...mockProps} />);
    expect(screen.getByTestId('tearsheet')).toBeInTheDocument();
  });

  it('disables Next button if selectedRole is null', () => {
    render(<FreetrialRoleSelector {...mockProps} selectedRole={null} />);
    expect(screen.getByRole('button', { name: 'Next' })).toBeDisabled();
  });
  it('does not call handleSubmit when Next button is disabled and clicked', () => {
    const mockHandleSubmit = jest.fn();
    render(<FreetrialRoleSelector {...mockProps} selectedRole="" handleSubmit={mockHandleSubmit} />);
    const nextButton = screen.getByRole('button', { name: 'Next' });
    fireEvent.click(nextButton);
    expect(mockHandleSubmit).not.toHaveBeenCalled();
  });
});
