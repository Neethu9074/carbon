import React from 'react';

import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import TraceFlameGraph from 'in-components/traceView/components/TraceFlameGraph';
import {getLabel, getTypeLabelSingular, getCategory} from 'in-sdk/tracing';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

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

    const selfTime = getSelfTime(this.props.span);
    const totalTime = this.props.span.get('duration');

    let totalTimePercentage;
    let selfTimePercentage;
    if (this.props.span.get('async')) {
      totalTimePercentage = 0;
      selfTimePercentage = 0;
    } else {
      // add a small amount to avoid division by zero
      const parentTotalTime = this.props.parentSpanForPercentageCalculation.get('duration') + 0.00000001;
      totalTimePercentage = 1 / parentTotalTime * totalTime;
      const parentSelfTime = getSelfTime(this.props.parentSpanForPercentageCalculation);
      selfTimePercentage = 1 / parentSelfTime * selfTime;
    }

    const childSpans = this.props.span.get('childSpans');

    return (
      <li className={`${block}__element`}>

        <div className={classnames({
               [`${block}__element-header`]: true,
               [`${block}__element-header--error`]: this.props.span.get('error')
             })}
             onClick={this.toggleDetails}>
          <span className={`${block}__element-type-indicator`}
                style={{
                  background: spanCategoryColors[getCategory(this.props.span)]
                }}/>

          <div className={`${block}__element-header-row ${block}__element-header-row--top`}>
            Self: {msZeroDecimalPlaces(selfTime)} ({percentageTwoDecimalPlaces(selfTimePercentage)})

            <span style={{position: 'absolute', left: '150px'}}>
              {getTypeLabelSingular(this.props.span)}:
              &nbsp;
              {getLabel(this.props.span)}
            </span>
          </div>
          <div className={`${block}__element-header-row ${block}__element-header-row--bottom`}>
            Total: {msZeroDecimalPlaces(totalTime)} ({percentageTwoDecimalPlaces(totalTimePercentage)})
          </div>

          {this.props.span.get('async') ?
            <span className={`${block}__async-marker`}>
              &#x21C4;
            </span>
          : null}
        </div>

        {this.state.detailsExpanded ?
          <SpanForgeDetails span={this.props.span}
                            trace={this.props.trace} />
        : null}

        <ul className={`${block}__element-container`}>
          {childSpans.toArray()
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


function getSelfTime(span) {
  let selfTime = span.get('duration');
  span.get('childSpans').forEach(childSpan => selfTime -= childSpan.get('duration'));
  return selfTime;
}


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
