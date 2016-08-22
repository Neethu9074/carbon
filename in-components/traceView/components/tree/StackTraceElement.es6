import React from 'react';

import SvgIcon from 'in-components/SvgIcon';

import './StackTraceElement.less';

const block = 'in-trace-view-stack-trace';

export default React.createClass({
  displayName: 'TreeStackTraceElement',

  propTypes: {
    stackTrace: React.PropTypes.array.isRequired
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
});
