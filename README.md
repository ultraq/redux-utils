
redux-utils
===========

[![Build Status](https://travis-ci.com/ultraq/redux-utils.svg?branch=master)](https://travis-ci.com/ultraq/redux-utils)
[![Coverage Status](https://coveralls.io/repos/github/ultraq/redux-utils/badge.svg?branch=master)](https://coveralls.io/github/ultraq/redux-utils?branch=master)
[![npm](https://img.shields.io/npm/v/@ultraq/redux-utils.svg?maxAge=3600)](https://www.npmjs.com/package/@ultraq/redux-utils)

A collection of wrappers/utilities for common functions in redux.


Installation
------------

```
npm install @ultraq/redux-utils
```


API
---

### backedByStorage(reducer, storage, key)

A convenience method for composing a reducer with the [`initiatedFromStorage`](#initiatedfromstoragereducer-storage-key)
and [`syncedToStorage`](#syncedtostoragereducer-storage-key) functions together.

### initialStateFromDom(selector, [slice])

Create an initial state from JSON data in a DOM element.  Used for creating an
object that is suitable for the `initialState` value of Redux's `createStore`.
Returns the JSON data converted to an object, or an empty object if no data
could be read.

 - **selector**: a CSS selector for picking out the HTML element that contains
   the JSON data to load.
 - **slice**: optional, if the JSON data only represents a slice of the entire
   state, then specify the name of the slice so that it can be set in the right
   place.

### initiatedFromStorage(reducer, storage, key)

Wraps and returns a reducer that has an initial state from the given storage
mechanism.

This initial load is also deferred until the reducer is first used, which helps
with tests using ES6 modules that would normally have, by their static nature,
caused the reducer initial state to be run before the tests are even executed.

 - **reducer**: The redux reducer to have its initial state come from a JSON
   string in the given storage mechanism.
 - **storage**: One of the browser's `sessionStorage` or `localStorage`, or any
   object that implements the `Storage` interface.
 - **key**: The key mapped to the data used to load this reducer from.  It is
   recommended that this key is combined with something that uniquely identifies
   the current context so that the same state from different uses of the page
   don't clash.

### observe(store, select, handler)

Observe the store for changes, passing the value picked out by the `select`
function to the handler.  Returns a function that can be used to unsubscribe
from store changes.

 - **store**: the redux store to observe for changes
 - **select**: a function that, given the state, returns the part of the state
   that is to be observed for changes
 - **handler**: the function that, when the value picked out by `select` changes,
   is invoked with the changed value

### observeOnce(store, select, handler)

Observe the store and automatically unsubscribe from changes after the value
picked out by the `select` function returns a non-falsey value.  This value is
then given to the handler function.

 - **store**: the redux store to observe for changes
 - **select**: a function that, given the state, returns the part of the state
   that is to be observed for changes
 - **handler**: the function that, when the value picked out by `select` changes,
   is invoked with the changed value

### syncedToStorage(reducer, storage, key)

Wraps and returns a reducer that saves the state from the original reducer to
the browser's local storage.  The storage is mapped by the given keys.

 - **reducer**: The redux reducer to have its state saved to a given storage
   mechanism whenever that state changes.
 - **storage**: One of the browser's `sessionStorage` or `localStorage`, or any
   object that implements the `Storage` interface.
 - **key**: The key to use for storing this data.    It is recommended that this
   key is combined with something that uniquely identifies the current context
   so that the same state from different uses of the page don't clash.
