/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { TabSelectContext } from 'in-components/TabSelect/context';
import { TabSelectItem } from 'in-components/TabSelect';

describe('in-components/TabSelect/components/TabSelectItem', () => {
  it('renders without radio button if withRadioButton is false', () => {
    // Given
    const withRadioButton = false;

    // When
    const { baseElement } = render(<TabSelectItem withRadioButton={withRadioButton}>Foo</TabSelectItem>);

    // Then
    expect(baseElement.querySelector('input.local-css-control')).toBeNull();
  });

  it('renders with radio button if withRadioButton is true', () => {
    // Given
    const withRadioButton = true;

    // When
    const { baseElement } = render(<TabSelectItem withRadioButton={withRadioButton}>Foo</TabSelectItem>);

    // Then
    expect(baseElement.querySelector('input.local-css-control')).not.toBeNull();
  });

  it('renders as active if activePanelId in context equals the given forId', () => {
    // Given
    const activePanelId = 'panel-1';

    // When
    const { baseElement } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId,
          setActivePanelId: () => {}
        }}
      >
        <TabSelectItem forId={activePanelId} withRadioButton>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    // Then
    expect(baseElement.querySelector('.local-css-item').className).toContain('local-css-itemActive');
    expect(baseElement.querySelector('input.local-css-control')).toBeChecked();
  });

  it('renders as inactive if activePanelId in context does not equal the given forId', () => {
    // Given
    const activePanelId = 'panel-1';

    // When
    const { baseElement } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: 'panel-2',
          setActivePanelId: () => {}
        }}
      >
        <TabSelectItem forId={activePanelId} withRadioButton>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    // Then
    expect(baseElement.querySelector('.local-css-item').className).not.toContain('local-css-itemActive');
    expect(baseElement.querySelector('input.local-css-control')).not.toBeChecked();
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
    expect(baseElement.querySelector('input.local-css-control')).toBeDisabled();
  });

  it('calls context setter with correct params if item has been clicked and a forId is provided', () => {
    // Given
    const forId = 'panel-1';
    const value = 'some-value';
    const setActivePanelId = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          setActivePanelId
        }}
      >
        <TabSelectItem forId={forId} value={value}>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('button'));

    // Then
    expect(setActivePanelId).toHaveBeenNthCalledWith(1, 'panel-1', 'some-value');
  });

  it('calls context setter with correct params if item has been clicked, a forId is provided and withRadioButton is true', () => {
    // Given
    const forId = 'panel-1';
    const value = 'some-value';
    const withRadioButton = true;
    const setActivePanelId = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          setActivePanelId
        }}
      >
        <TabSelectItem forId={forId} value={value} withRadioButton={withRadioButton}>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('checkbox'));

    // Then
    expect(setActivePanelId).toHaveBeenNthCalledWith(1, 'panel-1', 'some-value');
  });

  it('does not call context setter if item has been clicked and a forId is not provided', () => {
    // Given
    const setActivePanelId = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          setActivePanelId
        }}
      >
        <TabSelectItem>Foo</TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('button'));

    // Then
    expect(setActivePanelId).not.toHaveBeenCalled();
  });

  it('does not call context setter if item is disabled, has been clicked and a forId is provided', () => {
    // Given
    const forId = 'panel-1';
    const value = 'some-value';
    const setActivePanelId = jest.fn();

    // When
    const { getByRole } = render(
      <TabSelectContext.Provider
        value={{
          activePanelId: undefined,
          setActivePanelId
        }}
      >
        <TabSelectItem forId={forId} value={value} disabled>
          Foo
        </TabSelectItem>
      </TabSelectContext.Provider>
    );

    fireEvent.click(getByRole('button'));

    // Then
    expect(setActivePanelId).not.toHaveBeenCalled();
  });
});
