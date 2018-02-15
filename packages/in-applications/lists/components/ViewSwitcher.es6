import React from 'react';

import { applicationsList, servicesList } from 'in-applications/navigation/paths';
import { isView, getView } from 'in-stores/navigation/navigation';
import connectTo from 'in-hoc/connectTo';
import Link from 'in-components/Link';

import locals from './ViewSwitcher.mless';

export default connectTo(
  {
    isServiceViewActive: isView(servicesList)
  },
  function ViewSwitcher({ isServiceViewActive }) {
    return (
      <ul className={locals.wrapper}>
        <ViewLink path={applicationsList} isActive={!isServiceViewActive}>
          Applications
        </ViewLink>
        <ViewLink path={servicesList} isActive={isServiceViewActive}>
          Services
        </ViewLink>
      </ul>
    );
  }
);

function ViewLink({ children, path, isActive }) {
  let classes = locals.link;
  if (isActive) {
    classes += ` ${locals.active}`;
  }

  return (
    <Link className={classes} href$={getView(path)}>
      <li>{children}</li>
    </Link>
  );
}
