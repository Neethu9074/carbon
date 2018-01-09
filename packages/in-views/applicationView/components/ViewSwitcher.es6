import React from 'react';

import { applicationsPath, servicesPath } from 'in-stores/navigation/paths/mainPaths';
import { getView } from 'in-stores/navigation/navigation';
import Link from 'in-components/Link';

import locals from './ViewSwitcher.mless';

export default function ViewSwitcher() {
  return (
    <div className={locals.wrapper}>
      <Link className={locals.link} href$={getView(applicationsPath)}>
        Applications
      </Link>
      <Link className={locals.link} href$={getView(servicesPath)}>
        Services
      </Link>
    </div>
  );
}
