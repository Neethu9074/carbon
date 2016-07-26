import React from 'react';

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
    const stackTrace = this.props.stackTrace;

    if (stackTrace.length === 1) {
      return (
        <div>
          {stackTrace.map((st, i) =>
            <div key={i}>
              {st.get('c')}#{st.get('m')}:{st.get('n')}

              <span>
                &nbsp;[View Source]
              </span>
            </div>
          )}
        </div>
      );
    }

    const last = stackTrace[stackTrace.length - 1];

    return (
      <div>
        {this.state.showAllElements ?
          <div>
            <div onClick={this.toggle}>
              [Show less…]
            </div>

            {stackTrace.filter(st => st !== last).map((st, i) =>
              <div key={i}>
                {st.get('c')}#{st.get('m')}:{st.get('n')}

                <span>
                  &nbsp;[View Source]
                </span>
              </div>
            )}

            <div onClick={this.toggle}>
              [Show less…]
            </div>
          </div>
        : null}

        <div>
          {last.get('c')}#{last.get('m')}:{last.get('n')}

          {!this.state.showAllElements ?
            <span onClick={this.toggle}>
              &nbsp;[Show more…]
            </span>
          : null}

          <span>
            &nbsp;[View Source]
          </span>
        </div>
      </div>
    );
  },

  toggle() {
    this.setState({
      showAllElements: !this.state.showAllElements
    });
  }
});
