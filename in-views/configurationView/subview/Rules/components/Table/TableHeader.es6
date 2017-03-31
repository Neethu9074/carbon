import React from 'react';

import './TableHeader.less';

const block = 'in-rules-table-header';

export default function TableHeader() {
  return (
    <div className={block}>
      <Header>
        Name
      </Header>

      <Header>
        Entity Type
      </Header>

      <Header />
    </div>
  );
}

function Header({ children }) {
  return (
    <h3 className={`${block}__column_heading`}>
      {children}
    </h3>
  );
}
