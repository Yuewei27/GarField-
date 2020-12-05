export const routes = [
    {
        path: '/login',
        name: 'Login',
        component: () => import('../views/Login.vue')
    },
    {
        path: '/retrievePassword',
        name: 'RetrievePassword',
        component: () => import('../views/RetrievePassword.vue')
    },
    {
        path: '/main',
        name: 'Main',
        component: () => import('../views/Main.vue'),
        children: [{
                path: 'home',
                name: 'Home',
                component: () => import('../views/Home.vue')

            },
            {
                path: 'menu',
                name: 'Menu',
                component: () => import('../views/Menu.vue')
            },
            {
                path: 'shopbag',
                name: 'Shopbag',
                component: () => import('../views/Shopbag.vue')
            },
            {
                path: 'myself',
                name: 'Myself',
                component: () => import('../views/Myself.vue')
            }
        ]
    },
    {
        path: '/detail/:pid',
        name: 'Detail',
        component: () => import('../views/Detail.vue')
    },
    {
        path: '/address',
        name: 'Address',
        component: () => import('../views/Address.vue')
    },
    {
        path: '/addRessList',
        name: 'AddRessList',
        component: () => import('../components/AddRessList.vue')
    },
    {
        path: '/newAddress',
        name: 'NewAddress',
        component: () => import('../views/NewAddress.vue')
    },
    {
        path: '/menuDetails',
        name: 'MenuDetails',
        component: () => import('../views/MenuDetails.vue')
    },
    {
        path: '/payment',
        name: 'Payment',
        component: () => import('../views/Payment.vue')
    },
    {
        path: '/order',
        name: 'Order',
        component: () => import('../views/Order.vue')
    },
    {
        path: '/account',
        name: 'Account',
        component: () => import('../views/Account.vue')
    },
    {
        path: '/collect',
        name: 'Collect',
        component: () => import('../views/Collect.vue')
    },
    {
        path: '/secure',
        name: 'Secure',
        component: () => import('../views/Secure.vue')
    },

    {
        path: '*',
        redirect: {
            name: 'Home',
        }

    }
]