import React from 'react';

import {enable, disable, roles$} from 'in-views/configurationView/subview/RolesConfig/stores/roles';
import Role from 'in-views/configurationView/subview/RolesConfig/components/Role';
import LifecycleObserver from 'in-components/LifecycleObserver';
import connectTo from 'in-hoc/connectTo';

export default connectTo({
  roles: roles$
}, function Roles({roles}) {
  return (
    <ul>
      <LifecycleObserver onWillMount={enable}
                         onWillUnmount={disable} />

      {roles.toArray()
          // do not show the fallback role
          .filter(role => role.get('id') !== '-2')
          .map(role =>
        <Role role={role}
              key={role.get('id')} />
      )}
    </ul>
  );
});
