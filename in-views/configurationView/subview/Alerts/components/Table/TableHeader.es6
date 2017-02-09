import React from 'react';

import './TableHeader.less';


const block = 'in-table-header';

export default function TableHeader() {
  return (
    <div className={block}>
      <Header>
        Id
      </Header>

      <Header>
        Name
      </Header>

      <Header>
        Enabled
      </Header>

      <Header>
        Misc
      </Header>

      <Header />
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
