'use strict';

import React from 'react/addons';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';
import iconPath from '../icons/default.png';
import StickyNote from '../StickyNote';
import {getHealth, health} from 'instana-ui-services/health';
import {
  getProblemsForSnapshot,
  getOpenIssues
} from 'instana-ui-services/notificationCenter';

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

    this.sub2 = getProblemsForSnapshot(this.props.snapshot)
      .subscribe(issues => this.setState({issues}));
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
/*eslint-enable no-unused-vars*/

  getContentByHealth(nodeHealth) {
    const byContent = ({heading, content, health}) => {
      return <div>
        <div className={'in-sticky-note__node__highlight__header__' + health}>
          {heading}
        </div>
        <div className="in-sticky-note__node__highlight__content">
          {content}
        </div>
      </div>;
    };

    if(nodeHealth === health.warning) {
      return byContent({
        heading: 'WARNING',
        content: this.state.issues.get(0).get('problemText'),
        health: 'warning'
      });

    } else if(nodeHealth === health.danger) {
      return byContent({
        heading: 'DANGER',
        content: this.state.issues.get(0).get('problemText'),
        health: 'danger'
      });
    }
    return byContent({
      heading: this.props.snapshot.get('hostId').toUpperCase(),
      content: 'this is a great server :)',
      health: 'ok'
    });
  }
});

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
