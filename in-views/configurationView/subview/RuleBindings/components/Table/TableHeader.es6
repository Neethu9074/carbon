import React from 'react';

import './TableHeader.less';


const block = 'in-rule-bindings-table-header';

export default function TableHeader() {
  return (
    <div className={block}>
      <Header>
        Text
      </Header>

      <Header>
        Enabled
      </Header>

      <Header />
    </div>
  );
}

function Header({children}) {
  return (
    <h3 className={`${block}__column_heading`}>
      {children}
    </h3>
  );
}
