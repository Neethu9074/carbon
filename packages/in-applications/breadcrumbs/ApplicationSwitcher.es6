import React from 'react';

import { applicationId as matrixApplicationId } from 'in-applications/navigation/matrix';
import { getModifiedUrlStream } from 'in-stores/navigation/navigation';
import { setOrDeleteMatrixKey } from 'in-stores/navigation/matrix';
import Link from 'in-components/Link';

import locals from './ApplicationSwitcher.mless';

// width of the popup
const width = 400;

export default function ApplicationSwitcher({ applications, viewPath, onClose, coords }) {
  return (
    <ul
      className={locals.menu}
      style={{
        left: `${Math.max(0, coords.x - width / 2)}px`
      }}
    >
      {applications.data.items.map(item => (
        <li key={item.application.id} className={locals.row}>
          <Link
            onClick={onClose}
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
