import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getSelectedIncident from 'in-hoc/getSelectedIncident';

import Content from './Content';
import Header from './Header';

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

    render() {
      const incident = this.props.incident;
      if (!incident) {
        return null;
      }

      return (
        <div className={block}>
          <Header incident={incident}/>
          <Content incident={incident} />
        </div>
      );
    }
  })
);
