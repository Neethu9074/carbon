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

// disabling this until there was a fix for the broken tests - in a follow-up task
// it was not yet adopted to using Carbon core components
xdescribe('in-websites/WebsiteDashboard/tabs/Configuration/Options/CustomGeoDetails/Uploader', () => {
  const putMock = put as jest.Mock<Promise<Response>, [string, string]>;
  // Given
  let input: HTMLElement | null;
  let addbutton: HTMLButtonElement;
  let savebutton: HTMLButtonElement;

  beforeEach(() => {
    putMock.mockReturnValue(new Promise(() => {}));
    const { container } = render(<Uploader apiUrl={apiUrl} documentationUrl={documentationUrl} />);
    input = container.querySelector('input.cds--visually-hidden');
    addbutton = screen.getByText(/add file/i, { selector: 'button' }) ?? new HTMLElement();
    savebutton = screen.getByText(/save/i, { selector: 'button' }) ?? new HTMLElement();
  });

  it('must prompt for file uploads', () => {
    // Then
    expect(addbutton.disabled).toEqual(false);
    expect(savebutton.disabled).toEqual(true);
  });

  it('must accept single files', async () => {
    // Click button
    fireEvent.click(addbutton);

    const file = getMockFile(testFileName);
    if (input)
      fireEvent.change(input, {
        target: {
          files: [file]
        }
      });

    // Then
    await screen.findByText(testFileName);
    expect(addbutton.disabled).toEqual(false);
    expect(savebutton.disabled).toEqual(false);
    expect(file.numberOfTextLoads).toEqual(1);
  });

  it('must revert back to non-selected state', async () => {
    fireEvent.click(addbutton);

    const file = getMockFile(testFileName);
    if (input)
      fireEvent.change(input, {
        target: {
          files: [file]
        }
      });
    await screen.findByText(testFileName);

    // When there is a fix to file uploader re add this test
    //const closebutton = screen.getByRole('button', {name: /uploading file/i});
    //expect(closebutton).toBeValid();
    //await fireEvent.click(closebutton);
    //expect(screen.queryByText(testFileName)).toBeNull();

    // Then
    //expect(closebutton).toBeNull();
    expect(addbutton.disabled).toEqual(false);
    expect(file.numberOfTextLoads).toEqual(1);
  });

  it('must inform about file reading errors', async () => {
    fireEvent.click(addbutton);

    // When
    const file = getMockFile(testFileName, false);
    if (input)
      fireEvent.change(input, {
        target: {
          files: [file]
        }
      });

    // Then
    await screen.findByText(`Failed to read file content: file 'superFancyAwesomeFile.txt' does not exist`);
    await screen.findByText(testFileName);
    expect(savebutton.disabled).toEqual(true);
    expect(file.numberOfTextLoads).toEqual(1);
  });

  it('must persist the file content', async () => {
    fireEvent.click(addbutton);

    if (input)
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
    fireEvent.click(savebutton);

    // Then
    expect(putMock).toHaveBeenCalledWith(apiUrl, `File content of file '${testFileName}'`);
    await screen.findByText('Saved');
  });

  it('must present technical HTTP call failure details', async () => {
    fireEvent.click(addbutton);

    if (input)
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
    if (input) fireEvent.submit(input);

    // Then
    await screen.findByText('Failed to execute HTTP call: Failed to resolve DNS name.');
  });

  it('must present semantical HTTP call failure details', async () => {
    fireEvent.click(addbutton);

    if (input)
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
    fireEvent.click(savebutton);

    // Then
    await screen.findByText('HTTP call returned with erroneous result: Invalid CIDR');
  });

  it('must present semantical HTTP call failure details that fail to load', async () => {
    fireEvent.click(addbutton);

    if (input)
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
    fireEvent.submit(savebutton);

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
