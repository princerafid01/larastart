require('./bootstrap');
window.Vue = require('vue');
import { Form, HasError, AlertError } from 'vform';

window.Form = Form;
Vue.component(HasError.name, HasError)
Vue.component(AlertError.name, AlertError)

import Gate from "./Gate.js";
import VueRouter from "vue-router"
import Dashboard from "./components/Dashboard.vue"
import Profile from "./components/Profile.vue"
import Users from "./components/Users.vue"
import Developer from "./components/Developer.vue"
import moment from "moment"
import VueProgressBar from 'vue-progressbar'

Vue.prototype.$gate = new Gate(window.user);
const options = {
  color: '#bffaf3',
  failedColor: '#874b4b',
  thickness: '5px',
  transition: {
    speed: '0.4s',
    opacity: '0.6s',
    termination: 300
  },
  autoRevert: true,
  location: 'top',
  inverse: false
}

import Swal from 'sweetalert2'
window.Swal = Swal;

const toast = Swal.mixin({
  toast: true,
  position: 'top-end',
  showConfirmButton: false,
  timer: 3000
});
window.toast = toast;

Vue.use(VueProgressBar, options)


Vue.use(VueRouter)

let routes = [
    { path: '/developer' , component: Developer },
	{ path: '/dashboard' , component: Dashboard },
	{ path: '/profile' , component: Profile },
	{ path: '/users' , component: Users }
];


const router = new VueRouter({
	routes,
	mode: 'history'
});
Vue.filter('uppercase' , (text) => {
    return text.charAt(0).toUpperCase() + text.slice(1)
});
Vue.filter('mydate', (date) => {
    return moment(date).format('MMMM Do YYYY');
});


Vue.component(
    'passport-clients',
    require('./components/passport/Clients.vue')
);

Vue.component(
    'passport-authorized-clients',
    require('./components/passport/AuthorizedClients.vue')
);

Vue.component(
    'passport-personal-access-tokens',
    require('./components/passport/PersonalAccessTokens.vue')
);

Vue.component(
    'not-found',
    require('./components/404.vue')
);
const app = new Vue({
    el: '#app',
    components:{
    	
    },
    methods: {
    	
    },
    router,
});
