import React from 'react/addons';

import {health} from 'in-services/health';
import Icon from 'in-components/Icon';
import theme from 'in-services/theme';

import StickyNote from '../StickyNote';

import './Ground.less';

const rpt = React.PropTypes;
const block = 'in-sticky-note-group';

const GroundStickyNoteRC = React.createClass({

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
    onMouseLeave: rpt.func.isRequired,
    onMouseEnter: rpt.func.isRequired,
    isActive: rpt.bool.isRequired,
    onClick: rpt.func.isRequired,
    color: rpt.object.isRequired,
    label: rpt.string.isRequired,
    health: rpt.string
  },

  render() {
    const c = this.props.color;
    const backgroundColor = this.props.isActive ?
      '#fff' :
      'rgb(' + ((c.r * 255) | 0) + ',' + ((c.g * 255) | 0) + ',' + ((c.b * 255) | 0) + ')';

    return (
      <div className={block + '__wrapper'}>
        <div className={block + '__content'}
             style={{backgroundColor}}
             onClick={this.props.onClick}
             onMouseEnter={this.props.onMouseEnter}
             onMouseLeave={this.props.onMouseLeave}>
          {this.props.label}
        </div>
        {this.getIcon()}
      </div>
    );
  },

  getIcon() {
    const groupHealth = this.props.health;

    if (groupHealth === health.danger) {
      return <Icon type={'critical'} style={{ color: theme.map.colors.critical }}/>;
    } else if (groupHealth === health.warning) {
      return <Icon type={'warning'} style={{ color: theme.map.colors.warning }}/>;
    }
    return null;
  }
});


export default class StickyNoteNode extends StickyNote {
  constructor(parent) {
    super({parent, cssClass: block});

    this.health = health.ok;
    this.setActive(false);
  }

  render() {
    const parent = this.parent;
    React.render(
      <GroundStickyNoteRC label={parent.id}
                          isActive={this.isActive}
                          color={parent.getColor()}
                          health={this.health}
                          onClick={parent.onGroupClicked.bind(parent)}
                          onMouseEnter={() => parent.highlight()}
                          onMouseLeave={() => parent.highlight(false)}/>,
      this.stickyNoteContainer
    );
  }

  setHealth(groupHealth) {
    this.health = groupHealth;
    this.render();
  }

  setActive(isActive = true) {
    this.isActive = isActive;
    this.render();
  }
}
