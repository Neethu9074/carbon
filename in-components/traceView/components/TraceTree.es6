import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import TraceFlameGraph from 'in-components/traceView/components/TraceFlameGraph';
import {getLabel, getTypeLabelSingular, getCategory} from 'in-sdk/tracing';
import {highlightedSpanId$, longSelectedTrace$} from 'in-components/traceView/traceViewStore';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {selectedTrace, selectedTraceId} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import classnames from 'in-services/util/classnames';
import connectTo from 'in-hoc/connectTo';

import './TraceTree.less';

const block = 'in-trace-view-tree';

function TreeNetworkElement() {
  return (
    <div>NETWORK</div>
  );
}

function TreeStackTraceElement({stackTrace}) {
  return (
    <div>
      {stackTrace.map((st, i) =>
        <div key={i}>
          {st.get('c')}#{st.get('m')}:{st.get('n')}
        </div>
      )}
    </div>
  );
}

const TreeSpanElement = connectTo(props => {
    const spanId = props.span.get('spanId');
    return {
      isHighlighted: highlightedSpanId$
        .map(highlightedSpanId => spanId === highlightedSpanId)
        .distinct()
    };
  }, React.createClass({
    mixins: [PureRenderMixin],

    propTypes: {
      span: React.PropTypes.object.isRequired,
      trace: React.PropTypes.object.isRequired,
      isHighlighted: React.PropTypes.bool.isRequired,
      parentSpanForPercentageCalculation: React.PropTypes.object.isRequired
    },

    getInitialState() {
      return {
        detailsExpanded: false
      };
    },

    render() {
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
        selfTimePercentage = 1 / parentTotalTime * selfTime;
      }

      return (
        <div>
          <div className={classnames({
                 [`${block}__element-header`]: true,
                 [`${block}__element-header--error`]: this.props.span.get('error'),
                 [`${block}__element-header--highlighted`]: this.props.isHighlighted
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
        </div>
      );
    },

    toggleDetails() {
      this.setState(prevState => {
        return {
          detailsExpanded: !prevState.detailsExpanded
        };
      });
    }
  })
);


function TreeElement({element, parentSpanForPercentageCalculation, trace}) {
  let newParentSpanForPercentageCalculation = parentSpanForPercentageCalculation;
  if (element.type === 'span' && parentSpanForPercentageCalculation.get('async')) {
    newParentSpanForPercentageCalculation = element.span;
  }

  let details;
  if (element.type === 'span') {
    details = (
      <TreeSpanElement trace={trace}
                       span={element.span}
                       parentSpanForPercentageCalculation={parentSpanForPercentageCalculation} />
    );
  } else if (element.type === 'stackTrace') {
    details = (
      <TreeStackTraceElement stackTrace={element.stackTrace}/>
    );
  } else if (element.type === 'network') {
    details = <TreeNetworkElement />;
  } else {
    throw new Error(`Unknown long trace element type ${element.type}`);
  }

  return (
    <li className={`${block}__element`}>
      {details}

      <ul className={`${block}__element-container`}>
        {element.children.map(childElement =>
          <TreeElement element={childElement}
                       key={childElement.id}
                       parentSpanForPercentageCalculation={newParentSpanForPercentageCalculation}
                       trace={trace}/>
        )}
      </ul>
    </li>
  );
}


export default connectTo({
    traceId: selectedTraceId,
    trace: selectedTrace,
    longTrace: longSelectedTrace$
  }, function TraceTree({traceId, trace, longTrace}) {
    if (!traceId) {
      return <p className={`${block}__no-trace-selected`}>No trace selected.</p>;
    }

    if (!longTrace || longTrace.id !== traceId) {
      return <LoadingIndicator type='dark' />;
    }

    return (
      <div className={block}>
        <h1>Le Flame Graph</h1>

        <TraceFlameGraph trace={trace} />

        <h1>Le Trace Tree</h1>

        <ul className={`${block}__element-container ${block}__element-container--root`}>
          <TreeElement element={longTrace}
                       parentSpanForPercentageCalculation={trace}
                       trace={trace}/>
        </ul>
      </div>
    );
  }
);


function getSelfTime(span) {
  let selfTime = span.get('duration');
  span.get('childSpans').forEach(childSpan => selfTime -= childSpan.get('duration'));
  return selfTime;
}
