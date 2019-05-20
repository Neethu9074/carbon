import { debounce } from 'lodash';
import React from 'react';

const maximumTimeHighlightsMayBePending = 1000 * 60 * 2;
const pendingHighlights = new Map();
const highlightHandlers = new Map();

export function init() {
  setInterval(cleanUpPendingHighlights, 1000 * 10);
}

function cleanUpPendingHighlights() {
  const minTimestamp = Date.now() - maximumTimeHighlightsMayBePending;
  pendingHighlights.forEach((time, id) => {
    if (time < minTimestamp) {
      pendingHighlights.delete(id);
    }
  });
}

// triggerHighlight is typically used as a click listeners. These click listeners might also result in URL changes
// and these might result in component tree changes. We are debouncing to have a minimum delay of 100ms to ensure
// that any old registered handlers are removed.
export const triggerHighlight = debounce(id => {
  const handler = highlightHandlers.get(id);
  if (handler) {
    handler();
  } else {
    pendingHighlights.set(id, Date.now());
  }
}, 100);

export class HighlightedEffect extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      highlighted: false
    };
  }

  componentDidMount() {
    highlightHandlers.set(this.props.id, this.highlight);
    if (pendingHighlights.get(this.props.id)) {
      pendingHighlights.delete(this.props.id);
      this.highlight();
    }
  }

  setDomNode = domNode => {
    this.domNode = domNode;

    if (this.state.highlighted && domNode) {
      this.scrollIntoView();
    }
  };

  scrollIntoView() {
    if (this.domNode) {
      this.domNode.scrollIntoView({
        behavior: 'smooth',
        block: 'center'
      });
    }
  }

  highlight = () => {
    this.stopPendingHighlightClearing();
    this.setState({ highlighted: true });
    this.clearHighlightedTimeout = setTimeout(this.clearHighlight, this.props.highlightDuration || 3000);
    if (this.domNode) {
      this.scrollIntoView();
    }
  };

  clearHighlight = () => {
    this.clearHighlightedTimeout = null;
    this.setState({ highlighted: false });
  };

  stopPendingHighlightClearing() {
    if (this.clearHighlightedTimeout) {
      clearTimeout(this.clearHighlightedTimeout);
      this.clearHighlightedTimeout = null;
    }
  }

  componentWillUnmount() {
    this.stopPendingHighlightClearing();
    highlightHandlers.delete(this.props.id);
  }

  render() {
    return this.props.children({
      highlighted: this.state.highlighted,
      refSetter: this.setDomNode
    });
  }
}
