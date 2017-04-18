import rpt from 'prop-types';
import React from 'react';

import subscribeToPhysicalEndpointImplementation from 'in-services/subscription/physicalEndpointImplementation';
import ShowCodeButton from 'in-views/traceView/components/tree/ShowCodeButton';
import { alwaysNull, alwaysFalse } from 'in-services/fixedStreams';
import { getSnapshot, isEntityOnline } from 'in-stores/snapshot';
import SvgIcon from 'in-components/SvgIcon';
import { SPAN_KINDS } from 'in-sdk/tracing';
import connectTo from 'in-hoc/connectTo';

import './StackTraceElement.less';

const block = 'in-trace-view-stack-trace';

export default connectTo(
  props => {
    const side = props.parentSpan.get('kind') === SPAN_KINDS.ENTRY
      ? 'destinationPhysicalEndpoint'
      : 'sourcePhysicalEndpoint';
    const physicalEndpoint = props.parentSpan.getIn(['rels', side]);
    let snapshot$ = alwaysNull;
    if (physicalEndpoint) {
      const time = props.parentSpan.get('start');
      snapshot$ = subscribeToPhysicalEndpointImplementation({
        time,
        physicalEndpoint
      }).flatMap(physicalEndpointImplementationSnapshotId => {
        if (!physicalEndpointImplementationSnapshotId) {
          return alwaysNull;
        }

        return getSnapshot(physicalEndpointImplementationSnapshotId, time);
      });
    }

    return {
      snapshot: snapshot$,
      online: snapshot$.flatMap(snapshot => {
        if (!snapshot) {
          return alwaysFalse;
        }
        return isEntityOnline(snapshot.get('id'));
      })
    };
  },
  React.createClass({
    displayName: 'TreeStackTraceElement',

    propTypes: {
      stackTrace: rpt.array.isRequired,
      snapshot: rpt.object,
      online: rpt.bool
    },

    getInitialState() {
      return {
        showAllElements: false
      };
    },

    render() {
      let stackTrace = this.props.stackTrace;
      const stackTraceLength = stackTrace.length;
      if (!this.state.showAllElements) {
        stackTrace = [stackTrace[stackTraceLength - 1]];
      }

      let classes = block;
      if (stackTraceLength > 1) {
        classes = `${block} ${block}--clickable`;
      }

      return (
        <div className={classes} onClick={stackTraceLength > 1 ? this.toggle : undefined}>

          {stackTraceLength > 1
            ? <SvgIcon
                type={this.state.showAllElements ? 'timeline_close' : 'timeline_open'}
                className={`${block}__toggle-details`}
                width={12}
              />
            : null}

          <ol className={`${block}__list`}>
            {stackTrace.map((st, i) => (
              <li key={i} className={`${block}__item`}>
                <span className={`${block}__method`}> {st.get('m')} </span>
                <span className={`${block}__in`}>in</span>
                <span className={`${block}__file`}>
                  {' '}{st.get('c', st.get('f'))}{st.get('n') ? `:${st.get('n')}` : ''}
                </span>
                {this.props.snapshot != null && this.props.online
                  ? <ShowCodeButton snapshot={this.props.snapshot} file={st.get('f', st.get('c'))} line={st.get('n')} />
                  : null}
              </li>
            ))}
          </ol>
        </div>
      );
    },

    toggle() {
      this.setState({
        showAllElements: !this.state.showAllElements
      });
    }
  })
);
