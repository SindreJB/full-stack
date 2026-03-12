import { createRouter, createWebHistory } from 'vue-router';
import CalculatorView from '../views/CalculatorView.vue';
import FeedbackView from '../views/FeedbackView.vue';
import LoginView from '../views/LoginView.vue';
import authService from '../utils/authService';

const routes = [
	{
		path: '/login',
		name: 'Login',
		component: LoginView,
	},
	{
		path: '/',
		name: 'Calculator',
		component: CalculatorView,
		meta: { requiresAuth: true },
	},
	{
		path: '/feedback',
		name: 'FeedbackForm',
		component: FeedbackView,
		meta: { requiresAuth: true },
	},
];

const router = createRouter({
	history: createWebHistory(process.env.BASE_URL),
	routes,
});

router.beforeEach((to) => {
	if (to.meta.requiresAuth && !authService.isAuthenticated()) {
		return { name: 'Login' };
	}
});

export default router;
