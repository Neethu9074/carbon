import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function WebApiSpanDetailView({ span }) {
  const binding = span.getIn(['data', 'wcfclient', 'binding']);
  const oneway = span.getIn(['data', 'wcfclient', 'oneway']);
  const channeltype = span.getIn(['data', 'wcfclient', 'channel']);

  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Url">
          {span.getIn(['data', 'wcfclient', 'url'])}
        </DescriptionItem>
        <DescriptionItem title="Contract-Type">
          {span.getIn(['data', 'wcfclient', 'service'])}
        </DescriptionItem>
        <DescriptionItem title="Method">
          {span.getIn(['data', 'wcfclient', 'method'])}
        </DescriptionItem>
        <DescriptionItem title="Binding">
          {binding ? binding : 'unknown'}
        </DescriptionItem>
        <DescriptionItem title="Oneway">
          {oneway ? oneway : 'no'}
        </DescriptionItem>
        <DescriptionItem title="Channel">
          {channeltype ? channeltype : 'unknown'}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
