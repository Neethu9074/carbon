import React from 'react';

import { Tr, Td } from 'in-components/tables/sharedComponents/Table';
import SvgIcon from 'in-components/SvgIcon';
import Link from 'in-components/Link';

import locals from './LoadMoreRow.mless';

export default function LoadMoreRow({ cols, loadMore, label = 'Load More', depth }) {
  return (
    <Tr depth={depth}>
      <Td colSpan={cols}>
        <Link
          href=""
          className={locals.link}
          onClick={e => {
            e.preventDefault();
            e.stopPropagation();
            loadMore();
          }}
        >
          <SvgIcon type="plus_without_frame" width={8} className={locals.icon} />
          {label}
        </Link>
      </Td>
    </Tr>
  );
}
