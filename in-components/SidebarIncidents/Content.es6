import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

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

  getInitialState() {
    return { windowHeight: this.getWindowHeight() };
  },

  handleResize() {
    this.setState({ windowHeight: this.getWindowHeight() });
  },

  getWindowHeight() {
    // the sidebar is minumum 100px height but max fullWindowHeight - 350px.
    // 350 is the upper margin + headers for the sidebar + a little margin to the bottom
    return Math.max(100, window.innerHeight - 480);
  },

  render() {
    const incident = this.props.incident;

    return (
      <div className={block}
           style={{ maxHeight: this.state.windowHeight }}>
        <h2 className={block + '__heading'}>
          What happened?
        </h2>

        <EventList incident={incident}/>
      </div>
    );
  }
});
