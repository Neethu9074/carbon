import React from 'react';

import LogLines from 'in-views/logView/LogLines';

export default function LogView({children}) {
  return (
    <div>
      <LogLines />
      {children}
    </div>
  );
}
