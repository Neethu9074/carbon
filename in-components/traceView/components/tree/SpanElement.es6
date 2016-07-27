import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {getLabel, getCategory, getCategoryIcon, getTypeLabelSingular, getDirection} from 'in-sdk/tracing';
import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanEntityInformation from 'in-components/traceView/components/SpanEntityInformation';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import {highlightedSpanId$} from 'in-components/traceView/traceViewStore';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {getSelfTime} from 'in-components/traceView/util';
import {hexToRGB} from 'in-services/formatters/color';
import classnames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import connectTo from 'in-hoc/connectTo';

import './SpanElement.less';

const block = 'in-trace-tree-span-element';

export default connectTo(props => {
  const spanId = props.span.get('spanId');
  return {
    isHighlighted: highlightedSpanId$
      .map(highlightedSpanId => spanId === highlightedSpanId)
      .distinct()
  };
}, React.createClass({
  displayName: 'TreeSpanElement',

  mixins: [PureRenderMixin],

  propTypes: {
    span: React.PropTypes.object.isRequired,
    trace: React.PropTypes.object.isRequired,
    isHighlighted: React.PropTypes.bool.isRequired,
    parentSpanForPercentageCalculation: React.PropTypes.object.isRequired,
    depth: React.PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      detailsExpanded: false
    };
  },

  render() {
    const span = this.props.span;
    const selfTime = getSelfTime(span);
    const totalTime = span.get('duration');
    const category = getCategory(span);
    const categoryColor = spanCategoryColors[category];
    const categoryColorRgb = hexToRGB(categoryColor);
    const backgroundInCategoryColorStyle = {background: categoryColor};

    let totalTimePercentage;
    let selfTimePercentage;
    if (span.get('async')) {
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
        <div className={`${block}__total-time`}>
          {this.props.depth === 0 ?
            <span className={`${block}__totel-time-label`}>Total: </span>
          : null}

          {msZeroDecimalPlaces(totalTime)}<br/>({percentageTwoDecimalPlaces(totalTimePercentage)})
        </div>

        <div className={classnames({
               [`${block}`]: true,
               [`${block}--error`]: span.get('error'),
               [`${block}--highlighted`]: this.props.isHighlighted
             })}
             style={{
               marginLeft: `${this.props.depth * 20}px`
             }}>
          <div className={`${block}__background`}
                style={backgroundInCategoryColorStyle}/>
          <div className={`${block}__left-border`}
                style={backgroundInCategoryColorStyle}/>
          <div className={`${block}__content-wrapper`}>
            <div className={`${block}__header`}
                 onClick={this.toggleDetails}>
              <img src={getCategoryIcon(category)}
                   alt={`Icon for the span category ${category}`}
                   className={`${block}__category-icon`}
                   style={backgroundInCategoryColorStyle}/>

              <div className={`${block}__self-time`}>
                <span className={`${block}__self-time-label`}>Self: </span>
                {msZeroDecimalPlaces(selfTime)}<br/>({percentageTwoDecimalPlaces(selfTimePercentage)})
              </div>

              <div className={`${block}__horizontal-divider`}
                   style={backgroundInCategoryColorStyle} />

              <div className={`${block}__descriptions`}>
                <div className={`${block}__span-description`}>
                  <span className={`${block}__span-type`}>{getTypeLabelSingular(span)}: </span>
                  {getLabel(span)}
                </div>
                <div className={`${block}__entity-description`}>
                  {getDirection(span) === 'entry' ?
                    <span>
                      <SpanEntityInformation span={span}
                                             label='From'
                                             connectionEndpointType='sourceId' />
                      <SpanEntityInformation span={span}
                                             label='On'
                                             connectionEndpointType='destinationId' />
                    </span>
                  :
                    <span>
                      <SpanEntityInformation span={span}
                                             label='On'
                                             connectionEndpointType='sourceId' />
                      <SpanEntityInformation span={span}
                                             label='To'
                                             connectionEndpointType='destinationId' />
                    </span>
                  }
                </div>
              </div>

              <SvgIcon type={this.state.detailsExpanded ? 'timeline_close' : 'timeline_open'}
                       onClick={this.toggleDetails}
                       className={`${block}__toggle-details`}
                       width={12} />
            </div>

            {this.state.detailsExpanded ?
              <div className={`${block}__details`}
                   style={{
                     borderColor: `rgba(${categoryColorRgb.r}, ${categoryColorRgb.g}, ${categoryColorRgb.b}, 0.5)`
                   }}>
                <SpanForgeDetails span={span}
                                  trace={this.props.trace} />
              </div>
            : null}
          </div>
        </div>
      </div>
    );
  },

  toggleDetails(e) {
    e.stopPropagation();
    this.setState(prevState => {
      return {
        detailsExpanded: !prevState.detailsExpanded
      };
    });
  }
}));
