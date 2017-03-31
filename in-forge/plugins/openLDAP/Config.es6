import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function ConfigInfo({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="DN">
        {data.get('config.dn')}
      </DescriptionItem>
      <DescriptionItem title="CN">
        {data.get('config.cn')}
      </DescriptionItem>
      <DescriptionItem title="Object Class">
        {data.get('config.objectClass')}
      </DescriptionItem>
      <DescriptionItem title="Olc Args File">
        {data.get('config.olcArgsFile')}
      </DescriptionItem>
      <DescriptionItem title="Olc Log Level">
        {data.get('config.olcLogLevel')}
      </DescriptionItem>
      <DescriptionItem title="Olc Pid File">
        {data.get('config.olcPidFile')}
      </DescriptionItem>
      <DescriptionItem title="Olc Tool Threads">
        {data.get('config.olcToolThreads')}
      </DescriptionItem>
    </DescriptionList>
  );
}
