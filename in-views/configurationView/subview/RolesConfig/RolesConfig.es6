import React from 'react';

import Roles from 'in-views/configurationView/subview/RolesConfig/components/Roles';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';

export default function RolesConfig() {
  return (
    <div>
      <SubViewHeader>
        Role Configuration
      </SubViewHeader>

      <Roles />
    </div>
  );
}
