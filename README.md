
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

### initialStateFromStorage(storage, key, [slice])

Create an initial state from JSON data in session or local storage.  Used for
creating an object that is suitable for the `initialState` value of Redux's
`createStore`.  Returns the JSON data converted to an object, or an empty object
if no data could be read.

 - **storage**: the storage mechanism to use, either `sessionStorage` or
   `localStorage`.
 - **key**: the key in storage from which to get the data from.
 - **slice**: optional, if the JSON data only represents a slice of the entire
   state, then specify the name of the slice so that it can be set in the right
    place.

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
