import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import classnames from 'in-services/util/classnames';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import connectTo from 'in-hoc/connectTo';

import CloseFilterbarButton from './CloseFilterbarButton';
import ComponentList from './ComponentList';
import Controls from './Controls';
import MapStats from './MapStats';
import Metrics from './Metrics';
import Tags from './Tags';

import './Filterbar.less';

const block = 'in-filterbar';

export default connectTo({
    isCollapsed: isCollapsed$
  }, React.createClass({
  displayName: 'Filterbar',

  mixins: [PureRenderMixin],

  propTypes: {
    isCollapsed: React.PropTypes.bool.isRequired
  },

  getInitialState() {
    return { activeControl: null };
  },

  render() {
    const open = !!this.state.activeControl;
    return (
      <div className={block}>
        <Controls className={classnames({
                    [block + '__controls']: true,
                    [block + '__controls--open']: open
                  })}
                  activeControl={this.state.activeControl}
                  onChangeActiveControl={this.onChangeActiveControl} />
        <div className={classnames({
          [block + '__content']: true,
          [block + '__content--open']: open,
          [block + '__content--timeline-expanded']: !this.props.isCollapsed
        })}>
          <CloseFilterbarButton closeFilterbar={this.closeFilterbar} />
          {this.renderContent()}
        </div>
      </div>
    );
  },

  renderContent() {
    if (!this.state.activeControl) {
      return null;
    }

    // special case mapstats so that it will not be part of the compiled artifact
    if (__DEV__ && this.state.activeControl === 'mapStats') {
      return <MapStats />;
    }

    switch (this.state.activeControl) {
      case 'tags':
        return <Tags/>;
      case 'metrics':
        return <Metrics/>;
      case 'components':
        return <ComponentList/>;
      default:
        throw new Error('Unknown content control', this.state.activeControl);
    }
  },

  onChangeActiveControl(activeControl) {
    this.setState({
      // close when it is already active
      activeControl: activeControl === this.state.activeControl ? null : activeControl
    });
  },

  closeFilterbar() {
    this.setState({
      activeControl: null
    });
  }
}));
