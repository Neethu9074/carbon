import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {activeControl$} from 'in-components/Filterbar/stores/filterbarActiveControl';
import {isOpen$} from 'in-components/Filterbar/stores/filterbarIsOpenStore';
import {isCollapsed$} from 'in-components/timeline/timelineStore';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import Controls from './Controls';
import MapStats from './MapStats';
import Metrics from './Metrics';
import Tags from './Tags';

import './Filterbar.less';


const block = 'in-filterbar';
const rpt = React.PropTypes;

export default connectTo({
    isTimelineCollapsed: isCollapsed$,
    activeControl: activeControl$,
    isOpen: isOpen$
  },
  React.createClass({
    displayName: 'Filterbar',

    mixins: [PureRenderMixin],

    propTypes: {
      isTimelineCollapsed: rpt.bool.isRequired,
      activeControl: rpt.string,
      isOpen: rpt.bool
    },

    render() {
      const open = this.props.isOpen;
      return (
        <div className={block}>
          <Controls className={classnames({
                      [block + '__controls']: true,
                      [block + '__controls--open']: open
                    })}
                    activeControl={this.props.activeControl}/>
          <div className={classnames({
            [block + '__content']: true,
            [block + '__content--open']: open,
            [block + '__content--timeline-expanded']: !this.props.isTimelineCollapsed
          })}>
            {this.renderContent()}
          </div>
        </div>
      );
    },

    renderContent() {
      if (!this.props.isOpen || !this.props.activeControl) {
        return null;
      }

      // special case mapstats so that it will not be part of the compiled artifact
      if (__DEV__ && this.props.activeControl === 'mapStats') {
        return <MapStats />;
      }

      switch (this.props.activeControl) {
        case 'tags':
          return <Tags/>;
        case 'metrics':
          return <Metrics/>;
        default:
          throw new Error('Unknown content control', this.props.activeControl);
      }
    }
  })
);
