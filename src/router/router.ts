import * as vueRouter from 'vue-router';

const routes = [
    {
        path: '/',
        name: 'Home',
        component: () => (import('../views/Home.vue'))
    },
    {
        path: '/dashboard',
        name: 'Dashboard',
        component: () => (import('../views/Dashboard.vue'))
    },
];

const baseUrl = ''

const router = vueRouter.createRouter({
    history: vueRouter.createWebHistory(baseUrl),
    routes
});

router.beforeEach(() => {
    window.scrollTo(0, 0)
})

export default router;