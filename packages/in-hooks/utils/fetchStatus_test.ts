/*
 * (c) Copyright IBM Corp. 2022
 * (c) Copyright Instana Inc. 2022
 */

import { all } from 'in-hooks/utils/fetchStatus';

describe('in-hooks/utils/fetchStatus', () => {
  describe('if all status are `resolved`', () => {
    it('should return `resolved`', () => {
      const syncStatus = all('resolved', 'resolved', 'resolved');
      expect(syncStatus).toEqual('resolved');
    });
  });
  describe('if all status are `rejected`', () => {
    it('should return `rejected`', () => {
      const syncStatus = all('rejected', 'rejected', 'rejected');
      expect(syncStatus).toEqual('rejected');
    });
  });
  describe('if all status are `pending`', () => {
    it('should return `pending`', () => {
      const syncStatus = all('pending', 'pending', 'pending');
      expect(syncStatus).toEqual('pending');
    });
  });
  describe('if one status is `resolved` and others `pending`', () => {
    it('should return `pending`', () => {
      const syncStatus = all('pending', 'resolved', 'pending');
      expect(syncStatus).toEqual('pending');
    });
  });
  describe('if one status is `resolved` and others `rejected`', () => {
    it('should return `rejected`', () => {
      const syncStatus = all('rejected', 'resolved', 'rejected');
      expect(syncStatus).toEqual('rejected');
    });
  });
  describe('if one status is `pending` and others `rejected`', () => {
    it('should return `rejected`', () => {
      const syncStatus = all('rejected', 'pending', 'rejected');
      expect(syncStatus).toEqual('rejected');
    });
  });
  describe('if status are `pending`, `rejected` and `resolved', () => {
    it('should return `rejected`', () => {
      const syncStatus = all('pending', 'rejected', 'resolved');
      expect(syncStatus).toEqual('rejected');
    });
  });
});
