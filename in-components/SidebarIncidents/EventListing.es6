import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import Event from './Event';

import './EventListing.less';


const block = 'in-sidebar-event-listing';

export default React.createClass({

  displayName: 'EventListing',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    events: irpt.list.isRequired
  },

  render() {
    return (
      <div className={block}>
        {this.props.events.map(eventId =>
          <Event key={eventId}
                 eventId={eventId} />
        )}
      </div>
    );
  }
});
