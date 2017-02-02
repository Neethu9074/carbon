import React from 'react';

import Roles from 'in-views/configurationView/subview/RoleConfig/components/Roles';
import SubViewHeader from 'in-views/configurationView/components/SubViewHeader';

export default function RoleConfig() {
  return (
    <div>
      <SubViewHeader>
        Role Configuration
      </SubViewHeader>

      <Roles />
    </div>
  );
}
