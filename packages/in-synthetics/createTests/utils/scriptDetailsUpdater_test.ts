/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import { MapForm, createField, createMapForm } from 'formalistic';

import { createZipScriptConfigurationForm } from 'in-synthetics/createTests/form/createSyntheticTestForm';
import { scriptDetailsUpdater } from 'in-synthetics/createTests/utils/scriptDetailsUpdater';

describe('scriptDetailsUpdater', () => {
  let configForm: MapForm<any>;
  test('no files uploaded', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: '' }))
      .put('script', createField({ value: '' }));

    expect(scriptDetailsUpdater(configForm, false, false, { modified: false, name: '' })).toStrictEqual({
      name: '',
      text: '',
      extension: 'js'
    });
  });

  test('.side script uploaded in advanced mode', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'BrowserScript' }))
      .put('script', createField({ value: '{"test": "data"}' }));

    expect(scriptDetailsUpdater(configForm, false, true, { modified: true, name: '' })).toStrictEqual({
      name: '',
      text: '{"test": "data"}',
      extension: 'side'
    });
  });

  test('.js script uploaded in advanced mode', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'BrowserScript' }))
      .put('script', createField({ value: 'console.log("test data");' }));

    expect(scriptDetailsUpdater(configForm, false, true, { modified: true, name: '' })).toStrictEqual({
      name: '',
      text: 'console.log("test data");',
      extension: 'js'
    });
  });

  test('.side script uploaded in wizard mode and then switched to advanced mode', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'BrowserScript' }))
      .put('script', createField({ value: '{"test": "data"}' }));

    expect(scriptDetailsUpdater(configForm, false, false, { modified: true, name: 'instana.side' })).toStrictEqual({
      name: 'instana.side',
      text: '{"test": "data"}',
      extension: 'side'
    });
  });

  test('.js script uploaded in wizard mode and then switched to advanced mode', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'WebpageScript' }))
      .put('script', createField({ value: 'console.log("test script");' }));
    expect(scriptDetailsUpdater(configForm, false, false, { modified: true, name: 'sample-script.js' })).toStrictEqual({
      name: 'sample-script.js',
      text: 'console.log("test script");',
      extension: 'js'
    });
  });

  test('.js script uploaded, modified in wizard mode and then switched to advanced mode', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'WebpageScript' }))
      .put('script', createField({ value: 'console.log("test script");' }));
    expect(scriptDetailsUpdater(configForm, false, false, { modified: true, name: '' })).toStrictEqual({
      name: '',
      text: 'console.log("test script");',
      extension: 'js'
    });
  });

  test('Update a test which has .side script configured ', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'WebpageScript' }))
      .put('script', createField({ value: '{"test":"data"}' }));
    expect(scriptDetailsUpdater(configForm, true, false)).toStrictEqual({
      name: 'Script added',
      text: '{"test":"data"}',
      extension: 'side'
    });
  });

  test('Update a test which has bundle configured ', () => {
    configForm = createMapForm()
      .put('syntheticType', createField({ value: 'BrowserScript' }))
      .put(
        'scripts',
        createZipScriptConfigurationForm('UEsDBBQAAAAAAGt5mVYAAAAAAAAAAALBQYAAAAABAAEAJ0BAACwAwAAAAA=', 'index.js')
      );
    expect(scriptDetailsUpdater(configForm, true, false)).toStrictEqual({
      name: 'Bundled scripts added',
      text: 'UEsDBBQAAAAAAGt5mVYAAAAAAAAAAALBQYAAAAABAAEAJ0BAACwAwAAAAA=',
      scriptFile: 'index.js',
      extension: 'zip'
    });
  });
});
