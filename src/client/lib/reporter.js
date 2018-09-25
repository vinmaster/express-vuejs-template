/* eslint-disable no-console */

import axios from 'axios';
import { deepCopy } from './util';

let events = [];
let stateIndex = null;
let recorderStore;
const timeOptions = {
  weekday: 'long',
  year: 'numeric',
  month: 'short',
  day: 'numeric',
  hour: '2-digit',
  minute: '2-digit',
};

export default {
  start() {
    const instance = axios.create();
    let retryCount = 0;
    window.onerror = (message, source, lineno, colno, error) => {
      if (navigator.onLine) {
        retryCount += 1;
        instance.post('/api/report', {
          message, source, stack: error.stack, events,
        });
      }
    };
    // Currently chrome supports this event
    const callback = event => {
      const { message, source, stack } = event.reason;
      if (retryCount >= 3) {
        window.removeEventListener('unhandledrejection', callback);
        console.log('Removed unhandledrejection callback');
        return;
      }
      if (navigator.onLine) {
        retryCount += 1;
        instance.post('/api/report', {
          message, source, stack, events,
        });
      }
    };
    window.addEventListener('unhandledrejection', callback);
  },
  recorder(store) {
    recorderStore = store;
    const time = new Date();
    events.push({
      type: 'state',
      time: time.toLocaleTimeString('en-us', timeOptions),
      timestamp: +time,
      state: deepCopy(store.state),
    });
    store.subscribe((mutation, state) => {
      const mutationCopy = deepCopy(mutation);
      // Prevent converting circular structure to json error
      if (mutationCopy.type === 'route/ROUTE_CHANGED') {
        delete mutationCopy.payload.from.matched;
        delete mutationCopy.payload.to.matched;
      }
      events.push({
        type: 'mutation',
        time: time.toLocaleTimeString('en-us', timeOptions),
        timestamp: +new Date(),
        mutation: mutationCopy,
      });
      events.push({
        type: 'state',
        time: time.toLocaleTimeString('en-us', timeOptions),
        timestamp: +new Date(),
        state: deepCopy(state),
      });
    });
    store.subscribeAction((action, _state) => {
      events.push({
        type: 'action',
        time: time.toLocaleTimeString('en-us', timeOptions),
        timestamp: +new Date(),
        action: deepCopy(action),
      });
    });
  },
  loadEvents(newEvents) {
    events = newEvents;
    stateIndex = 0;
  },
  listEvents() {
    events.forEach((e, index) => {
      console.log(index, e);
    });
  },
  loadEventIndex(index) {
    let i = 0;
    events.forEach(e => {
      if (e.type === 'state') i += 1;
    });
    stateIndex = i;
    const event = events[index];
    if (event.type === 'state') {
      this.loadState(event.state);
    } else if (event.type === 'action') {
      recorderStore.dispatch(event.action.type, event.action.payload);
    } else if (event.type === 'mutation') {
      recorderStore.commit(event.mutation.type, event.mutation.payload);
    }
  },
  listStates() {
    const stateEvents = events.filter(e => e.type === 'state');
    stateEvents.forEach((e, index) => {
      // console.groupCollapsed(`[${index}] state @ ${e.time}`);
      console.log(index, e.state);
      // console.groupEnd();
    });
  },
  loadState(state) {
    recorderStore.replaceState(deepCopy(state));
  },
  loadStateIndex(index) {
    const stateEvents = events.filter(e => e.type === 'state');
    this.loadState(stateEvents[index].state);
    stateIndex = index;
  },
  firstState() {
    stateIndex = 0;
    const stateEvents = events.filter(e => e.type === 'state');
    this.loadState(stateEvents[stateIndex].state);
  },
  lastState() {
    const stateEvents = events.filter(e => e.type === 'state');
    stateIndex = stateEvents.length - 1;
    this.loadState(stateEvents[stateIndex].state);
  },
  nextState() {
    const stateEvents = events.filter(e => e.type === 'state');
    if (!stateIndex) {
      stateIndex = stateEvents.length - 1;
    }
    if (stateIndex < stateEvents.length - 1) {
      stateIndex += 1;
      this.loadState(stateEvents[stateIndex].state);
    } else {
      console.log('At last state');
    }
  },
  prevState() {
    const stateEvents = events.filter(e => e.type === 'state');
    if (!stateIndex) {
      stateIndex = stateEvents.length - 1;
    }
    if (stateIndex > 0) {
      stateIndex -= 1;
      this.loadState(stateEvents[stateIndex].state);
    } else {
      console.log('At first state');
    }
  },
};
