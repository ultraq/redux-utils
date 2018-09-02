
redux-utils
===========

[![Build Status](https://travis-ci.org/ultraq/redux-utils.svg?branch=master)](https://travis-ci.org/ultraq/redux-utils)
[![Coverage Status](https://coveralls.io/repos/github/ultraq/redux-utils/badge.svg?branch=master)](https://coveralls.io/github/ultraq/redux-utils?branch=master)
[![npm](https://img.shields.io/npm/v/@ultraq/redux-utils.svg?maxAge=3600)](https://www.npmjs.com/package/@ultraq/redux-utils)
[![License](https://img.shields.io/github/license/ultraq/redux-utils.svg?maxAge=2592000)](https://github.com/ultraq/redux-utils/blob/master/LICENSE.txt)

A collection of wrappers/utilities for common functions in redux.

Installation
------------

Via npm:

```
npm install @ultraq/redux-utils
```


API
---

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
