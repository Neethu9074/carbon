import React from 'react/addons';

import {warningFilter, dangerFilter} from 'in-services/filtering';
import * as filters from 'in-services/stores/filters';
import {theme} from 'in-services/theme';

import Tooltip from '../Tooltip';
import Icon from '../Icon';

import './EventControl.less';

const block = 'in-sidebar-event-control';

const EventControl = React.createClass({
  events: {
    warning: {
      iconType: 'warning',
      tooltip: 'warning',
      color: theme.map.tooltips.critical,
      enter: () => { filters.addFilter(warningFilter); },
      leave: () => { filters.removeFilter(warningFilter); }
    },
    danger: {
      iconType: 'critical',
      tooltip: 'critical',
      color: theme.map.tooltips.danger,
      enter: () => { filters.addFilter(dangerFilter); },
      leave: () => { filters.removeFilter(dangerFilter); }
    },
    options: {
      iconType: 'options',
      tooltip: 'show all'
    }
  },

  mixins: [React.addons.PureRenderMixin],

  propTypes: {
  },

  getInitialState() {
    return {
      expandControl: false,
      mainEvent: this.events.options
    };
  },

  render() {
    const events = this.events;
    return (
      <div className={block}>
        {
          this.state.expandControl ?
            Object.keys(events).map(key => this.getIcon(events[key]))
            :
            this.getIcon(this.state.mainEvent)
        }
      </div>
    );
  },

  getIcon(event) {
    const style = event.color ? {color: event.color} : null;

    return (
      <Tooltip key={event.iconType} content={event.tooltip}>

        <Icon className={block + '__icon'}
              style={style}
              type={event.iconType}
              onClick={() => this.onEventClicked(event)}/>

      </Tooltip>
    );
  },

  onEventClicked(event) {
    if (this.state.mainEvent.leave) {
      this.state.mainEvent.leave();
    }

    this.setState({
      expandControl: !this.state.expandControl,
      mainEvent: event
    });

    if (event.enter) {
      event.enter();
    }
  }
});

export default EventControl;
