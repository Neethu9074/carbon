/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import TabSelectContext from 'in-components/TabSelect/context';
import { TabSelectItem } from 'in-components/TabSelect';

describe('in-components/TabSelect/components/TabSelectItem', () => {
  it('renders without radio button if withRadioButton is false', () => {
    // Given
    const withRadioButton = false;

    // When
    const { baseElement } = render(<TabSelectItem withRadioButton={withRadioButton}>Foo</TabSelectItem>);

    // Then
    expect(baseElement.querySelector('input.cds--radio-button')).toBeNull();
  });

  it('renders with radio button if withRadioButton is true', () => {
    // Given
    const withRadioButton = true;

    // When
    const { baseElement } = render(<TabSelectItem withRadioButton={withRadioButton}>Foo</TabSelectItem>);

    // Then
    expect(baseElement.querySelector('input.cds--radio-button')).not.toBeNull();
  });

  it('renders as active if activePanelId in context equals the given forId', () => {
    // Given
    const activePanelId = 'panel-1';

    // When
    const { baseElement } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId,
          onChange: () => {}
        }}
      >
        <TabSelectItem forId={activePanelId} withRadioButton>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    // Then
    expect(baseElement.querySelector('.local-css-item').className).toContain('local-css-itemActive');
    expect(baseElement.querySelector('input.cds--radio-button')).toBeChecked();
  });

  it('renders as inactive if activePanelId in context does not equal the given forId', () => {
    // Given
    const activePanelId = 'panel-1';

    // When
    const { baseElement } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: 'panel-2',
          onChange: () => {}
        }}
      >
        <TabSelectItem forId={activePanelId} withRadioButton>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    // Then
    expect(baseElement.querySelector('.local-css-item').className).not.toContain('local-css-itemActive');
    expect(baseElement.querySelector('input.cds--radio-button')).not.toBeChecked();
  });

  it('renders as disabled if disabled is set to true', () => {
    // Given
    const disabled = true;

    // When
    const { baseElement } = render(
      <TabSelectItem disabled={disabled} withRadioButton>
        Foo
      </TabSelectItem>
    );

    // Then
    expect(baseElement.querySelector('.local-css-item').className).toContain('local-css-itemDisabled');
    expect(baseElement.querySelector('.local-css-itemBody').className).toContain('local-css-itemDisabled');
    expect(baseElement.querySelector('input.cds--radio-button')).toBeDisabled();
  });

  it('calls context setter with correct params if item has been clicked and a forId is provided', () => {
    // Given
    const forId = 'panel-1';
    const onChange = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          onChange
        }}
      >
        <TabSelectItem forId={forId}>Foo</TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('button'));

    // Then
    expect(onChange).toHaveBeenNthCalledWith(1, 'panel-1');
  });

  it('calls context setter with correct params if item has been clicked, a forId is provided and withRadioButton is true', () => {
    // Given
    const forId = 'panel-1';
    const withRadioButton = true;
    const onChange = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          onChange
        }}
      >
        <TabSelectItem forId={forId} withRadioButton={withRadioButton}>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('radio'));

    // Then
    expect(onChange).toHaveBeenNthCalledWith(1, 'panel-1');
  });

  it('does not call context setter if item has been clicked and a forId is not provided', () => {
    // Given
    const onChange = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          onChange
        }}
      >
        <TabSelectItem>Foo</TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('button'));

    // Then
    expect(onChange).not.toHaveBeenCalled();
  });

  it('does not call context setter if item is disabled, has been clicked and a forId is provided', () => {
    // Given
    const forId = 'panel-1';
    const onChange = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          onChange
        }}
      >
        <TabSelectItem forId={forId} disabled>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('button'));

    // Then
    expect(onChange).not.toHaveBeenCalled();
  });
});
