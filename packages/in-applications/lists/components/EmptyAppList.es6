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
      <h1 className={locals.title}>Application Perspectives</h1>
      <p className={locals.text}>
        Application perspectives provide a means to model environments, sets of services, tenants, or just about
        anything.
      </p>
      {role.canConfigureApplications ? (
        <Button kind="create" href$={getModifiedUrlStream(p => (p.pathname = newApplicationView))}>
          Create Application Perspective
        </Button>
      ) : (
        <p>They will appear here once an account administrator creates them. Until then, click on Services above.</p>
      )}
    </div>
  );
}
