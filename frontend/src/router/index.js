import {createRouter, createWebHistory} from "vue-router"
import Body from '../components/body';
import Default from '../pages/dashboard/defaultPage.vue';
import store from '../store';

const routes =[
    {
        path: '/auth/login',
        name: 'login',
        component: () => import('../pages/authentication/login.vue')
    },
    {
        path: '/',
        component: Body,
        meta: { requiresAuth: true },
        children: [
          {
            path: '',
            name: 'defaultRoot',
            component: Default,
          },
          {
            path: 'clients',
            name: 'clients',
            component: () => import('../pages/clients/index.vue'),
          },
        ]
      },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

router.beforeEach((to, from, next) => {
    // Check local storage / vuex auth state
    const token = localStorage.getItem('token');
    const hasToken = !!token && token !== 'undefined' && token !== 'null';
    const loggedIn = store.state.auth.status.loggedIn || hasToken;
    
    // Block visitors from restricted paths
    if (to.matched.some(record => record.meta.requiresAuth)) {
        if (!loggedIn) {
            next({ name: 'login' });
        } else {
            next();
        }
    } else {
        // Stop logged in users from hitting auth screens
        if (to.path.startsWith('/auth') && loggedIn) {
            next({ path: '/' });
        } else {
            next();
        }
    }
});

export default router