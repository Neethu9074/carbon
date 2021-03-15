/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

import GlobeView from 'in-websites/WebsiteDashboard/components/GlobeView';

export default {
  title: 'Molecules|Globe',
  parameters: {
    // Error: creating WebGL context. - not possible on Chromatic
    chromatic: { disable: true }
  },
  component: GlobeView
};

export function Default() {
  return <GlobeView />;
}
