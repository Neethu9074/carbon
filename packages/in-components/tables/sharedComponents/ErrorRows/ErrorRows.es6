import React from 'react';

import { getUniqueErrors } from 'in-new-components/ErroneousResultPresenter';
import { Tr, Td } from 'in-components/tables/sharedComponents/Table';

import locals from './ErrorRows.mless';

export default function ErrorRows({ cols, errors }) {
  return getUniqueErrors(errors).map(error => (
    <Tr key={error}>
      <Td colSpan={cols} className={locals.error}>
        {error}
      </Td>
    </Tr>
  ));
}
