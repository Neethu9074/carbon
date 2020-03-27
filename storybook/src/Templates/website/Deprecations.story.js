import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import React from 'react';

import DeprecationsPresenter from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';

export default {
  title: 'Templates|website/Deprecations',
  component: DeprecationsPresenter,
  decorators: [withKnobs]
};

export function Default() {
  return (
    <DeprecationsPresenter
      websiteId="790jk_3dsaikhu90321"
      tagFilters={[]}
      result={{
        data: [
          boolean('Cross Region Forwarding Deprecation?', true) && 'xrf',
          boolean('Edmunds Hack Deprecation?', true) && 'eh',
          boolean('Unknown Deprecation?', true) && 'unsupported!'
        ]
      }}
    />
  );
}
