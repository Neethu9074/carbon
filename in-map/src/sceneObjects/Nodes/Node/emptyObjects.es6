export const emptyLabel = {
  isEmpty: true,
  getComponent: () => {
    return {
      setPosition: () => {}
    };
  },
  dispose: () => {}
};
// if unavailable, the StickyNote-Metric / Layer will not be undefined but this
// to avoid all these if (available) {do something} stuff
export const emptySticky = {
  isEmpty: true,
  hide() {},
  show() {},
  update() {},
  updateWorldPos() {},
  render() {},
  dispose() {},
  setInactive() {},
  switchToMetric() {},
  switchToIcon() {}
};

export const emptyTooltip = {
  isEmpty: true,
  mount() {},
  unMount() {}
};
