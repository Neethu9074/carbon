import React from 'react';

import { applicationId as matrixApplicationId } from 'in-applications/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import Link from 'in-components/Link';

import locals from './ApplicationSwitcher.mless';

export default function ApplicationSwitcher({ applications, viewPath, close }) {
  return (
    <ul className={locals.menu}>
      {applications.data.items.map(item => (
        <li key={item.application.id} className={locals.row}>
          <Link
            onClick={close}
            href$={getModifiedUrlStream(params =>
              setOrDeleteMatrixKey(params, viewPath, matrixApplicationId, item.application.id)
            )}
            className={locals.link}
          >
            {item.application.label}
          </Link>
        </li>
      ))}
    </ul>
  );
}
