'use strict';

import React from 'react/addons';
import SnapshotIcon from 'instana-ui-components/SnapshotIcon';
import iconPath from '../icons/default.png';
import StickyNote from '../StickyNote';
import {getHealth} from 'instana-ui-services/issueTracker';
import {health} from 'instana-ui-services/health';
import {
  getProblemsForSnapshot,
  getOpenIssues
} from 'instana-ui-services/issueTracker';

import './index.less';

const rpt = React.PropTypes;

/*eslint-disable no-unused-vars*/
const StickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    snapshot: rpt.object.isRequired
  },

  componentWillUnmount() {
    this.healthSubscription.dispose();
    this.healthSubscription = null;

    this.issueSubscription.dispose();
    this.issueSubscription = null;
  },

  getHighlightedContent() {
    const nodeHealth = this.props.health;

    const byContent = ({heading, content, health}) => {
      return <div className='in-sticky-note__node__highlight'>
        <div className={'in-sticky-note__node__highlight__header__' + health}>
          {heading}
        </div>
        <div className='in-sticky-note__node__highlight__content'>
          {content}
        </div>
      </div>;
    };

    const getProblemText = () => {
       try {
        return this.props.issues.get(0).get('problemText');
      } catch (er) {
        return '';
      }
    };

    if(this.props.highlighted) {
      if(nodeHealth === health.warning) {
        return byContent({
          heading: 'WARNING',
          content: getProblemText(),
          health: 'warning'
        });

      } else if(nodeHealth === health.danger) {
        return byContent({
          heading: 'DANGER',
          content: getProblemText(),
          health: 'danger'
        });
      }
      return byContent({
        heading: this.props.snapshot.get('hostId').toUpperCase(),
        content: 'this is a great server :)',
        health: 'ok'
      });
    } else {
      return '';
    }
  },

  render() {
    const data = this.props.snapshot.get('data');
    const highlightedCode = this.getHighlightedContent();

    return (
      <div className='in-sticky-note__node'>
        {highlightedCode}
        <div>
          <img src={iconPath} className='in-sticky-note__node__icon'/>
        </div>
      </div>
    );
  }
});
/*eslint-enable no-unused-vars*/

export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: 'in-sticky-note__node'});
    this.render();

    this.healthSubscription = getHealth(this.parent.snapshot)
      .subscribe(h => this.health = h);

    this.issueSubscription = getProblemsForSnapshot(this.parent.snapshot)
      .subscribe(issues => this.issues = issues);
  }

  render() {
    React.render(
      <StickyNoteRC snapshot={this.parent.snapshot}
                    id={this.parent.incrementId}
                    highlighted={this.highlighted}
                    health={this.health}
                    issues={this.issues}/>,
      this.stickyNoteContainer
    );
  }

  dispose() {
    this.healthSubscription.dispose();
    this.healthSubscription = null;

    this.issueSubscription.dispose();
    this.issueSubscription = null;

    super.dispose();
  }
}
