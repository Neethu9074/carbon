import {isSafari} from 'in-services/browser';

// We have seen cases where socket.io XHR polling requests run into
// bugs in the Safari internal network helper process. This resulted in
// our server being bombarded with requests. For some unknown reason,
// Safari retried these XHR requests over and over again. The result was
// that something between 50 and 100 requests per second hit our backend.
//
// Socket.io isn't doing anything wrong in their XHR polling implementation,
// this seems to be a bug in Safari itself. We took measures to reduce the
// impact of a bug like this by caching backend auth checks for a few seconds.
// This is sufficient to avoid the worst case, i.e. several hundred requests
// in a few seconds. Also, we enable timeouts in the hopes that the Safari
// helper code adheres to timeouts and stops retrying.
//
// The definition of timeouts is being contributed to the engine.io-client.
// Unfortunately the PR is not yet, nor is feature released. For this reason,
// we define a default timeout for all HTTP requests of one minute for the
// time being.
//
// Link to PR: https://github.com/socketio/engine.io-client/pull/456
//
// Steps to reproduce this issue:
// 1. Open Instana in Safari, sign in and wait for the map to populate with
//    data.
// 2. Delete the in-token cookie to remove our authentication.
// 3. Restart your network connection to initiate a backend reconnect.
// 4. In the system activity manager, inspect the CPU usage of the Safari
//    network manager.

// Overwriting globals in such a way is not possible in IE. Since this is
// meant as a Safari workaround in the first place, we will restrict it to
// Safari.
if (isSafari()) {
  const OriginalXhr = window.XMLHttpRequest;
  window.XMLHttpRequest = function TimeoutXMLHttpRequestOverwrite() {
    const xhr = new OriginalXhr();
    xhr.timeout = 60000;
    return xhr;
  };

}
