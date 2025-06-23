/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

import { render, screen, fireEvent, act } from '@testing-library/react';
import { createMapForm } from 'formalistic';
import React from 'react';

import AddScriptDialogContent from 'in-synthetics/createTests/advanced/AddScriptDialogContent';

describe('AddScriptDialogContent - File upload', () => {
  const isBrowser = true;
  const setSliderState = jest.fn().mockResolvedValue({
    slideInConfig: {},
    isVisible: false
  });
  const setCustomSlideInHeaderConfig = jest.fn();
  const onSubmit = jest.fn();

  const configForm = createMapForm();
  const script = { name: '', text: '', extension: '' };
  const zipFile = { name: '', files: [], blob: null };
  render(
    <AddScriptDialogContent
      form={configForm}
      scriptContent={script}
      zipFileDetails={zipFile}
      setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
      onSubmit={onSubmit}
      setSliderState={setSliderState}
      isBrowser={isBrowser}
    />
  );
  const input = screen.getByLabelText('Add file');

  it('Uploads a js file correctly when FF is true', async () => {
    const jsFile = new File(['consloe.log("hello")'], 'test.js', { type: 'application/javascript' });
    jsFile.text = jest.fn().mockResolvedValue('consloe.log("hello")');

    await act(async () => {
      fireEvent.change(input, { target: { files: [jsFile] } });
    });

    expect((input as HTMLInputElement).files?.[0]).toBe(jsFile);
    expect((input as HTMLInputElement).files?.[0].name).toBe('test.js');
  });

  it('Uploads a mjs file correctly when FF is true', async () => {
    const mjsFile = new File(['consloe.log("hello")'], 'test.mjs', { type: 'application/javascript' });
    mjsFile.text = jest.fn().mockResolvedValue('consloe.log("hello")');

    await act(async () => {
      fireEvent.change(input, { target: { files: [mjsFile] } });
    });

    expect((input as HTMLInputElement).files?.[0]).toBe(mjsFile);
    expect((input as HTMLInputElement).files?.[0].name).toBe('test.mjs');
  });

  it('Uploads a side file correctly when FF is true', async () => {
    const jsFile = new File(['kkmkmkmkmkm'], 'test.side', { type: 'application/side' });
    jsFile.text = jest.fn().mockResolvedValue('consloe.log("hello")');

    await act(async () => {
      fireEvent.change(input, { target: { files: [jsFile] } });
    });

    expect((input as HTMLInputElement).files?.[0]).toBe(jsFile);
    expect((input as HTMLInputElement).files?.[0].name).toBe('test.side');
  });

  it('Uploads a zip file correctly when FF is true', async () => {
    const testFile = new File(['zip file content'], 'test.zip', { type: 'application/zip' });

    await act(async () => {
      fireEvent.change(input, { target: { files: [testFile] } });
    });

    expect((input as HTMLInputElement).files?.[0]).toBe(testFile);
    expect((input as HTMLInputElement).files?.[0].name).toBe('test.zip');
  });

  it('Uploads a js file correctly for apiscript when FF is false', async () => {
    let isBrowser = false;
    jest.mock('in-services/featureFlags', () => ({
      get syntheticRbacLimitedEnabled() {
        return false;
      }
    }));
    render(
      <AddScriptDialogContent
        form={configForm}
        scriptContent={script}
        zipFileDetails={zipFile}
        setCustomSlideInHeaderConfig={setCustomSlideInHeaderConfig}
        onSubmit={onSubmit}
        setSliderState={setSliderState}
        isBrowser={isBrowser}
      />
    );
    const jsFile = new File(['consloe.log("hello")'], 'test.js', { type: 'application/javascript' });
    jsFile.text = jest.fn().mockResolvedValue('consloe.log("hello")');

    await act(async () => {
      fireEvent.change(input, { target: { files: [jsFile] } });
    });

    expect((input as HTMLInputElement).files?.[0]).toBe(jsFile);
    expect((input as HTMLInputElement).files?.[0].name).toBe('test.js');
  });
});
