import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import DrillDownButton from 'in-components/sidebars/Incident/components/DrillDownButton';
import EventList from 'in-components/sidebars/Incident/components//EventList';

import 'in-components/sidebars/Incident/components/Content.less';


const block = 'in-sidebar-incident-content';

export default React.createClass({
  displayName: 'Content',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    incident: irpt.map.isRequired
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
    return Math.max(100, window.innerHeight - 570);
  },

  render() {
    const incident = this.props.incident;

    return (
      <div className={block}
           style={{ maxHeight: this.state.windowHeight }}>

        <div className={`${block}__heading-wrapper`}>
          <h2 className={block + '__heading'}>
            What happened?
          </h2>

          <DrillDownButton incidentId={incident.get('id')}/>
        </div>

        <EventList incident={incident}/>
      </div>
    );
  }
});
