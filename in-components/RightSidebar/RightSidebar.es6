import React from 'react';

import RightSidebarHeader from 'in-components/RightSidebar/components/RightSidebarHeader';
import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import {timelineHeight$} from 'in-components/timeline/timelineStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/RightSidebar/RightSidebar.less';


const block = 'in-right-sidebar';

export default connectTo({
    timelineHeight: timelineHeight$,
    content: content$
  },
  function RightSidebar({timelineHeight, content}) {
    const classes = block + (content ? ' ' + block + '--open' : '');

    return (
      <div className={classes}
           style={{
             bottom: toPx(timelineHeight)
           }}>
        <div className={block + '__content'}>
          {content ?
            <RightSidebarHeader title={content.title}>
              {content.additionalHeaderContent}
            </RightSidebarHeader>
            : null
          }
          {content ? content.content : null}
        </div>
      </div>
    );
  }
);
