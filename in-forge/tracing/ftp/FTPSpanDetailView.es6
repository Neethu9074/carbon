import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function FTPSpanDetailView({ span }) {
  return (
    <div>
      <DescriptionList>
        <DescriptionItem title="Host">
          {span.getIn(['data', 'ftp', 'host'])}
        </DescriptionItem>
        <DescriptionItem title="Port">
          {span.getIn(['data', 'ftp', 'port'])}
        </DescriptionItem>
        <DescriptionItem title="Command">
          {span.getIn(['data', 'ftp', 'command'])}
        </DescriptionItem>
        <DescriptionItem title="Type">
          {span.getIn(['data', 'ftp', 'type'])}
        </DescriptionItem>
        <DescriptionItem title="File">
          {span.getIn(['data', 'ftp', 'file'])}
        </DescriptionItem>
      </DescriptionList>
    </div>
  );
}
