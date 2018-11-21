import React from 'react';

import SyntheticEndpointsList from 'in-applications/Forms/SyntheticEndpoints/SyntheticEndpointsList';
import EndpointConfigSwitcher from 'in-applications/Forms/EndpointConfigSwitcher';
import MultiConfigView from 'in-applications/Forms/components/MultiConfigView';

export default function SyntheticEndpoints(props) {
  return (
    <MultiConfigView viewSwitcher={<EndpointConfigSwitcher />} configView={<SyntheticEndpointsList {...props} />} />
  );
}
