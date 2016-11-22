import React from 'react';

import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import './TwoColumnView.less';

const block = 'in-two-column-view';

export default connectTo({
  timelineHeight: timelineHeight$
},
function TwoColumnView({timelineHeight, leftContent, rightContent, leftWidth = '40rem'}) {
  return (
    <section className={block}
             style={{
               bottom: toPx(timelineHeight)
             }}>
      <div className={`${block}__left`}
           style={{
             maxWidth: leftWidth
           }}>
        {leftContent}
      </div>
      <div className={`${block}__right`}
           style={{
             maxWidth: `calc(100% - ${leftWidth})`
           }}>
        {rightContent}
      </div>
    </section>
  );
});
