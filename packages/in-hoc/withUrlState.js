/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
import React from 'react';

import useUrlState, { defaultingReducer } from 'in-hooks/useUrlState';
import { emptyArray } from 'in-services/fixedObjects';

// Sample usage
// withUrlState({
//   // only these keys will be mapped / read from the URL
//   bind: [
//     { // matrix parameter
//       path: '/things',
//       name: 'page'
//       as: 'page', // optional, will use "name" when "as" is not defined
//       parser: v => v != null ? parseInt(v) : v,
//       serializer: String,
//       initialState: 1
//     },
//     { // query parameter because path definition is missing
//       name: 'snapshotId'
//     }
//   ],
//
//   // define cases which should reset / change the URL state
//   resets: [
//     // reset the page to 1 when one of the properties changes that are used in get
//     {
//       bind: [
//         {
//           name: 'snapshotId'
//         }
//       ],
//       reset: { page: 1 }
//     }
//   ],
//
//   // function to set the new page/order/query
//   reducerName: 'onChange',
//
//   // function to be used to apply changes and to get the result as an URL observable
//   reduceAndGetAsUrlName: 'getChangeAsUrl',
//
//   reducer: (prev, change) => ({...prev, foo: change}),
//
//   // an optional side effect method which is called when something will change on the state
//   onUpdate: (prevState, newState) => (...),
//
//   // whether or not the history should be replaced or not, i.e. whether new history entries
//   // should be created for any call to the reducer.
//   replaceHistory: true
// })

export default ({
  bind,
  resets = emptyArray,
  reducerName,
  reduceAndGetAsUrlName,
  reducer = defaultingReducer,
  onUpdate,
  replaceHistory = true
}) => BaseComponent => props => {
  const [state, setState, getModifiedUrl] = useUrlState({
    bind,
    resets,
    reducer,
    onUpdate,
    replaceHistory
  });
  const forwardedProps = {
    ...props,
    ...state,
    [reducerName]: setState,
    [reduceAndGetAsUrlName]: getModifiedUrl
  };
  return <BaseComponent {...forwardedProps} />;
};
