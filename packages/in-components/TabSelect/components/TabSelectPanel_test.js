/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render } from '@testing-library/react';
import React from 'react';

import { TabSelectContext } from 'in-components/TabSelect/context';
import { TabSelectPanel } from '..';

describe('in-components/TabSelect/components/TabSelectPanel', () => {
  it('renders as active if activePanelId in context equals the given id', () => {
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
        <TabSelectPanel id={activePanelId}>Foo</TabSelectPanel>
      </TabSelectContext.Provider>
    );

    // Then
    expect(baseElement.querySelector('.local-css-panel').className).toContain('local-css-panelActive');
  });

  it('renders as inactive if activePanelId in context does not equal the given id', () => {
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
        <TabSelectPanel id={activePanelId}>Foo</TabSelectPanel>
      </TabSelectContext.Provider>
    );

    // Then
    expect(baseElement.querySelector('.local-css-panel').className).not.toContain('local-css-panelActive');
  });
});
