/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

export default {
  id: '1',
  label: 'call1',
  start: 100,
  duration: 100,
  children: [
    {
      id: '2',
      label: 'call2',
      start: 50,
      duration: 20,
      children: []
    },
    {
      id: '3',
      label: 'call3',
      start: 150,
      duration: 100,
      children: []
    }
  ]
};
