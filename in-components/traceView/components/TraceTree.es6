import React from 'react';

import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import TraceFlameGraph from 'in-components/traceView/components/TraceFlameGraph';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';
import {getLabel, getTypeLabelSingular} from 'in-sdk/tracing';

import './TraceTree.less';

const block = 'in-trace-view-tree';

const TreeElement = React.createClass({
  propTypes: {
    span: React.PropTypes.object.isRequired,
    trace: React.PropTypes.object.isRequired,
    parentSpanForPercentageCalculation: React.PropTypes.object.isRequired
  },

  getInitialState() {
    return {
      detailsExpanded: false
    };
  },

  render() {
    let newParentSpanForPercentageCalculation = this.props.parentSpanForPercentageCalculation;
    if (this.props.parentSpanForPercentageCalculation.get('async')) {
      newParentSpanForPercentageCalculation = this.props.span;
    }

    let percentageOfTotalTrace;
    if (this.props.span.get('async')) {
      percentageOfTotalTrace = 0;
    } else {
      // add a small amount to avoid division by zero
      const parentDuration = this.props.parentSpanForPercentageCalculation.get('duration') + 0.00000001;
      percentageOfTotalTrace = 1 / parentDuration * this.props.span.get('duration');
    }

    const childSpans = this.props.span.get('childSpans');

    return (
      <li className={`${block}__element`}>

        <div className={classnames({
               [`${block}__element-header`]: true,
               [`${block}__element-header--error`]: this.props.span.get('error')
             })}
             onClick={this.toggleDetails}>
          {msZeroDecimalPlaces(this.props.span.get('duration'))}
          &nbsp;
          ({percentageTwoDecimalPlaces(percentageOfTotalTrace)})
          &nbsp;
          {this.props.span.get('async') ? <span>&#x21C4;&nbsp;</span> : null}
          {getTypeLabelSingular(this.props.span)}:
          &nbsp;
          {getLabel(this.props.span)}
        </div>

        {this.state.detailsExpanded ?
          <SpanForgeDetails span={this.props.span}
                            trace={this.props.trace} />
        : null}

        <ul className={`${block}__element-container`}>
          {childSpans.toArray()
            .filter(childSpan => !childSpan.get('async'))
            .map(childSpan =>
              <TreeElement span={childSpan}
                           key={childSpan.get('spanId')}
                           parentSpanForPercentageCalculation={newParentSpanForPercentageCalculation}
                           trace={this.props.trace}/>
            )}
        </ul>
      </li>
    );
  },

  toggleDetails() {
    this.setState(prevState => {
      return {
        detailsExpanded: !prevState.detailsExpanded
      };
    });
  }
});


export default connectTo({
    traceId: selectedTraceId,
    trace: selectedTrace
  }, function TraceTree({traceId, trace}) {
    if (!traceId) {
      return <p className={`${block}__no-trace-selected`}>No trace selected.</p>;
    }

    if (!trace) {
      return <LoadingIndicator type='dark' />;
    } else if (trace.get('traceId') !== traceId) {
      return <LoadingIndicator type='dark' />;
    }

    return (
      <div className={block}>
        <h1>Le Flame Graph</h1>

        <TraceFlameGraph trace={trace} />

        <h1>Le Trace Tree</h1>

        <ul className={`${block}__element-container ${block}__element-container--root`}>
          <TreeElement span={trace}
                       parentSpanForPercentageCalculation={trace}
                       trace={trace}/>
        </ul>
      </div>
    );
  }
);
