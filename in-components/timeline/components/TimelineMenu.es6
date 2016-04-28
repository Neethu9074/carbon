import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  isCollapsed$,
  toggleMenu,
  categorizedEvents$
} from 'in-components/timeline/timelineStore';
import TimelineLiveButton from 'in-components/timeline/components/TimelineLiveButton';
import {formatDate, formatTime} from 'in-services/formatters/date';
import connectTo from 'in-hoc/connectTo';
import {to$} from 'in-stores/timeline';
import Icon from 'in-components/Icon';

import './TimelineMenu.less';


const block = 'in-timeline-menu';
const rpt = React.PropTypes;

export default connectTo({
    categorizedEvents: categorizedEvents$,
    isCollapsed: isCollapsed$,
    to: to$
  },
  React.createClass({

    displayName: 'TimelineMenu',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      categorizedEvents: rpt.object,
      isCollapsed: rpt.bool,
      to: rpt.number
    },

    render() {
      const to = this.props.to;
      const categorizedEvents = this.props.categorizedEvents;

      return (
        <div className={block}>
          <div className={block + '__heading'}>
            { to ?
              <div>
                <span className={block + '__date'}>
                  {formatDate(to)}
                </span>
                <span className={block + '__time'}>
                  {formatTime(to)}
                </span>
              </div> :
              null
            }
            <TimelineLiveButton />
          </div>

          <div className={block + '__event-line--with-icon'}>
            <Icon type={'timeline_' + (this.props.isCollapsed ? 'open' : 'close')}
                  className={block + '__icon'}
                  onClick={toggleMenu}/>
            <div>
              Indicents
              <span className={block + '__counter'}>
                {categorizedEvents ? '(' + categorizedEvents.incidents.length + ')' : null}
              </span>
            </div>
          </div>

          <div className={block + '__event-line'}>
            Issues
            <span className={block + '__counter'}>
              {categorizedEvents ? '(' + categorizedEvents.issues.length + ')' : null}
            </span>
          </div>

          <div className={block + '__event-line'}>
            Changes
            <span className={block + '__counter'}>
              {categorizedEvents ? '(' + categorizedEvents.changes.length + ')' : null}
            </span>
          </div>
        </div>
      );
    }
  })
);
