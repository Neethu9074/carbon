import PureRenderMixin from 'react-addons-pure-render-mixin';
import React from 'react';

import {
  getTypeLabelSingular,
  getTypeLabelPlural,
  shouldShowSelfTime,
  getDirection,
  getCategory,
  getLabel
} from 'in-sdk/tracing';
import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanEntityInformation from 'in-components/traceView/components/SpanEntityInformation';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import {highlightedSpanId$} from 'in-components/traceView/stores/highlightedSpan';
import CategoryIcon from 'in-components/traceView/components/tree/CategoryIcon';
import spanCategoryColors from 'in-stores/colorCoding/spanCategories';
import {getSelfTime} from 'in-components/traceView/util';
import {hexToRGB} from 'in-services/formatters/color';
import classnames from 'in-services/util/classnames';
import SvgIcon from 'in-components/SvgIcon';
import Tooltip from 'in-components/Tooltip';
import connectTo from 'in-hoc/connectTo';
import Badge from 'in-components/Badge';

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
    depth: React.PropTypes.number.isRequired,
    totalTimeIndentationDepth: React.PropTypes.number.isRequired
  },

  getInitialState() {
    return {
      detailsExpanded: false
    };
  },

  render() {
    const span = this.props.span;
    const selfTime = getSelfTime(span);
    const batchSize = span.get('batchSize');
    const totalTime = span.get('duration');
    const category = getCategory(span);
    const direction = getDirection(span);
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
      totalTimePercentage = Math.min(1 / parentTotalTime * totalTime, 1);
      selfTimePercentage = Math.min(1 / parentTotalTime * selfTime, 1);
    }

    return (
      <div>
        <div className={`${block}__total-time`}
             style={{
               left: `${this.props.totalTimeIndentationDepth * 20 + 16}px`
             }}>
          {msZeroDecimalPlaces(totalTime)}<br/>({percentageTwoDecimalPlaces(totalTimePercentage)})
          <div className={`${block}__total-time-indicator`}>
            <div className={`${block}__total-time-indicator-bar`}
                 style={{
                   width: `${totalTimePercentage * 100}%`
                 }}/>
          </div>

          {span.get('async') ?
            <Tooltip content='Async call'>
              <SvgIcon type='async'
                       className={`${block}__async-icon`}
                       width={14} />
            </Tooltip>
          : null}
        </div>

        <div className={classnames({
               [`${block}`]: true,
               [`${block}--error`]: span.get('error'),
               [`${block}--highlighted`]: this.props.isHighlighted
             })}
             style={{
               marginLeft: `${this.props.depth * 20}px`
             }}
             id={`span-${span.get('spanId')}`}>
          <div className={`${block}__background`}
                style={backgroundInCategoryColorStyle}/>
          <div className={`${block}__left-border`}
                style={backgroundInCategoryColorStyle}/>
          {span.get('error') ?
            <SvgIcon type='error'
                     className={`${block}__error-icon`}
                     width={12} />
          : null}
          <div className={`${block}__content-wrapper`}>
            <div className={`${block}__header`}
                 onClick={this.toggleDetails}>
              <CategoryIcon category={category}
                            className={`${block}__category-icon`} />
              {direction !== 'exit' && shouldShowSelfTime(span) ?
                [
                  <div key='0'>
                    <span className={`${block}__self-time-label`}>Self: </span>
                    {msZeroDecimalPlaces(selfTime)}<br/>({percentageTwoDecimalPlaces(selfTimePercentage)})
                  </div>,
                  <div className={`${block}__horizontal-divider`}
                       key='1'
                       style={backgroundInCategoryColorStyle} />
                ]
              : null}

              <div className={`${block}__descriptions`}>
                <div className={`${block}__span-description`}>
                  <span className={`${block}__span-type`}>
                    {batchSize ?
                      <span><Badge size='sm'>{batchSize}</Badge> {getTypeLabelPlural(span)}</span>
                    :
                      getTypeLabelSingular(span)
                    }
                  </span>
                  {' '}
                  {getLabel(span)}
                </div>
                <div className={`${block}__entity-description`}>
                  {getDirection(span) === 'entry' ?
                    <span>
                      <SpanEntityInformation span={span}
                                             label='From:'
                                             connectionEndpointType='source' />
                      <SpanEntityInformation span={span}
                                             label='On:'
                                             connectionEndpointType='destination' />
                    </span>
                  :
                    <span>
                      <SpanEntityInformation span={span}
                                             label='On:'
                                             connectionEndpointType='source' />
                      <SpanEntityInformation span={span}
                                             label='To:'
                                             connectionEndpointType='destination' />
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
