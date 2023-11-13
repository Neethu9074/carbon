/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2023
 */

import {
  toUploadLabel,
  toUploadFileCountValue,
  toUploadFileCount,
  toUploadLastModified,
  toUploadTotalSizeValue,
  toUploadTotalSize
} from 'in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/StackTraceTranslation/StackTraceTranslation';

describe('in-mobile-apps/MobileAppDashboard/tabs/Configuration/Options/StackTraceTranslation/StackTraceTranslation', () => {
  const regularSourceMapUploadConfig = {
    id: 'regularConfigId',
    description: 'regular config',
    createdAt: 1697450125,
    modifiedAt: 1697750125,
    metadata: [
      {
        format: 'tgz',
        size: 512.488,
        sizeOnDisk: 2488,
        type: 'JS' as 'JS' | 'JS_MAP',
        url: 'someuuid'
      }
    ]
  };

  const specialSourceMapUploadConfig = {
    id: 'specialConfigId',
    createdAt: 1697750125,
    metadata: [
      {
        format: 'tgz',
        size: 0,
        sizeOnDisk: 0,
        type: 'JS' as 'JS' | 'JS_MAP',
        url: 'someuuid'
      }
    ]
  };

  const emptySourceMapUploadConfig = {
    id: 'emptyConfigId',
    createdAt: 1697750125,
    metadata: []
  };

  describe('verify with normal config', () => {
    it('must display label', () => {
      const label = toUploadLabel(regularSourceMapUploadConfig);
      expect(label).toEqual('regular config');
    });

    it('must get expected last modified time', () => {
      const lastModified = toUploadLastModified(regularSourceMapUploadConfig);
      expect(lastModified).toEqual('2023-10-19, 23:15:25');
    });

    it('must get expected total size in number', () => {
      const totalSize = toUploadTotalSizeValue(regularSourceMapUploadConfig);
      expect(totalSize).toEqual(512.488);
    });

    it('must get expected total size in literal', () => {
      const totalSizeInLiteral = toUploadTotalSize(regularSourceMapUploadConfig);
      expect(totalSizeInLiteral).toEqual('512.49 B');
    });
  });

  describe('verify with special config', () => {
    it('must display label', () => {
      const label = toUploadLabel(specialSourceMapUploadConfig);
      expect(label).toEqual('');
    });

    it('must get expected count in number', () => {
      const count = toUploadFileCountValue(specialSourceMapUploadConfig);
      expect(count).toEqual(1);
    });

    it('must get expected count in literal', () => {
      const countInLiteral = toUploadFileCount(specialSourceMapUploadConfig);
      expect(countInLiteral).toEqual(1);
    });

    it('must get expected last modified time', () => {
      const lastModified = toUploadLastModified(specialSourceMapUploadConfig);
      expect(lastModified).toEqual('2023-10-19, 23:15:25');
    });

    it('must get expected total size in number', () => {
      const totalSize = toUploadTotalSizeValue(specialSourceMapUploadConfig);
      expect(totalSize).toEqual(0);
    });

    it('must get expected total size in literal', () => {
      const totalSizeInLiteral = toUploadTotalSize(specialSourceMapUploadConfig);
      expect(totalSizeInLiteral).toEqual('-');
    });
  });

  describe('verify with empty config', () => {
    it('must get expected count in number', () => {
      const count = toUploadFileCountValue(emptySourceMapUploadConfig);
      expect(count).toEqual(0);
    });

    it('must get expected count in literal', () => {
      const countInLiteral = toUploadFileCount(emptySourceMapUploadConfig);
      expect(countInLiteral).toEqual('-');
    });
  });
});
