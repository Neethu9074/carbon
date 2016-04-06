import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {emptyList} from 'in-services/fixedImmutables';

import EventList from './EventList';

import './Content.less';


const block = 'in-sidebar-incident-content';

export default React.createClass({

  displayName: 'Content',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    incident: irpt.map.isRequired
  },

  render() {
    const incident = this.props.incident;

    return (
      <div className={block}>
        <h2 className={block + '__heading'}>
          What happened?
        </h2>

        <EventList eventIds={incident.get('recentEvents', emptyList).toArray()}
                   to={incident.get('start')}/>
      </div>
    );
  }
});
