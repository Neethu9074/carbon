/*
 * IBM Confidential
 * PID 5737-N85, 5900-AG5
 * Copyright IBM Corp. 2025
 */

const errorPages = require('./errorPages');

let response, request;
beforeEach(() => {
  response = {
    status: jest.fn().mockReturnThis(),
    send: jest.fn().mockReturnThis(),
    set: jest.fn().mockReturnThis()
  };

  request = {
    headers: {}
  };
});

describe('Test error pages', () => {
  it('should return 403 unauthorized with template page', async () => {
    errorPages.send403(request, response, 'user', `/auth/signOut`, '/errorPages/403', null);
    expect(response.status).toHaveBeenCalledWith(403);
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Access denied'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Error 403'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Contact admin'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('not authorized'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__svg'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__403'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('access-denied-signout-form'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Sign out'));
  });

  it('should return 404 not found with template page', async () => {
    errorPages.send404(request, response);
    expect(response.status).toHaveBeenCalledWith(404);
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Page not found'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Error 404'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Support'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('status page'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Home'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('is unavailable'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__svg'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__404'));
  });

  it('should return 500 server error with template page', async () => {
    errorPages.send500(request, response);
    expect(response.status).toHaveBeenCalledWith(500);
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Internal server error'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Error 500'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Support'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('status page'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('server-side error'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__svg'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__custom'));
  });

  it('should return 503 maintenance with template page', async () => {
    errorPages.sendMaintenance(request, response);
    expect(response.status).toHaveBeenCalledWith(503);
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Page unavailable'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Maintenance'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('Support'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('status page'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('upgrading'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__svg'));
    expect(response.send).toHaveBeenCalledWith(expect.stringContaining('c4p--full-page-error__custom'));
  });
});
