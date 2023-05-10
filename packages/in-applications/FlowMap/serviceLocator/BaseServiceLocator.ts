/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */

interface NullService {
  dispose: () => void;
}

export default class BaseServiceLocator<T extends NullService> {
  nullService: T;
  service: T;

  constructor(createNullService: () => T) {
    this.nullService = createNullService();
    this.service = this.nullService;
  }

  dispose() {
    if (this.service.dispose) {
      return this.service.dispose();
    }
  }

  provide(_service: T) {
    if (this.service) {
      this.service.dispose();
    }

    if (!_service) {
      this.service = this.nullService;
      return;
    }

    this.service = _service;
  }
}
