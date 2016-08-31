import React from 'react';

import ShowCodeButton from 'in-components/traceView/components/tree/ShowCodeButton';
import {alwaysEmptyImmutableMap} from 'in-services/fixedStreams';
import {getConnectedEntities} from 'in-stores/connectedEntities';
import {emptyMap} from 'in-services/fixedImmutables';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './StackTraceElement.less';

const block = 'in-trace-view-stack-trace';

export default connectTo(props => {
  const connectionId = props.parentSpan.getIn(['rels', 'physicalConnectionId']);
  const start = props.parentSpan.get('start');
  let connectedEntities$;
  if (connectionId) {
    connectedEntities$ = getConnectedEntities(connectionId, start)
      .startWith(emptyMap);
  } else {
    connectedEntities$ = alwaysEmptyImmutableMap;
  }

  return {
    destinationSnapshotId: connectedEntities$
      .map(connectedEntities => connectedEntities.get('destinationId'))
  };
}, React.createClass({
  displayName: 'TreeStackTraceElement',

  propTypes: {
    stackTrace: React.PropTypes.array.isRequired,
    destinationSnapshotId: React.PropTypes.string
  },

  getInitialState() {
    return {
      showAllElements: false
    };
  },

  render() {
    let stackTrace = this.props.stackTrace;
    if (!this.state.showAllElements) {
      stackTrace = [stackTrace[stackTrace.length - 1]];
    }

    return (
      <div className={block}
           onClick={this.toggle}>

        <SvgIcon type={this.state.showAllElements ? 'timeline_close' : 'timeline_open'}
                 className={`${block}__toggle-details`}
                 width={12} />

        <ol className={`${block}__list`}>
          {stackTrace.map((st, i) =>
            <li key={i}
                className={`${block}__item`}>
              <span className={`${block}__method`}> {st.get('m')} </span>
              <span className={`${block}__in`}>in</span>
              <span className={`${block}__file`}> {st.get('c')}{st.get('n') ? `:${st.get('n')}` : ''}</span>
              {this.props.destinationSnapshotId != null ?
                <ShowCodeButton snapshotId={this.props.destinationSnapshotId}
                                file={st.get('c')}
                                line={st.get('n')}/>
              : null}
            </li>
          )}
        </ol>
      </div>
    );
  },

  toggle() {
    this.setState({
      showAllElements: !this.state.showAllElements
    });
  }
}));
