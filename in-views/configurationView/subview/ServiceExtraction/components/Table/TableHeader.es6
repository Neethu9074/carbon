import React from 'react';

import './TableHeader.less';

const block = 'in-objectives-table-header';

export default function TableHeader() {
  return (
    <div className={block}>
      <Header />

      <Header>
        Name
      </Header>

      <Header>
        Enabled
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
