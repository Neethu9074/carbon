import { storiesOf } from '@storybook/react';
import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';
import Root from '../../_helpers/Root';

storiesOf('old_components/sdk/Descriptions', module)
  .add('KV', () => <KV />)
  .add('Multiple', () => <Multiple />);

function KV() {
  return (
    <Root>
      <DescriptionList>
        <DescriptionItem title="Title">Value</DescriptionItem>
      </DescriptionList>
    </Root>
  );
}

function Multiple() {
  return (
    <Root>
      <DescriptionList>
        <DescriptionItem title="OS">Linux 3.13.0-133-generic (amd64)</DescriptionItem>
        <DescriptionItem title="CPU">8 x Intel Xeon E5-2670 v2 @ 2.50GHz</DescriptionItem>
        <DescriptionItem title="Memory">60 GB</DescriptionItem>
        <DescriptionItem title="Hostname">0254d459-9fcb-49d6-8514-ab829f290a39</DescriptionItem>
        <DescriptionItem title="Started At">2017-10-18 22:05:21 (1mo 25d 2h 33m)</DescriptionItem>
      </DescriptionList>
    </Root>
  );
}
