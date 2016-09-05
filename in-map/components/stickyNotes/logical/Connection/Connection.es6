import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import LabeledSparkChart from 'in-sdk/components/sidebar/LabeledSparkChart';
import createStickyNote from 'in-map/components/stickyNotes/StickyNote';
import {showSticky$} from 'in-map/stores/logical/connectionsStore';
import {getSnapshot} from 'in-stores/snapshot';
import KPIList from 'in-components/KPIList';
import connectTo from 'in-hoc/connectTo';
import {getKpis} from 'in-sdk/kpi';

import 'in-map/components/stickyNotes/logical/Connection/Connection.less';


const rpt = React.PropTypes;
const block = 'in-sticky-note-connection';

export default createStickyNote(
  connectTo(props => {
    return {
      snapshot: getSnapshot(props.id),
      showSticky: showSticky$.distinct()
    };
  },
  React.createClass({

    displayName: 'logical connection sticky',

    mixins: [
      PureRenderMixin
    ],

    propTypes: {
      id: rpt.string.isRequired,
      showSticky: rpt.bool,
      snapshot: irpt.map
    },

    getInitialState() {
      return {
        isHighlighted: false
      };
    },

    render() {
      const snapshot = this.props.snapshot;
      if (!snapshot || !this.props.showSticky) {
      return null;
      }

      const kpis = getKpis(snapshot);
      let className = block + '__wrapper';
      if (this.state.isHighlighted) {
        className += ' ' + className + '--highlighted';
      }

      return (
        <div className={className}
             onMouseEnter={() => this.setState({isHighlighted: true})}
             onMouseLeave={() => this.setState({isHighlighted: false})}>
          {this.state.isHighlighted ?
            kpis.map(kpi =>
              <LabeledSparkChart className={block + '__spark-chart'}
                          key={kpi.label}
                          snapshotId={snapshot.get('id')}
                          label={kpi.label}
                          design='dark'
                          metric={kpi.metric}
                          formatter={kpi.formatter} />
            ) :
            <KPIList snapshot={snapshot}
                     metrics={kpis.map(kpi => kpi.metric)}
                     labels={kpis.map(kpi => kpi.label)}
                     formatters={kpis.map(kpi => kpi.valueOnlyFormatter)}/>
          }
        </div>
      );
    }
  })
));
