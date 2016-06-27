import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {isOpen$, close} from 'in-components/Filterbar/stores/filterbarVisibilityStore';
import {removeAllTagFilters} from 'in-components/SearchBar/stores/searchInputString';
import {activeControl$} from 'in-components/Filterbar/stores/filterbarActiveControl';
import ResetButton from 'in-components/Filterbar/ResetButton';
import * as metricsStore from 'in-services/stores/metrics';
import Controls from 'in-components/Filterbar/Controls';
import MapStats from 'in-components/Filterbar/MapStats';
import Metrics from 'in-components/Filterbar/Metrics';
import RightSidebar from 'in-components/RightSidebar';
import Tags from 'in-components/Filterbar/Tags';
import connectTo from 'in-hoc/connectTo';


const rpt = React.PropTypes;

export default connectTo({
    activeControl: activeControl$
  },
  React.createClass({
    displayName: 'Filterbar',

    mixins: [PureRenderMixin],

    propTypes: {
      activeControl: rpt.string
    },

    render() {
      return (
        <div>
          <Controls />
          <RightSidebar isOpen$={isOpen$}
                        onClose={close}
                        rightSidebarContent={this.callByActiveControl(
                          () => <ResetButton onClick={removeAllTagFilters}/>,
                          () => <ResetButton onClick={() => metricsStore.activeMetric.emit(null)} />,
                          () => null,
                          () => null)}
                        title={this.callByActiveControl(() => 'Tags',
                                                        () => 'Metrics',
                                                        () => 'Statistics',
                                                        () => '')}>
            {this.callByActiveControl(
              () => <Tags />,
              () => <Metrics />,
              () => <MapStats />,
              () => null
            )}
          </RightSidebar>
        </div>
      );
    },

    callByActiveControl(onTags, onMetrics, onStats, onDefault) {
      const activeControl = this.props.activeControl;

      switch (activeControl) {
        case 'tags':
          return onTags();
        case 'metrics':
          return onMetrics();
        case 'system':
          return onStats();
        default:
          return onDefault();
      }
    }
  })
);
