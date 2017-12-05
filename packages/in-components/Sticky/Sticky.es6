import React from 'react';

import { add, remove } from 'in-components/Sticky/stores/cssFummler';
let id = 0;

export default class extends React.Component {
  static displayName = 'Sticky';

  componentDidMount() {
    this.id = id++;
    add({
      id: this.id,
      header: this.header,
      wrapper: this.wrapper
    });
  }

  componentWillUnmount() {
    remove(this.id);
  }

  render() {
    const { header, children } = this.props;

    return (
      <div ref={r => (this.wrapper = r)}>
        <div key={1} ref={r => (this.header = r)}>
          {header}
        </div>
        {children}
      </div>
    );
  }
}
