import ReactDOM from 'react-dom';
import React from 'react';

export default class IndeterminateInput extends React.Component {
  componentDidMount() {
    if (this.props.indeterminate === true) {
      this._setIndeterminate(true);
    }
  }

  componentDidUpdate(previousProps) {
    if (previousProps.indeterminate !== this.props.indeterminate) {
      this._setIndeterminate(this.props.indeterminate);
    }
  }

  _setIndeterminate(indeterminate) {
    const node = ReactDOM.findDOMNode(this);
    node.indeterminate = indeterminate;
  }

  render() {
    // eslint-disable-next-line no-unused-vars
    const { indeterminate, type, ...props } = this.props;
    return <input type="checkbox" {...props} />;
  }
}
