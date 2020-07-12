/* 
 * Copyright 2020, Emanuel Rabina (http://www.ultraq.net.nz/)
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
/* eslint-env jest, node */
let mockJson = null;

module.exports = {
	...jest.genMockFromModule('@ultraq/dom-utils'),

	/**
	 * Mock and return the value of future calls to the `parseJsonFromElement`
	 * function.
	 * 
	 * @param {Object} data
	 * @return {Object}
	 * @private
	 */
	__setMockJsonFromElement(data) {
		mockJson = data;
		return data;
	},

	parseJsonFromElement(selector) {
		return mockJson;
	}
};
