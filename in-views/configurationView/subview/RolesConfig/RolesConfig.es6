import React from 'react';

import Roles from 'in-views/configurationView/subview/RolesConfig/components/Roles';
import SubViewWrapper from 'in-views/configurationView/components/SubViewWrapper';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';

export default function RolesConfig() {
  return (
    <SubViewWrapper>
      <SubViewHeader>
        Role Configuration
      </SubViewHeader>

      <Roles />
    </SubViewWrapper>
  );
}
