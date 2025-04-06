/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

import React from 'react';

// @ts-expect-error import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import { ensureInfraPluginsAreEvaluated } from 'in-sdk/asyncEvaluation';
import registry from 'in-applications/technologyRegistry';

export default {
  parameters: {
    // when only one icon was added/removed this lead to a failing ui-test,
    // so we disable this, because too many changes break it too easily.
    chromatic: { disable: true }
  },
  component: TechnologyIndicatorList
};
ensureInfraPluginsAreEvaluated();
const technologies = Object.keys(registry);

export function Expanded() {
  return <TechnologyIndicatorList technologies={technologies} responsive={false} />;
}

export function Responsive() {
  return <TechnologyIndicatorList technologies={technologies} responsive />;
}
export function Just10Total3ShownExpanded() {
  return <TechnologyIndicatorList technologies={technologies.slice(0, 10)} responsive={false} limit={3} />;
}
export function Just10TotalAllExpandedIeNoLimiterUsed() {
  return <TechnologyIndicatorList technologies={technologies.slice(0, 10)} responsive={false} />;
}
export function AllTech15ShownExpanded() {
  return <TechnologyIndicatorList technologies={technologies} responsive={false} limit={15} />;
}
export function EmptyList() {
  return <TechnologyIndicatorList technologies={[]} responsive={false} limit={15} />;
}
