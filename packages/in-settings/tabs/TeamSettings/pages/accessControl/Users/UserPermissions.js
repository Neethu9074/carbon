import React from 'react';

import { productPermissions } from 'in-stores/permission';
import { pendingResult } from 'in-services/fixedObjects';
import useObservable from 'in-hooks/useObservable';
import { getPermissions } from 'in-api/users';
import Pill from 'in-new-components/Pill';
import theme from 'in-themes';

import locals from './UserPermissions.mless';

export default function UserPermissions({ userId }) {
  const permissions = useObservable(getPermissions(userId), [userId]) ?? pendingResult;
  return (
    <div className={locals.grid}>
      {productPermissions.map(({ value, label }) => {
        return (
          <Pill
            key={value}
            color={permissions.data?.includes(value) ? theme.lib.colors.teal800 : theme.lib.colors.N400}
          >
            {label}
          </Pill>
        );
      })}
    </div>
  );
}
