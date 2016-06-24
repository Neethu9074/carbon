import React from 'react';

import connectTo from 'in-hoc/connectTo';

import 'in-components/eventCenter/EventCenter.less';


const block = 'in-event-center';

export default connectTo({
  }, function EventCenter() {
    return (
      <div className={block}>
        content
      </div>
    );
  }
);
