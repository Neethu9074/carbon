import connectTo from 'in-hoc/connectTo';

export default connectTo(
  props => {
    return {
      count: props.count$
    };
  },
  function TotalTraceCount({ count, formatCount }) {
    if (count == null || count < 0) {
      return null;
    }

    return formatCount(count);
  }
);
