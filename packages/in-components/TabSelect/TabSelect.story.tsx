/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2022
 */

import React, { useState } from 'react';

import { SvgIcon, Typography } from '@instana/components';

import TabSelect, {
  TabSelectPanels,
  TabSelectHeader,
  TabSelectPanel,
  TabSelectMenu,
  TabSelectItem
} from 'in-components/TabSelect';

export default {
  component: TabSelect
};

export const Simple = () => {
  const [activePanelId, setActivePanelId] = useState('item-1');

  return (
    <TabSelect activePanelId={activePanelId} onChange={setActivePanelId}>
      <TabSelectHeader>
        <SvgIcon type="lib_navigation_stan" size="l" />
        <Typography variant="heading-200" noWrap noMargin>
          Tab selection
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem forId="item-1">Item 1</TabSelectItem>
        <TabSelectItem forId="item-2">Item 2</TabSelectItem>
        <TabSelectItem forId="item-3" disabled>
          Disabled item
        </TabSelectItem>
        <TabSelectItem forId="item-4">Item 4</TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel id="item-1">Panel 1</TabSelectPanel>
        <TabSelectPanel id="item-2">Panel 2</TabSelectPanel>
        <TabSelectPanel id="item-3">Panel 3</TabSelectPanel>
        <TabSelectPanel id="item-4">Panel 4</TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
};

export const WithRadioButton = () => {
  const [activePanelId, setActivePanelId] = useState('item-1');

  return (
    <TabSelect activePanelId={activePanelId} onChange={setActivePanelId}>
      <TabSelectHeader>
        <SvgIcon type="lib_navigation_stan" size="l" />
        <Typography variant="heading-200" noWrap noMargin>
          Tab selection with radio button
        </Typography>
      </TabSelectHeader>
      <TabSelectMenu>
        <TabSelectItem forId="item-1" withRadioButton>
          Item 1
        </TabSelectItem>
        <TabSelectItem forId="item-2" withRadioButton>
          Item 2
        </TabSelectItem>
        <TabSelectItem forId="item-3" withRadioButton>
          Item 3
        </TabSelectItem>
        <TabSelectItem forId="item-4" withRadioButton disabled>
          Disabled item
        </TabSelectItem>
        <TabSelectItem forId="item-5" withRadioButton>
          Item 5
        </TabSelectItem>
      </TabSelectMenu>
      <TabSelectPanels>
        <TabSelectPanel id="item-1">Panel 1</TabSelectPanel>
        <TabSelectPanel id="item-2">Panel 2</TabSelectPanel>
        <TabSelectPanel id="item-3">Panel 3</TabSelectPanel>
        <TabSelectPanel id="item-4">Panel 4</TabSelectPanel>
        <TabSelectPanel id="item-5">Panel 5</TabSelectPanel>
      </TabSelectPanels>
    </TabSelect>
  );
};
