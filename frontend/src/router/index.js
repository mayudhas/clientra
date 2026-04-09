import {createRouter, createWebHistory} from "vue-router"
import Body from '../components/body';
import Default from '../pages/dashboard/defaultPage.vue';

const routes =[
    {
        path: '/',
        component: Body,
    
        children: [
          {
            path: '',
            name: 'defaultRoot',
            component: Default,
          },
    
        ]
      },
]
const router=createRouter({
    history: createWebHistory(),
    routes
})
export default router