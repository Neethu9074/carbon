import React from 'react';

import PopUpable from 'in-components/PopUpable';

import './KeyValuePopup.less';

const block = 'in-key-value-popup';

export default function KeyValuePopup({header, data}) {
  if (data == null || data.size === 0) {
    return null;
  }

  return (
    <PopUpable>
      <PopUpable.Header>
        {header}
      </PopUpable.Header>
      <PopUpable.Content>
        {data.sortBy((v, k) => k).map((v, k) =>
          <div key={k}
               className={block + '__item'}>
            <dt className={block + '__title'}>
              {k}
            </dt>
            <dd className={block + '__text'}>
              {v}
            </dd>
          </div>
        ).valueSeq().toArray()}
      </PopUpable.Content>
    </PopUpable>
  );
}
