'use strict';

import React from 'react/addons';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';
import iconPath from '../icons/default.png';
import StickyNote from '../StickyNote';
import {getHealth, health} from 'instana-ui-services/health';

import './index.less';

const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  getInitialState: function() {
    return {health: health.ok};
  },

  componentDidMount() {
    this.subscription = getHealth(this.props.snapshot).subscribe(health =>
      this.setState({health}));
  },

  componentWillUnmount() {
    this.subscription.dispose();
    this.subscription = null;
  },

  render() {
    const data = this.props.snapshot.get('data');
    const nodeHealth = this.state.health;
    return (
      <div>
        {this.getContentByHealth(nodeHealth)}
      </div>
    );
  },

  getContentByHealth(nodeHealth) {
    if(nodeHealth === health.warning) {
      return <div>
        <div className="in-sticky-note__node__highlight__header__warning">
          Warning
        </div>
        <div className="in-sticky-note__node__highlight__content">
          --- warning message here ---
        </div>
      </div>;
    } else if(nodeHealth === health.danger) {
      return <div>
        <div className="in-sticky-note__node__highlight__header__danger">
          Danger!
        </div>
        <div className="in-sticky-note__node__highlight__content">
          --- error message here ---
        </div>
      </div>;
    }
    return <div>
      <div className="in-sticky-note__node__highlight__header__ok">
        {this.props.snapshot.get('hostId')}
      </div>
      <div className="in-sticky-note__node__highlight__content">
        this is a great server :)
      </div>
    </div>;
  }
});
/*eslint-enable no-unused-vars*/


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node__highlight'});

    this.render();
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot} />,
      this.stickyNoteContainer
    );
  }

  dispose() {
    super.dispose();
  }
}
