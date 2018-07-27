import React from 'react';

import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { newApplicationView } from 'in-applications/navigation/paths';
import Button from 'in-new-components/Button';
import SvgIcon from 'in-components/SvgIcon';
import { role } from 'in-stores/user';

import locals from './EmptyAppList.mless';

export default function EmptyAppList() {
  return (
    <div className={locals.wrapper}>
      <SvgIcon className={locals.icon} type="lib_application" width={56} height={56} />
      <h1 className={locals.title}>Applications</h1>
      <p className={locals.text}>
        Applications provide a means to model environments, sets of services, tenants, or just about anything.
        <br />They can be thought of as perspectives on services and their endpoints.
      </p>
      {role.canConfigureApplications && (
        <Button kind="create" href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}>
          Create Application
        </Button>
      )}
    </div>
  );
}
