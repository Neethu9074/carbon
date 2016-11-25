import React from 'react';

import {
  setContentFilter,
  contentFilter$
} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import CloseButton from 'in-components/DetailPopupPresenter/components/CloseButton';
import connectTo from 'in-hoc/connectTo';

import 'in-components/DetailPopupPresenter/components/Header.less';


const block = 'in-detail-popup-header';

export default connectTo({
  filter: contentFilter$
},
  function Header({title, filter}) {
    return (
      <div className={block}>
        {title}

        <div className={`${block}__right-side`}>
          <input type='search'
                 value={filter ? filter : ''}
                 onChange={e => setContentFilter(e.target.value)}
                 placeholder='Search…'
                 className={block + '__filter-input'} />

          <CloseButton />
        </div>
      </div>
    );
  }
);
