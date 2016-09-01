import React from 'react';

import {timelineHeight$} from 'in-components/timeline/timelineStore';
import {content$} from 'in-components/Controls/stores/ContentStore';
import toPx from 'in-services/formatters/toPx';
import connectTo from 'in-hoc/connectTo';

import 'in-components/Controls/Controls.less';


const block = 'in-controls';

export default connectTo({
  timelineHeight: timelineHeight$,
  content: content$
},
function Controls({content, timelineHeight}) {
  if (!content) {
    return null;
  }

  return (
    <div className={block}
         style={{
           bottom: toPx(timelineHeight + 20)
         }}>
      {content}
    </div>
  );
});
