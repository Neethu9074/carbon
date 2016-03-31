import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getSelectedIncident from 'in-hoc/getSelectedIncident';


import './SidebarIncidents.less';

const block = 'in-sidebar-incidents';

export default getSelectedIncident(
  React.createClass({

    displayName: 'SidebarIncidents',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      incidentId: React.PropTypes.string,
      incident: irpt.map
    },

    getInitialState() {
      return { windowHeight: this.getWindowHeight() };
    },

    handleResize() {
      this.setState({ windowHeight: this.getWindowHeight() });
    },

    getWindowHeight() {
      // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
      // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
      return Math.max(100, window.innerHeight - 350);
    },

    render() {
      const incident = this.props.incident;
      if (!incident) {
        return null;
      }

      return (
        <div className={block}
             style={{ maxHeight: this.state.windowHeight }}>
          {incident.get('id')}
        </div>
      );
    }
  })
);
