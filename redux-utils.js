/* 
 * Copyright 2018, Emanuel Rabina (http://www.ultraq.net.nz/)
 * 
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 * 
 *     http://www.apache.org/licenses/LICENSE-2.0
 * 
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

import {parseJsonFromElement} from '@ultraq/dom-utils';
import {equals}               from '@ultraq/object-utils';

/**
 * Create an initial state from JSON data in a DOM element.  Used for creating
 * an object that is suitable for the `initialState` value of Redux's
 * `createStore`.
 * 
 * @param {String} selector
 *   A CSS selector for picking out the HTML element that contains the JSON data
 *   to load.
 * @param {String} [slice]
 *   If the JSON data only represents a slice of the entire state, then specify
 *   the name of the slice so that it can be set in the right place.
 * @param {Document} [scope=document]
 *   The DOM tree to search for the initial state.  Defaults to the current
 *   document.
 * @return {Object}
 *   The JSON data converted to an object, or an empty object if no data could
 *   be read.
 */
export function initialStateFromDom(selector, slice, scope = document) {
	let data = parseJsonFromElement(selector, scope);
	return data ? slice ? {[slice]: data} : data : {};
}

/**
 * Create an initial state from JSON data in session or local storage.  Used for
 * creating an object that is suitable for the `initialState` value of Redux's
 * `createStore`.
 * 
 * @param {Storage} storage
 *   The storage mechanism to use, either `sessionStorage` or `localStorage`.
 * @param {String} key
 *   The key in storage from which to get the data from.
 * @param {String} [slice]
 *   If the JSON data only represents a slice of the entire state, then specify
 *   the name of the slice so that it can be set in the right place.
 * @return {Object}
 *   The JSON data converted to an object, or an empty object if no data could
 *   be read.
 */
export function initialStateFromStorage(storage, key, slice) {
	let item = storage.getItem(key);
	if (item) {
		let data = JSON.parse(item);
		return slice ? { [slice]: data } : data;
	}
	return {};
}

/**
 * Observe the store for changes, passing the value picked out by the `select`
 * function to the handler.
 * 
 * Adapted from https://github.com/reactjs/redux/issues/303#issuecomment-125184409
 * 
 * @param {Store} store
 * @param {Function} select
 * @param {Function} handler
 * @return {Function}
 *   A function that lets the observer unsubscribe from store changes.
 */
export function observe(store, select, handler) {
	let currentValue = select(store.getState());
	return store.subscribe(function() {
		let nextValue = select(store.getState());
		if (!equals(nextValue, currentValue)) {
			currentValue = nextValue;
			handler(currentValue);
		}
	});
}

/**
 * Observe the store and automatically unsubscribe from changes after the value
 * picked out by the `select` function returns a non-falsey value.  This value
 * is then given to the handler function.
 * 
 * @param {Store} store
 * @param {Function} select
 * @param {Function} handler
 */
export function observeOnce(store, select, handler) {
	let unsubscribe = observe(store, select, function(value) {
		if (value) {
			unsubscribe();
			handler(value);
		}
	});
}
