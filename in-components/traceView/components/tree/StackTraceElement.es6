import React from 'react';

import subscribeToInstanceImplementation from 'in-services/subscription/serviceInstanceImplementation';
import ShowCodeButton from 'in-components/traceView/components/tree/ShowCodeButton';
import {alwaysNull} from 'in-services/fixedStreams';
import {getSnapshot} from 'in-stores/snapshot';
import {getDirection} from 'in-sdk/tracing';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './StackTraceElement.less';

const block = 'in-trace-view-stack-trace';

export default connectTo(props => {
  const direction = getDirection(props.parentSpan);
  const side = direction === 'entry' ? 'destinationServiceInstanceId' : 'sourceServiceInstanceId';
  const serviceInstanceSnapshotId = props.parentSpan.getIn(['rels', side]);
  let snapshot$ = alwaysNull;
  if (serviceInstanceSnapshotId) {
    const time = props.parentSpan.get('start');
    snapshot$ = subscribeToInstanceImplementation({
        time,
        serviceInstanceSnapshotId
      })
      .flatMap(serviceInstanceImplementationSnapshotId => {
        if (!serviceInstanceImplementationSnapshotId) {
          return alwaysNull;
        }

        return getSnapshot(serviceInstanceImplementationSnapshotId, time);
      });
  }

  return {
    snapshot: snapshot$
  };
}, React.createClass({
  displayName: 'TreeStackTraceElement',

  propTypes: {
    stackTrace: React.PropTypes.array.isRequired,
    snapshot: React.PropTypes.object
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

        {this.props.stackTrace.length > 1 ?
          <SvgIcon type={this.state.showAllElements ? 'timeline_close' : 'timeline_open'}
                   className={`${block}__toggle-details`}
                   width={12} />
        : null}

        <ol className={`${block}__list`}>
          {stackTrace.map((st, i) =>
            <li key={i}
                className={`${block}__item`}>
              <span className={`${block}__method`}> {st.get('m')} </span>
              <span className={`${block}__in`}>in</span>
              <span className={`${block}__file`}> {st.get('c')}{st.get('n') ? `:${st.get('n')}` : ''}</span>
              {this.props.snapshot != null ?
                <ShowCodeButton snapshot={this.props.snapshot}
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
