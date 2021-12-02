/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc. 2021
 */

import { fireEvent, render, screen } from '@testing-library/react';
import React from 'react';

import Uploader from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/Uploader';
import { put } from 'in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/apiCall';

jest.mock('in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/apiCall');

const apiUrl = 'https://api.example.com/geo';
const documentationUrl = 'https://docs.example.com/geo';
const testFileName = 'superFancyAwesomeFile.txt';

describe('in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/Uploader', () => {
  const putMock = put as jest.Mock<Promise<Response>, [string, string]>;

  beforeEach(() => {
    putMock.mockReturnValue(new Promise(() => {}));
    render(<Uploader apiUrl={apiUrl} documentationUrl={documentationUrl} />);
  });

  it('must prompt for file uploads', () => {
    // Given
    const { input, button } = getElements();

    // Then
    expect(input.disabled).toEqual(false);
    expect(button.disabled).toEqual(true);
    screen.getByText('Choose file…');
  });

  it('must accept single files', async () => {
    // Given
    const { input, button } = getElements();

    // When
    const file = getMockFile(testFileName);
    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });

    // Then
    await screen.findByText(testFileName);
    expect(button.disabled).toEqual(false);
    expect(file.numberOfTextLoads).toEqual(1);
  });

  it('must revert back to non-selected state', async () => {
    // Given
    const { input, button } = getElements();
    const file = getMockFile(testFileName);
    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });
    await screen.findByText(testFileName);

    // When
    fireEvent.change(input, {
      target: {
        files: []
      }
    });

    // Then
    await screen.findByText('Choose file…');
    expect(button.disabled).toEqual(true);
    expect(file.numberOfTextLoads).toEqual(1);
  });

  it('must inform about file reading errors', async () => {
    // Given
    const { input, button } = getElements();

    // When
    const file = getMockFile(testFileName, false);
    fireEvent.change(input, {
      target: {
        files: [file]
      }
    });

    // Then
    await screen.findByText(`Failed to read file content: file 'superFancyAwesomeFile.txt' does not exist`);
    await screen.findByText(testFileName);
    expect(button.disabled).toEqual(true);
    expect(file.numberOfTextLoads).toEqual(1);
  });

  it('must persist the file content', async () => {
    // Given
    const { input, button } = getElements();
    fireEvent.change(input, {
      target: {
        files: [getMockFile(testFileName)]
      }
    });
    await screen.findByText(testFileName);

    // When
    putMock.mockReturnValue(
      getMockResponse({
        ok: true
      })
    );
    fireEvent.click(button);

    // Then
    expect(putMock).toHaveBeenCalledWith(apiUrl, `File content of file '${testFileName}'`);
    await screen.findByText('Saved');
  });

  it('must present technical HTTP call failure details', async () => {
    // Given
    const { input } = getElements();
    fireEvent.change(input, {
      target: {
        files: [getMockFile(testFileName)]
      }
    });
    await screen.findByText(testFileName);

    // When
    putMock.mockReturnValue(
      getMockResponse({
        ok: false,
        simulateTechnicalError: true
      })
    );
    fireEvent.submit(input);

    // Then
    await screen.findByText('Failed to execute HTTP call: Failed to resolve DNS name.');
  });

  it('must present semantical HTTP call failure details', async () => {
    // Given
    const { input } = getElements();
    fireEvent.change(input, {
      target: {
        files: [getMockFile(testFileName)]
      }
    });
    await screen.findByText(testFileName);

    // When
    putMock.mockReturnValue(
      getMockResponse({
        ok: false
      })
    );
    fireEvent.submit(input);

    // Then
    await screen.findByText('HTTP call returned with erroneous result: Invalid CIDR');
  });

  it('must present semantical HTTP call failure details that fail to load', async () => {
    // Given
    const { input } = getElements();
    fireEvent.change(input, {
      target: {
        files: [getMockFile(testFileName)]
      }
    });
    await screen.findByText(testFileName);

    // When
    putMock.mockReturnValue(
      getMockResponse({
        ok: false,
        simulateErrorReadingJsonErrors: true
      })
    );
    fireEvent.submit(input);

    // Then
    await screen.findByText('HTTP call returned with erroneous result: Invalid JSON received');
  });
});

function getMockFile(name: string, succeedLoading: boolean = true) {
  const text = () =>
    new Promise((resolve, reject) => {
      file.numberOfTextLoads++;
      if (succeedLoading) {
        resolve(`File content of file '${name}'`);
      } else {
        reject(new Error(`file '${name}' does not exist`));
      }
    });

  const file = {
    name,
    text,
    numberOfTextLoads: 0
  };

  return file;
}

interface MockResponseOptions {
  simulateTechnicalError?: boolean;
  simulateErrorReadingJsonErrors?: boolean;
  ok: boolean;
}

function getMockResponse({
  simulateTechnicalError = false,
  simulateErrorReadingJsonErrors = false,
  ok = false
}: MockResponseOptions): Promise<Response> {
  return new Promise((resolve, reject) => {
    if (simulateTechnicalError) {
      reject(new Error('Failed to resolve DNS name.'));
    } else {
      resolve({
        ok,
        json() {
          return new Promise((resolve, reject) => {
            if (simulateErrorReadingJsonErrors) {
              reject(new Error('Invalid JSON received'));
            } else {
              resolve({
                errors: ['Invalid CIDR']
              });
            }
          });
        }
      } as Response);
    }
  });
}

interface Elements {
  input: HTMLInputElement;
  button: HTMLButtonElement;
}

function getElements(): Elements {
  return {
    input: screen.getByTestId('file-selector'),
    button: screen.getByTestId('geo-save-button')
  };
}
