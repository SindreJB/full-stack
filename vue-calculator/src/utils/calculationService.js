import axios from 'axios';

const apiBaseUrl = process.env.VUE_APP_API_BASE_URL || 'http://localhost:8081';

async function saveCalculation(expression, result) {
	const response = await axios.post(`${apiBaseUrl}/api/calculations`, { expression, result });
	return response.data;
}

async function getCalculations(page = 0, size = 10) {
	const response = await axios.get(`${apiBaseUrl}/api/calculations`, {
		params: { page, size },
	});
	return response.data;
}

export default { saveCalculation, getCalculations };
