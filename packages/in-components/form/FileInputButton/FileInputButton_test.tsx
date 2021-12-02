/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import FileInputButton from 'in-components/form/FileInputButton/FileInputButton';

describe('in-components/form/FileInputButton/FileInputButton', () => {
  it('must render empty state', () => {
    render(<FileInputButton />);
    screen.getByText('Choose file…');
  });

  it('must render empty multiple state', () => {
    render(<FileInputButton multiple />);
    screen.getByText('Choose files…');
  });

  it('must render custom labels', () => {
    render(<FileInputButton>My custom label</FileInputButton>);
    screen.getByText('My custom label');
  });

  it('must support selection', () => {
    // Given
    const onChange = jest.fn();
    render(<FileInputButton onChange={onChange} />);
    const { input } = getElements();

    // When
    const fileName = 'superFancyAwesomeFile.txt';
    const files = [
      {
        name: fileName
      }
    ];
    fireEvent.change(input, {
      target: {
        files
      }
    });

    // Then
    screen.getByText(fileName);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.files).toEqual(files);
  });

  it('must support mult-iselection', () => {
    // Given
    const onChange = jest.fn();
    render(<FileInputButton onChange={onChange} />);
    const { input } = getElements();

    // When
    const files = [
      {
        name: 'something you will never forget.txt'
      },
      {
        name: 'i would not believe what I saw.txt'
      }
    ];
    fireEvent.change(input, {
      target: {
        files
      }
    });

    // Then
    screen.getByText(`2 files selected`);
    expect(onChange).toHaveBeenCalledTimes(1);
    expect(onChange.mock.calls[0][0].target.files).toEqual(files);
  });

  it('must support canceling', () => {
    // Given
    const onChange = jest.fn();
    render(<FileInputButton onChange={onChange} />);
    const { input } = getElements();
    fireEvent.change(input, {
      target: {
        files: [
          {
            name: 'a story like no other.txt'
          }
        ]
      }
    });

    // When
    fireEvent.change(input, {
      target: {
        files: []
      }
    });

    // Then
    screen.getByText(`Choose file…`);
    expect(onChange).toHaveBeenCalledTimes(2);
  });
});

interface Elements {
  input: HTMLInputElement;
}

function getElements(): Elements {
  return {
    input: screen.getByTestId('file-selector')
  };
}
