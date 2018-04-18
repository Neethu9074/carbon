export function getStart(call) {
  let earliestStart = call.start;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      earliestStart = Math.min(earliestStart, getStart(call.children[i]));
    }
  }
  return earliestStart;
}

export function getEnd(call) {
  let latestEnd = call.start + call.duration;
  if (call.children) {
    for (let i = 0; i < call.children.length; i++) {
      latestEnd = Math.max(latestEnd, getEnd(call.children[i]));
    }
  }
  return latestEnd;
}
