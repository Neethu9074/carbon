import React from 'react';

import CustomEndpointMappingDialog from 'in-applications/Forms/CustomEndpointMapping/CustomEndpointMappingDialog';
import EndpointConfigSwitcher from 'in-applications/Forms/EndpointConfigSwitcher';
import MultiConfigView from 'in-applications/Forms/components/MultiConfigView';

export default function CustomEndpointMapping(props) {
  return (
    <MultiConfigView
      viewSwitcher={<EndpointConfigSwitcher />}
      configView={<CustomEndpointMappingDialog {...props} />}
    />
  );
}
