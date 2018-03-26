import { storiesOf } from '@storybook/react';
import React from 'react';

import { deepFreeze } from 'in-services/util/object';
import IcicleChart from 'in-new-components/IcicleChart';

import Root from '../_helpers/Root';

storiesOf('newComponents/IcicleChart', module)
  .add('Synchronous spans', () => <SynchronousSpans />)
  .add('Asynchronous spans', () => <AsynchronousSpans />)
  .add('Many small spans', () => <ManySmallSpans />);

function SynchronousSpans() {

  const rootSpan = deepFreeze({
    id: '1',
    label: 'span1',
    start: 0,
    duration: 10,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 1,
        duration: 9,
        children: [
          {
            id: '3',
            label: 'span3',
            start: 2,
            duration: 3,
            children: [
              {
                id: '6',
                label: 'span6',
                start: 2.5,
                duration: 1.5,
                children: []
              }
            ]
          },
          {
            id: '4',
            label: 'span4',
            start: 6,
            duration: 2,
            children: []
          },
          {
            id: '5',
            label: 'span5',
            start: 9,
            duration: 0.1,
            children: []
          }
        ]
      }
    ]
  });


  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} />
    </Root>
  );
}


function AsynchronousSpans() {

  const rootSpan = deepFreeze({
    id: '1',
    label: 'span1',
    start: 0,
    duration: 10,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 1,
        duration: 7,
        children: [
          {
            id: '4',
            label: 'span4',
            start: 4.5,
            duration: 3,
            children: [
              {
                id: '7',
                label: 'span7',
                start: 5.5,
                duration: 0.5,
                children: [
                ]
              }
            ]
          }
        ]
      },
      {
        id: '3',
        label: 'span3',
        start: 2,
        duration: 0.5,
        children: []
      },
      {
        id: '5',
        label: 'span5',
        start: 3.5,
        duration: 3,
        children: [
          {
            id: '6',
            label: 'span6',
            start: 4,
            duration: 1,
            children: []
          }
        ]
      }
    ]
  });


  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} />
    </Root>
  );
}

function ManySmallSpans() {

  const rootSpan = deepFreeze({
    id: '1',
    label: 'span1',
    start: 0,
    duration: 500,
    children: [
      {
        id: '2',
        label: 'span2',
        start: 20,
        duration: 0,
        children: []
      },
      {
        id: '3',
        label: 'span3',
        start: 21,
        duration: 0,
        children: []
      },
      {
        id: '4',
        label: 'span4',
        start: 22,
        duration: 1,
        children: []
      },
      {
        id: '9',
        label: 'span9',
        start: 22,
        duration: 10,
        children: []
      },
      {
        id: '5',
        label: 'span5',
        start: 23,
        duration: 1,
        children: []
      },
      {
        id: '6',
        label: 'span6',
        start: 24,
        duration: 1,
        children: []
      },
      {
        id: '7',
        label: 'span7',
        start: 25,
        duration: 2,
        children: [
          {
            id: '8',
            label: 'span8',
            start: 26,
            duration: 0.5,
            children: []
          }
        ]
      }
    ]
  });


  return (
    <Root>
      <IcicleChart rootSpan={rootSpan} />
    </Root>
  );
}
