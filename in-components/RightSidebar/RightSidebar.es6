import React from 'react';

import RightSidebarHeader from 'in-components/RightSidebar/components/RightSidebarHeader';
import {content$} from 'in-components/RightSidebar/stores/rightSidebarContentStore';
import Controls from 'in-components/RightSidebar/components/Controls';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import 'in-components/RightSidebar/RightSidebar.less';


const block = 'in-right-sidebar';

export default connectTo({
    isTimelineCollapsed: isCollapsed$,
    content: content$
  },
  function RightSidebar({
    isTimelineCollapsed,
    content
  }) {
    let classes = block + (content ? ' ' + block + '--open' : '');
    if (!isTimelineCollapsed) {
      classes += ' ' + block + '--timeline-is-open';
    }

    return (
      <div className={classes}>
        <Controls />

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
