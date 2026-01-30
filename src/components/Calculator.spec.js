import { describe, it, expect, beforeEach, vi } from 'vitest';
import { mount } from '@vue/test-utils';
import Calculator from '@/components/Calculator.vue';

describe('Calculator.vue', () => {
	let wrapper;

	beforeEach(() => {
		wrapper = mount(Calculator, {
			global: {
				stubs: {
					// Mock router for navigation
					$router: {
						push: vi.fn(),
					},
				},
				mocks: {
					$router: {
						push: vi.fn(),
					},
				},
			},
		});
	});

	describe('Initial State', () => {
		it('should render calculator with empty result', () => {
			expect(wrapper.find('.result').element.value).toBe('');
		});

		it('should have empty log', () => {
			expect(wrapper.vm.log).toEqual([]);
		});

		it('should have calculated flag set to false', () => {
			expect(wrapper.vm.calculated).toBe(false);
		});
	});

	describe('Number Input', () => {
		it('should display number when number button is clicked', async () => {
			await wrapper.find('button.number:nth-child(1)').trigger('click'); // Click 7
			expect(wrapper.vm.result).toBe('7');
		});

		it('should concatenate multiple numbers', async () => {
			const buttons = wrapper.findAll('button.number');
			await buttons[0].trigger('click'); // 7
			await buttons[1].trigger('click'); // 8
			await buttons[2].trigger('click'); // 9
			expect(wrapper.vm.result).toBe('789');
		});

		it('should handle decimal point', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleClick('.');
			await wrapper.vm.handleClick('5');
			expect(wrapper.vm.result).toBe('5.5');
		});

		it('should handle double zero button', async () => {
			await wrapper.vm.handleClick('1');
			await wrapper.vm.handleClick('00');
			expect(wrapper.vm.result).toBe('100');
		});
	});

	describe('Operator Input', () => {
		it('should add operator to expression', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			expect(wrapper.vm.result).toBe('5+');
		});

		it('should replace last operator when multiple operators are entered', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleOperatorClick('*');
			expect(wrapper.vm.result).toBe('5*');
		});

		it('should handle all operators', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			expect(wrapper.vm.result).toBe('5+');

			await wrapper.vm.handleClear();
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('-');
			expect(wrapper.vm.result).toBe('5-');

			await wrapper.vm.handleClear();
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('*');
			expect(wrapper.vm.result).toBe('5*');

			await wrapper.vm.handleClear();
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('/');
			expect(wrapper.vm.result).toBe('5/');
		});
	});

	describe('Calculations', () => {
		it('should perform addition correctly', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(8);
		});

		it('should perform subtraction correctly', async () => {
			await wrapper.vm.handleClick('10');
			await wrapper.vm.handleOperatorClick('-');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(7);
		});

		it('should perform multiplication correctly', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('*');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(15);
		});

		it('should perform division correctly', async () => {
			await wrapper.vm.handleClick('15');
			await wrapper.vm.handleOperatorClick('/');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(5);
		});

		it('should handle decimal calculations', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleClick('.');
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('2');
			await wrapper.vm.handleClick('.');
			await wrapper.vm.handleClick('5');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(8);
		});

		it('should handle complex expressions', async () => {
			await wrapper.vm.handleClick('2');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.handleOperatorClick('*');
			await wrapper.vm.handleClick('4');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(14); // 2 + 3 * 4 = 14
		});
	});

	describe('Error Handling', () => {
		it('should handle division by zero', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('/');
			await wrapper.vm.handleClick('0');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe('Error: Divide by zero');
		});

		it('should handle invalid expressions', async () => {
			wrapper.vm.result = '5++3';
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe('Error');
		});
	});

	describe('Clear Functions', () => {
		it('should clear result when C button is clicked', async () => {
			await wrapper.vm.handleClick('123');
			await wrapper.vm.handleClear();
			expect(wrapper.vm.result).toBe('');
			expect(wrapper.vm.calculated).toBe(false);
		});

		it('should clear last entry when CE button is clicked', async () => {
			await wrapper.vm.handleClick('1');
			await wrapper.vm.handleClick('2');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.handleClearEntry();
			expect(wrapper.vm.result).toBe('12');
		});

		it('should clear completely when CE removes last character', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleClearEntry();
			expect(wrapper.vm.result).toBe('');
			expect(wrapper.vm.calculated).toBe(false);
		});

		it('should handle CE on empty result', async () => {
			await wrapper.vm.handleClearEntry();
			expect(wrapper.vm.result).toBe('');
		});
	});

	describe('Calculation Log', () => {
		it('should add calculation to log', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.log).toContain('5+3 = 8');
		});

		it('should maintain multiple entries in log', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();

			await wrapper.vm.handleClick('2');
			await wrapper.vm.handleOperatorClick('*');
			await wrapper.vm.handleClick('4');
			await wrapper.vm.calculate();

			expect(wrapper.vm.log.length).toBe(2);
			expect(wrapper.vm.log[0]).toBe('5+3 = 8');
			expect(wrapper.vm.log[1]).toBe('2*4 = 8');
		});

		it('should display log in textarea', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();

			const logTextarea = wrapper.find('.log');
			expect(logTextarea.element.value).toContain('5+3 = 8');
		});
	});

	describe('Calculated Flag Behavior', () => {
		it('should set calculated flag after calculation', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.calculated).toBe(true);
		});

		it('should start new expression after calculation when number is clicked', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();
			expect(wrapper.vm.result).toBe(8);

			await wrapper.vm.handleClick('2');
			expect(wrapper.vm.result).toBe('2');
			expect(wrapper.vm.calculated).toBe(false);
		});

		it('should reset calculated flag when operator is clicked', async () => {
			await wrapper.vm.handleClick('5');
			await wrapper.vm.handleOperatorClick('+');
			await wrapper.vm.handleClick('3');
			await wrapper.vm.calculate();

			await wrapper.vm.handleOperatorClick('*');
			expect(wrapper.vm.calculated).toBe(false);
		});
	});

	describe('Navigation', () => {
		it('should navigate to feedback page when button is clicked', async () => {
			const pushSpy = wrapper.vm.$router.push;
			await wrapper.find('.page_change').trigger('click');
			expect(pushSpy).toHaveBeenCalledWith('/feedback');
		});
	});

	describe('UI Rendering', () => {
		it('should render all number buttons', () => {
			const numberButtons = wrapper.findAll('button.number');
			expect(numberButtons.length).toBeGreaterThan(0);
		});

		it('should render all operator buttons', () => {
			const operatorButtons = wrapper.findAll('button.operator');
			expect(operatorButtons.length).toBe(4); // +, -, *, /
		});

		it('should render clear buttons', () => {
			const clearButtons = wrapper.findAll('button.clear');
			expect(clearButtons.length).toBe(2); // C and CE
		});

		it('should render equal button', () => {
			const equalButton = wrapper.find('button.equal');
			expect(equalButton.exists()).toBe(true);
		});

		it('should display result in input field', async () => {
			await wrapper.vm.handleClick('123');
			const resultInput = wrapper.find('.result');
			expect(resultInput.element.value).toBe('123');
		});
	});
});
