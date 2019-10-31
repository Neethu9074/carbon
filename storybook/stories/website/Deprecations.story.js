import { withKnobs, boolean } from '@storybook/addon-knobs/react';
import { storiesOf } from '@storybook/react';
import React from 'react';

import DeprecationsPresenter from 'in-websites/WebsiteDashboard/components/Deprecations/DeprecationsPresenter';

import Root from '../_helpers/Root';

storiesOf('Websites/Deprecations', module)
  .addDecorator(withKnobs)
  .add('default', () => <Default />);

function Default() {
  return (
    <Root>
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
    </Root>
  );
}
