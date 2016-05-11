// Commented because this is probably a stupid idea. We might want to apply these updates
// immediately to sigma for perf reasons.

// import createGraphSubscription from 'in-services/subscription/graph';
// import {focusedMoment$} from 'in-stores/timeline';
//
// export const graph$ = focusedMoment$.flatMap(focusedMoment => {
//   return createGraphSubscription(focusedMoment)
//     .scan((edges, updates) => {
//       // TODO apply updates and remove
//       return edges;
//     }, [])
// });
