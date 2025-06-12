/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { StepOne } from 'in-plg/components/NoviceToPro/RoleSelector/StepOne';

jest.mock('in-i18n', () => ({
  t: jest.fn(key => {
    const translations = {
      'in-plg:trialNoviceToProDialog.yourRole': 'Your Role',
      'in-plg:trialNoviceToProDialog.roleName': 'Role Name'
    } as any;
    return translations[key] || key;
  })
}));

describe('StepOne Component', () => {
  const setSelectedRole = jest.fn();
  const setCustomRole = jest.fn();
  const setChecked = jest.fn();

  const renderComponent = (props = {}) =>
    render(
      <StepOne
        selectedRole={null}
        setSelectedRole={setSelectedRole}
        customRole=""
        setCustomRole={setCustomRole}
        checked={false}
        setChecked={setChecked}
        {...props}
      />
    );

  it('renders all role tiles', () => {
    renderComponent();
    const radioTiles = screen.getAllByRole('radio');
    expect(radioTiles.length).toBe(11);
  });

  it('selects a role when clicked', () => {
    renderComponent();
    const radioTiles = screen.getAllByRole('radio');
    fireEvent.click(radioTiles[0]); // Click first role
    expect(setSelectedRole).toHaveBeenCalled();
  });

  it('shows custom role input when "other" is selected', () => {
    renderComponent({ selectedRole: 'other' });
    expect(screen.getByLabelText(/your role/i)).toBeInTheDocument();
  });

  it('updates custom role input', () => {
    renderComponent({ selectedRole: 'other' });
    const input = screen.getByLabelText(/your role/i);
    fireEvent.change(input, { target: { value: 'Frontend Developer' } });
    expect(setCustomRole).toHaveBeenCalledWith('Frontend Developer');
  });

  it('toggles the checkbox', () => {
    renderComponent();
    const checkbox = screen.getByRole('checkbox');
    fireEvent.click(checkbox);
    expect(setChecked).toHaveBeenCalledWith(true);
  });
});
