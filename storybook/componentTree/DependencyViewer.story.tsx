/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import type { StoryObj } from '@storybook/react';
import React from 'react';

import CompTree from './CompTree';
import pathTree from './uiClientPaths.json';
import dependOn from './uiClientDep.json';
import dependBy from './uiClientDepRev.json';

type Story = StoryObj<typeof CompTree>;

export default {
  component: CompTree
};

export const ComponentDependency = () => <CompTree pathTree={pathTree} dependBy={dependBy} dependOn={dependOn} />;
export const CrossAreaDependency = () => <CompTree pathTree={pathTree} dependBy={dependBy} dependOn={dependOn} title="Cross area component dependency" filter="crossarea"/>;
