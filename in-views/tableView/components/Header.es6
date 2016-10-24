import React from 'react';

import HeaderTitle from 'in-views/tableView/components/HeaderTitle';

import './Header.less';

const block = 'in-table-view-header';

export default function Header() {
  return (
    <header className={block}>
      <HeaderTitle>
        Hosts
      </HeaderTitle>
    </header>
  );
}
