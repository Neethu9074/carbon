import React from 'react';

import { getUniqueErrors, Error } from 'in-new-components/Errors/ErroneousResultPresenter';
import { Tr, Td } from 'in-components/tables/sharedComponents/Table';

export default function ErrorRows({ cols, size, errors }) {
  return getUniqueErrors(errors).map(error => (
    <Tr key={error} size={size}>
      <Td colSpan={cols}>
        <Error>{error}</Error>
      </Td>
    </Tr>
  ));
}
