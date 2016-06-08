import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {selectedSnapshotIdForHighlightingInMap} from 'in-map/src/mapStores';
import {formatDateTime} from 'in-services/formatters/date';
import {focusedMoment$} from 'in-stores/timeline';
import {getClassName} from 'in-services/react';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import eventBus from 'in-map/eventbus';
import Icon from 'in-components/Icon';

import './FocusButton.less';


const block = 'in-sidebar-map__focus-icon';
const rpt = React.PropTypes;

export default connectTo({
    focusedMoment: focusedMoment$
  }, React.createClass({

  displayName: 'FocusButton',

  mixins: [
    PureRenderMixin
  ],

  propTypes: {
    focusedMoment: rpt.number,
    snapshot: irpt.map.isRequired,
    className: rpt.string
  },

  render() {
    const snapshot = this.props.snapshot;
    const focusedMoment = this.props.focusedMoment;
    const entityExistsAtFocusedMoment =
      // either live
      (focusedMoment == null && snapshot.get('to') == null) ||

      // or historic
      (focusedMoment != null &&
        (snapshot.get('to') == null || snapshot.get('to') > focusedMoment));

    let classes = getClassName(this, block);

    if (entityExistsAtFocusedMoment) {
      return (
        <Tooltip content='Focus in map'>
          <Icon className={classes}
                onClick={this.focusSnapshotId}
                type='relocate' />
        </Tooltip>
      );
    }

    classes += ' ' + block + '--disabled';
    let tooltip = 'Entity does not exists at the focused point in time. The entity appeared ' +
      'first at ' + formatDateTime(snapshot.get('from'));

    if (snapshot.get('to') != null) {
      tooltip += ' and was last seen before ' + formatDateTime(snapshot.get('to')) + '.';
    } else {
      tooltip += '.';
    }

    return (
      <Tooltip content={this.wrapTooltipElement(tooltip)}
               align={{
                 horizontal: 'right',
                 vertical: 'middle'
               }}>
        <Icon className={classes}
              type='relocate' />
      </Tooltip>
    );
  },

  focusSnapshotId() {
    selectedSnapshotIdForHighlightingInMap
      .once(highlightedId => {
        eventBus.emit('focusEntityId', highlightedId);
      });
  },

  wrapTooltipElement(txt) {
    return (
      <span className={block + '__tooltip'}>
        {txt}
      </span>
    );
  }
}));
