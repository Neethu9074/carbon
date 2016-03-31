import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import getMostImportantEvent from 'in-hoc/getMostImportantEvent';
import {mapSeverityToHealth, health} from 'in-services/health';
import EventDescription from 'in-components/EventDescription';
import {getClassName} from 'in-services/react';
import {theme} from 'in-services/theme';
import Icon from 'in-components/Icon';

import Tooltip from '../Tooltip';
import './HealthIcon.less';

const block = 'in-health-icon';

export default getMostImportantEvent(
               React.createClass({

  displayName: 'HealthIconListing',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    snapshotId: React.PropTypes.string.isRequired,
    className: React.PropTypes.string,
    mostImportantEvent: irpt.map
  },

  render() {
    const mostImportantEvent = this.props.mostImportantEvent;
    if (!mostImportantEvent) {
      return null;
    }

    const severity = mostImportantEvent.getIn(['problem', 'severity']);

    let iconType;
    switch (mapSeverityToHealth(severity)) {
      case health.warning:
        iconType = 'warning';
        break;
      case health.danger:
        iconType = 'critical';
        break;
      default:
        iconType = 'change';
    }

    const color = theme.health[severity];

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
