import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getEvent from 'in-hoc/getEvent';


const block = 'in-sidebar-event-listing';

export default getEvent(
  React.createClass({
    displayName: 'EventListing event',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      event: irpt.map
    },

    render() {
      const event = this.props.event;
      if (!event) {
        return null;
      }

      return (
        <div className={block}>
          {event.get('id')}
        </div>
      );
    }
  })
);
