<template>
	<div id="app">
		<h2>Calculator App</h2>
		<div class="page_change_container">
			<button class="page_change" @click="goToFeedback">Go to feedback form</button>
			<button class="page_change logout-btn" @click="logout">Log out</button>
		</div>
		<div class="calculator in Vue">			<input type="text" class="result" :value="result" readonly />
			<div class="buttons">
				<button class="number" @click="handleClick('7')">7</button>
				<button class="number" @click="handleClick('8')">8</button>
				<button class="number" @click="handleClick('9')">9</button>
				<button class="operator" @click="handleOperatorClick('/')">/</button>

				<button class="number" @click="handleClick('4')">4</button>
				<button class="number" @click="handleClick('5')">5</button>
				<button class="number" @click="handleClick('6')">6</button>
				<button class="operator" @click="handleOperatorClick('*')">*</button>

				<button class="number" @click="handleClick('1')">1</button>
				<button class="number" @click="handleClick('2')">2</button>
				<button class="number" @click="handleClick('3')">3</button>
				<button class="operator" @click="handleOperatorClick('-')">-</button>

				<button class="number" @click="handleClick('0')">0</button>
				<button class="number" @click="handleClick('.')">.</button>
				<button class="number" @click="handleClick('00')">00</button>

				<button class="operator" @click="handleOperatorClick('+')">+</button>

				<button class="clear" @click="handleClear">C</button>
				<button class="clear" @click="handleClearEntry">CE</button>
				<button class="equal" @click="calculate()">=</button>
			</div>
		</div>
		<div>
			<h3>History</h3>
			<textarea class="log" :value="log.join('\n')" readonly></textarea>
			<button v-if="hasMore" class="load-more-btn" @click="loadMore">Load more</button>
		</div>
	</div>
</template>

<script>
import axios from 'axios';
import authService from '../utils/authService';
import { useUserStore } from '../stores/userStore';
import calculationService from '../utils/calculationService';

export default {
	name: 'CalculatorApp',
	data() {
		return {
			result: '',
			calculated: false,
			log: [],
			currentPage: 0,
			hasMore: false,
		};
	},
	async mounted() {
		await this.loadHistory(0);
	},
	methods: {
		handleClick(value) {
			if (this.calculated) {
				// If calculation has been done,
				// start a new expression
				this.result = value;
				this.calculated = false; // Reset flag
			} else {
				this.result += value;
			}
		},
		handleClear() {
			this.result = '';
			this.calculated = false; // Reset flag
		},
		handleClearEntry() {
			if (this.result && this.result.length > 0) {
				this.result = this.result.slice(0, -1);
				if (this.result.length === 0) {
					this.handleClear();
				}
			} else {
				this.handleClear();
			}
		},
		handleOperatorClick(operator) {
			// If the last character is an operator,
			// replace it with the new operator
			if (/[+*/-]$/.test(this.result)) {
				this.result = this.result.slice(0, -1) + operator;
			} else {
				// Otherwise, add the new operator
				this.result += operator;
			}
			this.calculated = false; // Reset flag
		},
		async calculate() {
			if (!this.result) {
				return;
			}

			const expression = this.result;
			const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8081';

			try {
				const response = await axios.post(`${apiBaseUrl}/api/calculator/evaluate`, {
					expression,
				});
				const evaluatedResult = response.data?.result;
				if (typeof evaluatedResult !== 'number' || Number.isNaN(evaluatedResult)) {
					throw new Error('Invalid result');
				}
				this.result = evaluatedResult;
				this.calculated = true;
				await calculationService.saveCalculation(expression, evaluatedResult);
				this.log.unshift(`${expression} = ${evaluatedResult}`);
			} catch (error) {
				const serverError = error?.response?.data?.error;
				this.result = serverError ? `Error: ${serverError}` : 'Error';
				this.calculated = true;
			}
		},
		async loadHistory(page) {
			try {
				const data = await calculationService.getCalculations(page, 10);
				const entries = data.content.map((c) => `${c.expression} = ${c.result}`);
				if (page === 0) {
					this.log = entries;
				} else {
					this.log.push(...entries);
				}
				this.currentPage = data.number;
				this.hasMore = !data.last;
			} catch {
				// not authenticated yet or network error — log stays empty
			}
		},
		async loadMore() {
			await this.loadHistory(this.currentPage + 1);
		},
		goToFeedback() {
			this.$router.push('/feedback');
		},
		logout() {
			authService.logout();
			useUserStore().clearAuth();
			this.$router.push('/login');
		},
	},
};
</script>

<style scoped>
#app {
	font-family: Arial, sans-serif;
	text-align: center;
	background-color: hsl(0, 0%, 100%);
	color: black;
	height: 80vh;
	justify-content: center;
	align-items: center;
	display: grid;
}

#app * {
	box-sizing: border-box;
}

.calculator {
	width: 300px;
	height: 420px;
	border-radius: 15px;
	background-color: hsl(0, 0%, 15%);
	border: none;
	display: flex;
	flex-direction: column;
	overflow: hidden;
	font-family: Arial, Helvetica, sans-serif;
}

.result {
	width: 100%;
	padding: 30px;
	font-size: 20px;
	text-align: left;
	background-color: hsl(0, 0%, 25%);
	margin-bottom: 15px;
	border: none;
	color: white;
}

.buttons {
	display: grid;
	grid-template-columns: repeat(4, 1fr);
	grid-gap: 10px;
	border-radius: 15px;
	padding: 15px;
}

button {
	padding: 15px;
	font-size: 18px;
	cursor: pointer;
	border: none;
	outline: none;
	border: none;
	border-radius: 10px;
	font-weight: bold;
}

.number,
.operator {
	background-color: #f0f0f0;
}

.clear,
.equal {
	background-color: #ff963b;
	color: #fff;
}

button:hover {
	background-color: #ddd;
}

.equal {
	grid-column: span 2;
}

.log {
	width: 300px;
	height: 300px;
	padding: 20px;
	font-size: 1.2rem;
	text-align: left;
	vertical-align: top;
	background-color: hsl(0, 0%, 85%);
	margin-top: 15px;
	border: none;
	border-radius: 15px;
	color: black;
	overflow-y: auto;
	resize: none;
	font-family: Arial, Helvetica, sans-serif;
	white-space: pre-line;
}

.page_change_container {
	margin: 20px 0;
}

.page_change {
	padding: 10px 20px;
	background-color: #2196f3;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 14px;
}

.page_change:hover {
	background-color: #0b7dda;
}

.logout-btn {
	background-color: #e53935;
}

.logout-btn:hover {
	background-color: #c62828;
}

.load-more-btn {
	margin-top: 8px;
	padding: 8px 20px;
	background-color: #757575;
	color: white;
	border: none;
	border-radius: 4px;
	cursor: pointer;
	font-size: 13px;
}

.load-more-btn:hover {
	background-color: #616161;
}
</style>
