export const emptyLabel = {
  isEmpty: true,
  getComponent: () => {
    return {
      setPosition: () => {}
    };
  },
  dispose: () => {}
};

export const emptyTooltip = {
  isEmpty: true,
  mount() {},
  unMount() {}
};
