import { createRouter, createWebHistory } from 'vue-router';
import Calculator from '../components/Calculator.vue';
import FeedbackForm from '../components/Feedback.vue';

const routes = [
	{
		path: '/',
		name: 'Calculator',
		component: Calculator,
	},
	{
		path: '/feedback',
		name: 'FeedbackForm',
		component: FeedbackForm,
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

export default router;
