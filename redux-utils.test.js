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
import {observe, observeOnce} from './redux-utils';

import {navigate} from '@ultraq/object-utils';
import {createStore} from 'redux';

/**
 * Tests for the redux utilities.
 */
describe('redux-utils', () => {

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
