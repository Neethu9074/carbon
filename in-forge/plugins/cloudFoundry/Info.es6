import React from 'react';

import { DescriptionList, DescriptionItem } from 'in-components/DescriptionList';

export default function Info({ snapshot }) {
  const data = snapshot.get('data');

  return (
    <DescriptionList>
      <DescriptionItem title="API version">
        {data.get('info.api_version')}
      </DescriptionItem>
      <DescriptionItem title="App SSH endpoint">
        {data.get('info.app_ssh_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="App SSH endpoint">
        {data.get('info.app_ssh_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="App SSH fingerprint">
        {data.get('info.app_ssh_host_key_fingerprint')}
      </DescriptionItem>
      <DescriptionItem title="App Oauth client">
        {data.get('info.app_ssh_oauth_client')}
      </DescriptionItem>
      <DescriptionItem title="Auth endpoint">
        {data.get('info.auth_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="Doppler logging endpoint">
        {data.get('info.doppler_logging_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="Logging endpoint">
        {data.get('info.logging_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="Routing endpoint">
        {data.get('info.routing_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="Support">
        {data.get('info.support')}
      </DescriptionItem>
      <DescriptionItem title="Token endpoint">
        {data.get('info.token_endpoint')}
      </DescriptionItem>
      <DescriptionItem title="User">
        {data.get('info.user')}
      </DescriptionItem>
      <DescriptionItem title="Version">
        {data.get('info.version')}
      </DescriptionItem>
      <DescriptionItem title="Build number">
        {data.get('info.build_number')}
      </DescriptionItem>
    </DescriptionList>
  );
}
