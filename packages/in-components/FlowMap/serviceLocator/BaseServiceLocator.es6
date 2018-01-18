export default class BaseServiceLocator {
  constructor(createNullService) {
    this.nullService = createNullService();
    this.service = this.nullService;
  }

  dispose() {
    return this.service.dispose();
  }

  provide(_service) {
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
