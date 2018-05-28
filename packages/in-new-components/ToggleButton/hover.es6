import React from 'react';

import { getDisplayName } from 'in-hoc/internal/getDisplayName';

import locals from './ToggleButton.mless';

export default function hover(ComposedComponent) {
  return class extends React.Component {
    static displayName = getDisplayName(ComposedComponent, 'HoverHoc');

    state = {
      hovered: false
    };

    onClick() {
      // in this particular use case (toggle button) we do not want to render the hovered icon if the user just clicked
      // the toggle button but the mouse pointer is still over the element. Only after leaving the element and entering
      // it again hover is set to true again.
      this.setState({ hovered: false });
    }

    onMouseEnter() {
      this.setState({ hovered: true });
    }

    onMouseLeave() {
      this.setState({ hovered: false });
    }

    render() {
      return (
        <span
          className={locals.mouseEventsWrapper}
          onClick={() => this.onClick()}
          onMouseEnter={() => this.onMouseEnter()}
          onMouseLeave={() => this.onMouseLeave()}
        >
          <ComposedComponent {...this.props} hovered={this.state.hovered} />
        </span>
      );
    }
  };
}
