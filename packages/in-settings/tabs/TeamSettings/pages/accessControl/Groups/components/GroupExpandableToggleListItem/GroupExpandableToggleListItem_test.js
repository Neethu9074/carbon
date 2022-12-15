/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, screen, fireEvent } from '@testing-library/react';
import React from 'react';

import { GroupExpandableToggleListItem } from 'in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/GroupExpandableToggleListItem';

describe('/in-settings/tabs/TeamSettings/pages/accessControl/Groups/components/GroupExpandableToggleListItem', () => {
  beforeEach(jest.clearAllMocks);

  it('does not show children with isExpanded prop set to false', () => {
    // Given
    const nestedText = 'Mic check';
    const isExpanded = false;

    // When
    render(
      <GroupExpandableToggleListItem headline="something" iconType="lib_release_rocket" isExpanded={isExpanded}>
        {nestedText}
      </GroupExpandableToggleListItem>
    );
    const children = screen.queryByText(nestedText);

    // Then
    expect(children).toBeNull();
  });

  it('shows children with isExpanded prop set to true', () => {
    // Given
    const nestedText = 'Mic check';
    const isExpanded = true;

    // When
    render(
      <GroupExpandableToggleListItem headline="something" iconType="lib_release_rocket" isExpanded={isExpanded}>
        {nestedText}
      </GroupExpandableToggleListItem>
    );
    const children = screen.queryByText(nestedText);

    // Then
    expect(children).toBeInTheDocument();
  });

  it('triggers onToggle prop func on toggle click', () => {
    // Given
    const onToggle = jest.fn();

    // When
    render(<GroupExpandableToggleListItem headline="something" iconType="lib_release_rocket" onToggle={onToggle} />);
    const toggleElement = screen.getByRole('checkbox');
    fireEvent.click(toggleElement);

    // Then
    expect(onToggle).toBeCalledTimes(1);
  });
});
