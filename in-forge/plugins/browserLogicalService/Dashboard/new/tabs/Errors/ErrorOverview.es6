import React from 'react';

import ErrorTable from 'in-forge/plugins/browserLogicalService/Dashboard/new/tabs/Errors/ErrorTable';

export default function ErrorOverview(props) {
  return (
    <div>
      <ErrorTable {...props} />
    </div>
  );
}
