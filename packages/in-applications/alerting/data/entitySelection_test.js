/*
 * (c) Copyright IBM Corp. 2021
 * (c) Copyright Instana Inc.
 */
/* eslint-env mocha */
import { expect } from 'chai';

import {
  getEntitySelectionAsTagFilterFormModel,
  getEntitySelection
} from 'in-applications/alerting/data/entitySelection';
import { CONJUNCTION, OPEN_BRACKET, CLOSE_BRACKET } from 'in-new-components/QueryBuilder/transformation/formModel';
import { and, or } from 'in-new-components/QueryBuilder/ConjunctionSelectorOverlay/supportedSelections';
import { EQUALS, NOT_EQUAL } from 'in-new-components/QueryBuilder/tagFilter/operators';
import { tagFilter } from 'in-new-components/QueryBuilder/transformation/tagFilter';
import { boundaryScopes } from 'in-applications/constants';

describe('in-applications/alerting/data/entitySelection', () => {
  describe('#getEntitySelectionAsTagFilterFormModel', () => {
    it('should return applicationId filter for missing application selection for backward compatibility', () => {
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(null, boundaryScopes.all, 'app1', null, null);

      expect(actualFormModel).to.deep.equal([tagFilter('application.id', EQUALS, 'app1')]);
    });

    it('should return applicationId filter for full application selection', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {}
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        null,
        null
      );

      expect(actualFormModel).to.deep.equal([tagFilter('application.id', EQUALS, 'app1')]);
    });

    it('should allow to select full application but exclude service', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: false
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        null,
        null
      );

      expect(actualFormModel).to.deep.equal([
        tagFilter('application.id', EQUALS, 'app1'),
        { type: CONJUNCTION, logicalOperator: and },
        tagFilter('service.id', NOT_EQUAL, 'service1')
      ]);
    });

    it('should allow to select only specific services of an application', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: true
            },
            service2: {
              serviceId: 'service2',
              inclusive: true
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        null,
        null
      );

      expect(actualFormModel).to.deep.equal([
        tagFilter('application.id', EQUALS, 'app1'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', EQUALS, 'service1'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('service.id', EQUALS, 'service2'),
        { type: CLOSE_BRACKET }
      ]);
    });

    it('should allow complex selection with inclusive application', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: true,
              endpoints: {
                endpoint11: {
                  endpointId: 'endpoint11',
                  inclusive: false
                }
              }
            },
            service2: {
              serviceId: 'service2',
              inclusive: true,
              endpoints: {
                endpoint21: {
                  endpointId: 'endpoint21',
                  inclusive: false
                },
                endpoint22: {
                  endpointId: 'endpoint22',
                  inclusive: false
                },
                endpoint23: {
                  endpointId: 'endpoint23',
                  inclusive: false
                }
              }
            },
            service3: {
              serviceId: 'service3',
              inclusive: false,
              endpoints: {
                endpoint31: {
                  endpointId: 'endpoint31',
                  inclusive: true
                }
              }
            },
            service4: {
              serviceId: 'service4',
              inclusive: false,
              endpoints: {
                endpoint41: {
                  endpointId: 'endpoint41',
                  inclusive: true
                },
                endpoint42: {
                  endpointId: 'endpoint42',
                  inclusive: true
                }
              }
            },
            service5: {
              serviceId: 'service5',
              inclusive: false
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        'appName',
        null
      );

      expect(actualFormModel).to.deep.equal([
        tagFilter('application.name', EQUALS, 'appName'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', NOT_EQUAL, 'service1'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint11'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', NOT_EQUAL, 'service2'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint21'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', NOT_EQUAL, 'service2'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint22'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', NOT_EQUAL, 'service2'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint23'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', NOT_EQUAL, 'service3'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', EQUALS, 'endpoint31'),
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', NOT_EQUAL, 'service4'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('endpoint.id', EQUALS, 'endpoint41'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', EQUALS, 'endpoint42'),
        { type: CLOSE_BRACKET },
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: and },
        tagFilter('service.id', NOT_EQUAL, 'service5')
      ]);
    });

    it('should allow complex selection with exclusive application', () => {
      const applications = {
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: false,
              endpoints: {
                endpoint11: {
                  endpointId: 'endpoint11',
                  inclusive: true
                }
              }
            },
            service2: {
              serviceId: 'service2',
              inclusive: false,
              endpoints: {
                endpoint21: {
                  endpointId: 'endpoint21',
                  inclusive: true
                },
                endpoint22: {
                  endpointId: 'endpoint22',
                  inclusive: true
                },
                endpoint23: {
                  endpointId: 'endpoint23',
                  inclusive: true
                }
              }
            },
            service3: {
              serviceId: 'service3',
              inclusive: true,
              endpoints: {
                endpoint31: {
                  endpointId: 'endpoint31',
                  inclusive: false
                }
              }
            },
            service4: {
              serviceId: 'service4',
              inclusive: true,
              endpoints: {
                endpoint41: {
                  endpointId: 'endpoint41',
                  inclusive: false
                },
                endpoint42: {
                  endpointId: 'endpoint42',
                  inclusive: false
                }
              }
            },
            service5: {
              serviceId: 'service5',
              inclusive: true
            }
          }
        }
      };
      const actualFormModel = getEntitySelectionAsTagFilterFormModel(
        applications,
        boundaryScopes.all,
        'app1',
        null,
        null
      );

      expect(actualFormModel).to.deep.equal([
        tagFilter('application.id', EQUALS, 'app1'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('service.id', EQUALS, 'service1'),
        { type: CONJUNCTION, logicalOperator: and },
        tagFilter('endpoint.id', EQUALS, 'endpoint11'),
        { type: CONJUNCTION, logicalOperator: or },
        { type: OPEN_BRACKET },
        tagFilter('service.id', EQUALS, 'service2'),
        { type: CONJUNCTION, logicalOperator: and },
        { type: OPEN_BRACKET },
        tagFilter('endpoint.id', EQUALS, 'endpoint21'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', EQUALS, 'endpoint22'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('endpoint.id', EQUALS, 'endpoint23'),
        { type: CLOSE_BRACKET },
        { type: CLOSE_BRACKET },
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('service.id', EQUALS, 'service3'),
        { type: CONJUNCTION, logicalOperator: and },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint31'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('service.id', EQUALS, 'service4'),
        { type: CONJUNCTION, logicalOperator: and },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint41'),
        { type: CONJUNCTION, logicalOperator: and },
        tagFilter('endpoint.id', NOT_EQUAL, 'endpoint42'),
        { type: CONJUNCTION, logicalOperator: or },
        tagFilter('service.id', EQUALS, 'service5'),
        { type: CLOSE_BRACKET }
      ]);
    });

    describe('scoped to sub-entity via serviceId', () => {
      it('should return (applicationId AND serviceId) filter for missing application selection for backward compatibility', () => {
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          null,
          boundaryScopes.inbound,
          'app1',
          null,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('boundary.application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('service.id', EQUALS, 'service1')
        ]);
      });

      it('should return (applicationId AND serviceId) filter for full application selection', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: true,
            services: {}
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          null,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('service.id', EQUALS, 'service1')
        ]);
      });

      it('should allow to select only specific services of an application but then scope it to a single one', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: false,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: true
              },
              service2: {
                serviceId: 'service2',
                inclusive: true
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.inbound,
          'app1',
          null,
          'service2'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('boundary.application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('service.id', EQUALS, 'service2')
        ]);
      });

      it('should allow to select only specific services of complex selection with inclusive application and excluded endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: true,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: true,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: false
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: false
                  }
                }
              },
              service2: {
                serviceId: 'service2',
                inclusive: false
              },
              service3: {
                serviceId: 'service3',
                inclusive: false
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          null,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('endpoint.id', NOT_EQUAL, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('endpoint.id', NOT_EQUAL, 'endpoint12')
        ]);
      });

      it('should allow to select only specific services of complex selection with inclusive application and included endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: true,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: false,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: true
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: true
                  }
                }
              },
              service2: {
                serviceId: 'service2',
                inclusive: false
              },
              service3: {
                serviceId: 'service3',
                inclusive: false
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          null,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          { type: OPEN_BRACKET },
          tagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          { type: OPEN_BRACKET },
          tagFilter('endpoint.id', EQUALS, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: or },
          tagFilter('endpoint.id', EQUALS, 'endpoint12'),
          { type: CLOSE_BRACKET },
          { type: CLOSE_BRACKET }
        ]);
      });

      it('should allow to select only specific services of complex selection with exclusive application and excluded endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: false,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: true,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: false
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: false
                  }
                }
              },
              service2: {
                serviceId: 'service2',
                inclusive: true
              },
              service3: {
                serviceId: 'service3',
                inclusive: true
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          null,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('endpoint.id', NOT_EQUAL, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: and },
          tagFilter('endpoint.id', NOT_EQUAL, 'endpoint12')
        ]);
      });

      it('should allow to select only specific services of complex selection with exclusive application and included endpoints', () => {
        const applications = {
          app1: {
            applicationId: 'app1',
            inclusive: false,
            services: {
              service1: {
                serviceId: 'service1',
                inclusive: false,
                endpoints: {
                  endpoint11: {
                    endpointId: 'endpoint11',
                    inclusive: true
                  },
                  endpoint12: {
                    endpointId: 'endpoint12',
                    inclusive: true
                  }
                }
              },
              service2: {
                serviceId: 'service2',
                inclusive: true
              },
              service3: {
                serviceId: 'service3',
                inclusive: true
              }
            }
          }
        };
        const actualFormModel = getEntitySelectionAsTagFilterFormModel(
          applications,
          boundaryScopes.all,
          'app1',
          null,
          'service1'
        );

        expect(actualFormModel).to.deep.equal([
          tagFilter('application.id', EQUALS, 'app1'),
          { type: CONJUNCTION, logicalOperator: and },
          { type: OPEN_BRACKET },
          tagFilter('service.id', EQUALS, 'service1'),
          { type: CONJUNCTION, logicalOperator: and },
          { type: OPEN_BRACKET },
          tagFilter('endpoint.id', EQUALS, 'endpoint11'),
          { type: CONJUNCTION, logicalOperator: or },
          tagFilter('endpoint.id', EQUALS, 'endpoint12'),
          { type: CLOSE_BRACKET },
          { type: CLOSE_BRACKET }
        ]);
      });
    });
  });

  describe('#getEntitySelection', () => {
    it('should return application selection', () => {
      const applications = getEntitySelection('app1');

      expect(applications).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: true,
          services: {}
        }
      });
    });

    it('should return application+service selection', () => {
      const applications = getEntitySelection('app1', 'service1');

      expect(applications).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: true,
              endpoints: {}
            }
          }
        }
      });
    });

    it('should return application+service+endpoint selection', () => {
      const applications = getEntitySelection('app1', 'service1', 'endpoint1');

      expect(applications).to.deep.equal({
        app1: {
          applicationId: 'app1',
          inclusive: false,
          services: {
            service1: {
              serviceId: 'service1',
              inclusive: false,
              endpoints: {
                endpoint1: {
                  endpointId: 'endpoint1',
                  inclusive: true
                }
              }
            }
          }
        }
      });
    });
  });
});
