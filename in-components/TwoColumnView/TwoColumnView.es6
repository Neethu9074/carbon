import React from 'react';

import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/TwoColumnView/TwoColumnView.less';


const block = 'in-two-column-view';

export default connectTo({
  timelineHeight: timelineHeight$
},
function TwoColumnView({timelineHeight, leftContent, rightContent}) {
  return (
    <section className={block}
             style={{
               bottom: toPx(timelineHeight)
             }}>
      <div className={`${block}__left`}>
        {leftContent}
      </div>
      <div className={`${block}__right`}>
        {rightContent}
      </div>
    </section>
  );
});
