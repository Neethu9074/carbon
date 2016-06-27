import PureRenderMixin from 'react-addons-pure-render-mixin';
import irpt from 'react-immutable-proptypes';
import React from 'react';

import {msZeroDecimalPlaces, percentageTwoDecimalPlaces} from 'in-services/formatters/number';
import SpanForgeDetails from 'in-components/traceView/components/SpanForgeDetails';
import {selectedSpanId$, selectedSpan$, selectedTrace$} from 'in-stores/traces';
import LoadingIndicator from 'in-components/LoadingIndicator';
import {formatDateTime} from 'in-services/formatters/date';
import {getTypeLabelSingular} from 'in-sdk/tracing';
import PropList from 'in-components/PropList';
import connectTo from 'in-hoc/connectTo';
import Icon from 'in-components/Icon';

import './SpanDetails.less';


const rpt = React.PropTypes;
const block = 'in-span-details';

export default connectTo({
    spanId: selectedSpanId$,
    trace: selectedTrace$,
    span: selectedSpan$
  },
  React.createClass({
    displayName: 'SpanDetails',

    mixins: [PureRenderMixin],

    propTypes: {
      spanId: rpt.string,
      trace: irpt.map,
      span: irpt.map
    },

    render() {
      const span = this.props.span;
      const trace = this.props.trace;

      if (!this.props.spanId) {
        return null;
      } else if (!span || !trace ||
          span.get('spanId') !== this.props.spanId) {
        return <LoadingIndicator type='dark' />;
      }

      const durationOfTotalTime = span.get('duration') / trace.get('duration');
      const note = `${percentageTwoDecimalPlaces(durationOfTotalTime)} of total call`;
      return (
        <section className={block}>
          <div className={block + '__header'}>
            <h1 className={block + '__type'}>
              {getTypeLabelSingular(span)}
            </h1>
            {span.get('error') ?
              <Icon type='critical'
                    className={block + '__icon'}/> :
              null
            }
          </div>

          <PropList>
            <PropList.Prop label='Duration'
                           value={msZeroDecimalPlaces(span.get('duration'))}
                           note={note}/>
            <PropList.Prop label='Start in total call'
                           value={msZeroDecimalPlaces(span.get('start') - trace.get('start'))} />
            <PropList.Prop label='Start'
                           value={formatDateTime(span.get('start'))} />
            {span.get('async') ?
              <PropList.Prop label='Async'
                             value={'true'} />
              : null
            }
          </PropList>

          <SpanForgeDetails span={span}
                            trace={trace} />
        </section>
      );
    }
  }));
