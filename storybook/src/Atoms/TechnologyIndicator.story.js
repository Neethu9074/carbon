import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import registry from 'in-applications/technologyRegistry';

export default {
  title: 'Atoms/TechnologyIndicatorList',
  component: TechnologyIndicatorList
};

export function Expanded() {
  return <TechnologyIndicatorList technologies={Object.keys(registry)} responsive={false} />;
}

export function Responsive() {
  return <TechnologyIndicatorList technologies={Object.keys(registry)} responsive />;
}
