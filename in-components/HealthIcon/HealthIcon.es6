import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {getIconTypeForEvent, getColorForEvent} from 'in-services/issueTracker';
import getMostImportantEvent from 'in-hoc/getMostImportantEvent';
import EventDescription from 'in-components/EventDescription';
import {getClassName} from 'in-services/react';
import Icon from 'in-components/Icon';

import Tooltip from '../Tooltip';
import './HealthIcon.less';


const block = 'in-health-icon';
const rpt = React.PropTypes;

export default getMostImportantEvent(React.createClass({
  displayName: 'HealthIcon',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: rpt.string.isRequired,
    mostImportantEvent: irpt.map,
    className: rpt.string,
    color: rpt.any
  },

  render() {
    const mostImportantEvent = this.props.mostImportantEvent;
    if (!mostImportantEvent) {
      return null;
    }

    const iconType = getIconTypeForEvent(mostImportantEvent);
    const color = getColorForEvent(mostImportantEvent);

    return (
      <Tooltip content={<EventDescription event={mostImportantEvent}
                                          snapshotId={this.props.snapshotId}/>}>
        <Icon type={iconType}
              className={getClassName(this, block)}
              style={{ color }} />
      </Tooltip>
    );
  }
}));
