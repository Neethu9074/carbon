/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import { render, fireEvent } from '@testing-library/react';
import React from 'react';

import { TabSelectItem } from 'in-components/TabSelect/components/TabSelectItem';
import TabSelect from 'in-components/TabSelect/components/TabSelect';
import { TabSelectMenu, TabSelectPanel, TabSelectPanels } from '..';

describe('in-components/TabSelect/components/TabSelect', () => {
  it('initially activates the correct item and panel', () => {
    // Given
    const activePanelId = 'panel-bar';

    // When
    const { baseElement } = render(
      <TabSelect activePanelId={activePanelId}>
        <TabSelectMenu>
          <TabSelectItem forId="panel-foo">Foo</TabSelectItem>
          <TabSelectItem forId="panel-bar">Bar</TabSelectItem>
        </TabSelectMenu>
        <TabSelectPanels>
          <TabSelectPanel id="panel-foo">Panel Foo</TabSelectPanel>
          <TabSelectPanel id="panel-bar">Panel Bar</TabSelectPanel>
        </TabSelectPanels>
      </TabSelect>
    );

    // Then
    expect(baseElement.querySelector('.local-css-itemActive')).toHaveTextContent('Bar');
    expect(baseElement.querySelector('.local-css-panelActive')).toHaveTextContent('Panel Bar');
  });

  it('calls onChange event with correct params if an TabSelectItem has been clicked', () => {
    // Given
    const onChangeHandler = jest.fn();

    // When
    const { getAllByRole } = render(
      <TabSelect onChange={onChangeHandler}>
        <TabSelectMenu>
          <TabSelectItem forId="panel-foo">Foo</TabSelectItem>
          <TabSelectItem forId="panel-bar">Bar</TabSelectItem>
        </TabSelectMenu>
        <TabSelectPanels>
          <TabSelectPanel id="panel-foo">Panel Foo</TabSelectPanel>
          <TabSelectPanel id="panel-bar">Panel Bar</TabSelectPanel>
        </TabSelectPanels>
      </TabSelect>
    );

    fireEvent.click(getAllByRole('button')[1]);

    // Then
    expect(onChangeHandler).toHaveBeenNthCalledWith(1, 'panel-bar');
  });
});
