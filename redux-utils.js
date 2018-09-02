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

/**
 * Observe the store for changes, passing the value picked out by the `select`
 * function to the handler.
 * 
 * Adapted from https://github.com/reactjs/redux/issues/303#issuecomment-125184409
 * 
 * @param {Store} store
 * @param {Function} select
 * @param {Function} handler
 * @return {Unsubscribe}
 *   A function that lets the observer unsubscribe from store changes.
 */
export function observe(store, select, handler) {

	let currentValue;
	return store.subscribe(function() {
		let nextValue = select(store.getState());
		if (nextValue !== currentValue) {
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
