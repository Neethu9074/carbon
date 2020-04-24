import React from 'react';

import TechnologyIndicatorList from 'in-applications/components/TechnologyIndicator/TechnologyIndicatorList';
import registry from 'in-applications/technologyRegistry';

export default {
  title: 'Atoms|TechnologyIndicatorList',
  component: TechnologyIndicatorList
};

export function Default() {
  return (
    <div>
      <TechnologyIndicatorList technologies={Object.keys(registry)} responsive={false} />
      <br />
      <TechnologyIndicatorList technologies={Object.keys(registry)} />
    </div>
  );
}
