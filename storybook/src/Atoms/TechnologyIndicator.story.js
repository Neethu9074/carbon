/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import registry from 'in-applications/technologyRegistry';

export default {
  title: 'Atoms|TechnologyIndicatorList',
  parameters: {
    // when only one icon was added/removed this lead to a failing ui-test,
    // so we disable this, because too many changes break it too easily.
    chromatic: { disable: true }
  },
  component: TechnologyIndicatorList
};

export function Expanded() {
  return <TechnologyIndicatorList technologies={Object.keys(registry)} responsive={false} />;
}

export function Responsive() {
  return <TechnologyIndicatorList technologies={Object.keys(registry)} responsive />;
}
