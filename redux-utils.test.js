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

/* eslint-env jest */
import {
	initialStateFromDom,
	initialStateFromStorage,
	observe,
	observeOnce
} from './redux-utils.js';

import {navigate}    from '@ultraq/object-utils';
import {JSDOM}       from 'jsdom';
import {createStore} from 'redux';

/**
 * Tests for the redux utilities.
 */
describe('redux-utils', function() {

	// A store with a reducer that always returns the action's state
	let store;
	beforeEach(function() {
		store = createStore((state = {}, action) => {
			return action.newState ? {
				...state,
				...action.newState
			} : state;
		});
	});

	describe('#initialStateFromDom', function() {

		test('JSON data loaded', function() {
			let testData = {
				message: 'Hello!'
			};
			let doc = new JSDOM(`
				<!DOCTYPE html>
				<div id="test-data">
					${JSON.stringify(testData)}
				</div>
			`).window.document;
			let result = initialStateFromDom('#test-data', null, doc);
			expect(result).toEqual(testData);
		});

		test('JSON data loaded into slice', function() {
			let testData = {
				message: 'Hello!'
			};
			let doc = new JSDOM(`
				<!DOCTYPE html>
				<div id="test-data">
					${JSON.stringify(testData)}
				</div>
			`).window.document;
			let result = initialStateFromDom('#test-data', 'slice', doc);
			expect(result).toEqual(expect.objectContaining({
				slice: testData
			}));
		});

		test('Empty object returned when element not present', function() {
			let result = initialStateFromDom('#test-data');
			expect(result).toEqual({});
		});

		test('Empty object returned when element contains no content', function() {
			let doc = new JSDOM(`
				<!DOCTYPE html>
				<div id="test-data">
					${JSON.stringify('')}
				</div>
			`).window.document;
			let result = initialStateFromDom('#test-data', null, doc);
			expect(result).toEqual({});
		});
	});

	describe('#initialStateFromStorage', function() {
		const key = 'test';

		afterEach(function() {
			localStorage.clear();
		});

		test('JSON data loaded', function() {
			let testData = {
				message: 'Hello!'
			};
			localStorage.setItem(key, JSON.stringify(testData));
			let result = initialStateFromStorage(localStorage, key);
			expect(result).toEqual(testData);
		});

		test('JSON data loaded into slice', function() {
			let testData = {
				message: 'Hello!'
			};
			localStorage.setItem(key, JSON.stringify(testData));
			let result = initialStateFromStorage(localStorage, key, 'slice');
			expect(result).toEqual({
				slice: testData
			});
		});

		test('Empty object returned when item not present', function() {
			let result = initialStateFromStorage(localStorage, key);
			expect(result).toEqual({});
		});
	});

	describe('#observe', function() {

		test('All changes are passed along to the handler', function() {
			let handler = jest.fn();
			observe(store, state => state.value, handler);

			const firstValue = 'Hi!';
			store.dispatch({
				type: 'update',
				newState: {
					value: firstValue
				}
			});
			expect(handler).toHaveBeenCalledWith(firstValue);

			const secondValue = 'Hello!';
			store.dispatch({
				type: 'update',
				newState: {
					value: secondValue
				}
			});
			expect(handler).toHaveBeenCalledWith(secondValue);
		});

		test('Changes that don\'t modify the selected state don\'t trigger the handler', function() {
			let handler = jest.fn();
			observe(store, state => state.value, handler);

			const sameValue = 'Hi!';
			store.dispatch({
				type: 'update',
				newState: {
					value: sameValue
				}
			});
			expect(handler).toHaveBeenCalledWith(sameValue);
			handler.mockClear();

			store.dispatch({
				type: 'update',
				newState: {
					value: sameValue
				}
			});
			expect(handler).not.toHaveBeenCalled();
		});
	});

	describe('#observeOnce', function() {

		test('Handler is given the selected value once non-falsey', function() {
			let handler = jest.fn();
			let greeting = 'Hello!';

			observeOnce(store, state => state.value, handler);

			store.dispatch({
				type: 'update',
				newState: {
					value: null
				}
			});
			expect(handler).toHaveBeenCalledTimes(0);

			store.dispatch({
				type: 'update',
				newState: {
					value: greeting
				}
			});
			expect(handler).toHaveBeenCalledTimes(1);
			expect(handler).toHaveBeenCalledWith(greeting);
		});

		test('Handler only ever called once', function() {
			let handler = jest.fn();
			let newStateAction = {
				type: 'update',
				newState: {
					some: {
						value: 'Hello!'
					}
				}
			};

			observeOnce(store, state => navigate(state, 'some.value'), handler);
			store.dispatch(newStateAction);
			expect(handler).toHaveBeenCalledTimes(1);
			store.dispatch(newStateAction);
			expect(handler).toHaveBeenCalledTimes(1);
		});
	});
});
