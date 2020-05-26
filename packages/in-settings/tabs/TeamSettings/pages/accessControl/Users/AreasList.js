import React, { useState } from 'react';

import ApiListRenderer from 'in-settings/components/ApiList/ApiListRenderer';
import { ColumnizedContent, Ul, Li } from 'in-new-components/lists/List';
import KeyValue from 'in-new-components/lists/KeyValue';
import SvgIcon from 'in-components/SvgIcon';

import locals from './AreasDialog.mless';

export default function AreasList({ areasResult }) {
  const [page, setPage] = useState(1);
  return (
    <ApiListRenderer
      itemsResult={areasResult}
      pageSize={10}
      page={page}
      setPage={setPage}
      ListRenderer={ListRenderer}
      orderBy="icon"
    />
  );
}

const columnDefinitions = [
  {
    width: '2rem',
    getContent({ icon }) {
      return <SvgIcon type={icon} />;
    }
  },
  {
    getContent({ id, label, inheritFromGroups, subLabel }) {
      return (
        <KeyValue
          value={label || id}
          label={`${subLabel}, inherit from: ${inheritFromGroups.map(({ name }) => name).join(', ')}`}
          inverted
        />
      );
    }
  }
];

function ListRenderer({ items }) {
  return (
    <>
      <Ul className={locals.list}>
        {items.map((area, i) => (
          <Li key={i}>
            <ColumnizedContent columnDefinitions={columnDefinitions} {...area} />
          </Li>
        ))}
      </Ul>
    </>
  );
}
