// Copy from:
// https://github.com/fitzgen/chronos
// to adapt to webpack and our module loading strategy
//
// Also see http://fitzgeraldnick.com/2011/03/08/javascript-timer-congestion.html

// Counter which keeps incrementing to give each task a unique id.
let taskIdCounter = 0;

// Store all active tasks in this object.
const tasks = {};

// Keep track of whether the main task runner has been initialized or not.
let initialized = false;

// The interval at which we check for tasks to run. It follows that the
// smallest timeout interval you can give a task is this value.
const INTERVAL = 50;

// Return a function which calls `fn` as if `args` had been passed in as
// arguments directly. Don't need to worry about return values because this
// is only used asynchrnously, and don't need to worry about new arguments
// because we know there will be no more.
function curry(args, fn) {
  return args.length === 0 ? fn : function() {
    fn.apply(null, args);
  };
}

var keys = typeof Object.keys === 'function' ? Object.keys : function(obj) {
  var ks = [],
    k;
  for (k in obj) {
    if (obj.hasOwnProperty(k)) {
      ks.push(k);
    }
  }
  return ks;
};

function slice(ary, n) {
  return Array.prototype.slice.call(ary, n);
}

// Round n to the nearest multiple of INTERVAL.
function roundToNearestInterval(n) {
  var diff = n % INTERVAL;
  return diff < INTERVAL / 2 ? n - diff : n + INTERVAL - diff;
}


// ## Tasks
//
// A task is a function to be executed after a timeout. We abstract away the
// implementation of a task with a constructor and functions to perform each
// operation we might wish to perform on a task. The closure compiler will
// inline most of these functions for us.

// Constructor for tasks.
function makeTask(repeats, ms, fn) {
  return {
    next: ms,
    timeout: ms,
    repeats: repeats,
    fn: fn,
    lastTimeRan: +new Date()
  };
}

// Decrement the ammount of time till this task should be run next and
// returns how many milliseconds are left till the next time it should be
// run.
function decrementTimeTillNext(task) {
  return task.next = task.timeout - ((+new Date()) - task.lastTimeRan);
}

// Return true if the task repeats multiple times, false if it is a task to
// run only once.
function taskRepeats(task) {
  return task.repeats;
}

// Execute the given task.
function runTask(task) {
  task.lastTimeRan = +new Date();
  return task.fn();
}

// Reset the countdown till the next time this task is executed.
function resetTimeTillNext(task) {
  return task.next = task.timeout;
}


// ## Task Runner
//
// The task runner is the main function which runs the tasks whose timers
// have counted down, resets the timers if necessary, and deletes tasks
// which only run once and have already been run.

function taskRunner() {
  var i = 0,
    tasksToRun = keys(tasks),
    len = tasksToRun.length;

  // Make sure that the taskRunner's main loop doesn't block the browser's
  // UI thread by yielding with `setTimeout` if we are running for longer
  // than 50 ms.
  function loop() {
    var start;
    for (start = +new Date; i < len && (+new Date()) - start < 50; i++) {
      if (tasks[tasksToRun[i]] && decrementTimeTillNext(tasks[tasksToRun[i]]) < INTERVAL / 2) {
        runTask(tasks[tasksToRun[i]]);
        if (tasks[tasksToRun[i]]) {
          if (taskRepeats(tasks[tasksToRun[i]])) {
            resetTimeTillNext(tasks[tasksToRun[i]]);
          } else {
            delete tasks[tasksToRun[i]];
          }
        }
      }
    }

    if (i < len) {
      window.setTimeout(loop, 10);
    } else {
      window.setTimeout(taskRunner, INTERVAL);
    }
  }
  loop();
}

// If the task runner is not already initialized, go ahead and start
// it. Otherwise, do nothing.
function maybeInit() {
  if (!initialized) {
    window.setTimeout(taskRunner, INTERVAL);
    initialized = true;
  }
}

// Registering a task with the task runner is pretty much the same whether
// you want it to run once, or multiple times. The only difference is
// whether it runs once or multiple times, so we abstract this out from the
// public set* functions. Returns a task id.
function registerTask(repeats, fn, ms, args) {
  var id = taskIdCounter++;
  tasks[id] = makeTask(repeats,
    roundToNearestInterval(ms),
    curry(args, fn));
  maybeInit();
  return id;
}

// Remove a task from the task runner. By enforcing that `repeats` matches
// `tasks[id].repeats` we make timeouts and intervals live in seperate
// namespaces.
function deregisterTask(repeats, id) {
  return tasks[id] && tasks[id].repeats === repeats && delete tasks[id];
}


// ## Public API
//
// The arguments and return values of the functions exposed in the public
// API exactly match that of their respective timer functions defined on
// `window` by the HTML 5 specification. The only exception is
// `minimumInterval`, which is specific to Chronos.

export function setTimeout(fn, ms /*, args... */ ) {
  var args = slice(arguments, 2);
  return registerTask(false, fn, ms, args);
}

export function setInterval(fn, ms /*, args... */ ) {
  var args = slice(arguments, 2);
  return registerTask(true, fn, ms, args);
}

export function clearTimeout(id) {
  deregisterTask(false, id);
}

export function clearInterval(id) {
  deregisterTask(true, id);
}
