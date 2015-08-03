'use strict';

import React from 'react/addons';

import './FeedbackBadge.less';

const block = 'in-feedback-badge';

const FeedbackBadge = React.createClass({
  shouldComponentUpdate() {
    return false;
  },

  render() {
    return (
      <a className={block}
         href='https://instana.zendesk.com'
         target='_blank'>
        Send Us Feedback
      </a>
    );
  }
});

export default FeedbackBadge;
