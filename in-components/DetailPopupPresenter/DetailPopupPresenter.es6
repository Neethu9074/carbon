import React from 'react';

import {content$, contentFilter$} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterContentStore';
import {position$} from 'in-components/DetailPopupPresenter/stores/DetailPopupPresenterYPositionStore';
import Header from 'in-components/DetailPopupPresenter/components/Header';
import connectTo from 'in-hoc/connectTo';

import './DetailPopupPresenter.less';


const block = 'in-detail-popup';

export default connectTo({
    content: content$,
    contentFilter: contentFilter$,
    position: position$
  },
  function DetailPopupPresenter({content, contentFilter, position}) {
    if (!content) {
      return null;
    }

    return (
      <div className={block}
           style={{top: position ? position + 'px' : null}}>
        <Header title={content.title} />
        {createHtmlContent(content.data, contentFilter)}
      </div>
    );
  }
);

function createHtmlContent(data, contentFilter) {
  return data.filter(getFilterPredicate(contentFilter))
             .sortBy((v, k) => k)
             .map((v, k) =>
               <div key={k}
                    className={block + '__item'}>
                 <dt className={block + '__title'}>
                   {k}
                 </dt>
                 <dd className={block + '__text'}>
                   {v}
                 </dd>
               </div>
             )
             .valueSeq()
             .toArray();
}

function getFilterPredicate(filter) {
  if (!filter) {
    return e => e;
  }
  filter = filter.toLowerCase().trim();
  let filterPredicate;

  if (filter.length === 0) {
    filterPredicate = () => true;
  } else {
    filterPredicate = (v, k) => {
      return k.toLowerCase().indexOf(filter) !== -1 ||
        String(v).toLowerCase().indexOf(filter) !== -1;
    };
  }
  return filterPredicate;
}
