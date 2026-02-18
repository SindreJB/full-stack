<template>
	<div id="app">
		<h2>Calculator App</h2>
		<div class="page_change_container">
			<button class="page_change" @click="goToFeedback">Go to feedback form</button>
		</div>
		<div class="calculator in Vue">
			<input type="text" class="result" :value="result" readonly />
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
			<h3>Log</h3>
			<textarea class="log" :value="log.join('\n')" readonly></textarea>
		</div>
	</div>
</template>

<script>
import axios from 'axios';

export default {
	name: 'CalculatorApp',
	data() {
		return {
			result: '',
			calculated: false,
			log: [],
			// Flag to track if calculation has been done
		};
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
				this.log.push(`${expression} = ${evaluatedResult}`);
				this.result = evaluatedResult;
				this.calculated = true;
			} catch (error) {
				const serverError = error?.response?.data?.error;
				this.result = serverError ? `Error: ${serverError}` : 'Error';
				this.calculated = true;
			}
		},
		goToFeedback() {
			this.$router.push('/feedback');
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
</style>
