import Vue from 'vue'
import Router from 'vue-router'
import './cdn/vue-ui.js'
import IsobitUI from 'isobit-ui'
import App from './App.vue'
import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';
import { createPinia, PiniaVuePlugin } from 'pinia'
Vue.use(PiniaVuePlugin)
const pinia = createPinia()
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(IsobitUI);
Vue.use(Ionic);
Vue.config.ignoredElements = [/^ion-/,/^v-filter/];   // add this line
Vue.config.productionTip = false;
const publicPath=process.env.VUE_APP_PUBLIC_PATH||'/';

const  router  =  new  Router({
	base:publicPath,
	mode: 'history',
	routes: [
		{
			path:'/admin',
			component:  r => require.ensure([], () => r(require('./Admin.vue')), 'admin'),
			children:[
				{
					path:  '',
					component:  r => require.ensure([], () => r(require('./Blank.vue')), 'admin')
				},
				{
					path:  'setting',
					component:  r => require.ensure([], () => r(require('./admin/Setting.vue')), 'admin')
				},
				{
					path:  'desarrollo-social/covid',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/covid/Create.vue')), 'covid')
				},
				{
					path:  'desarrollo-social/covid/vaccine',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/covid/vaccine/Create.vue')), 'covid')
				},
				{
					path:  'profile',
					component:  r => require.ensure([], () => r(require('./admin/Profile.vue')), 'admin')
				},
				{
					path:  'desarrollo-social/emed',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/List.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/View.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id/:action/resource',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/resource/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/damage-ipress/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/damage_ipress/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/damage-salud/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/damage_salud/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/action/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/action/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id/:action/action',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/action/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id/:action/source',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/source/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id/:action/damage-salud',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/damage_salud/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/emed/:id/:action/damage-ipress',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/emed/damage_ipress/Create.vue')), 'emed')
				},
				{
					path:  'desarrollo-social/pregnant',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/List.vue')), 'pregnant')
				},
				{
					path:  'desarrollo-social/pregnant/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/Create.vue')), 'pregnant')
				},
				{
					path:  'desarrollo-social/pregnant/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/View.vue')), 'pregnant')
				},
				{
					path:  'desarrollo-social/pregnant/:id/:action/visit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/visit/Create.vue')), 'pregnant')
				},
				{
					path:  'desarrollo-social/pregnant/visit/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/visit/Create.vue')), 'pregnant')
				},
				{
					path:  'desarrollo-social/pregnant/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/Create.vue')), 'pregnant')
				},
				{
					path:  'desarrollo-social/anemia',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/anemia/List.vue')), 'anemia')
				},
				{
					path:  'desarrollo-social/anemia/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/anemia/Create.vue')), 'anemia')
				},
				{
					path:  'desarrollo-social/anemia/:id',alias:  'desarrollo-social/anemia/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/anemia/Create.vue')), 'anemia')
				},
				{
					path:  'desarrollo-social/sid',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sid/List.vue')), 'sid')
				},
				{
					path:  'desarrollo-social/sid/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sid/Create.vue')), 'sid')
				},
				{
					path:  'desarrollo-social/sid/:id',alias:  'desarrollo-social/sid/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sid/Create.vue')), 'sid')
				},
				{
					path:  'desarrollo-social/tracing',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/tracing/List.vue')), 'tracing')
				},
				{
					path:  'desarrollo-social/tracing/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/tracing/Create.vue')), 'tracing')
				},
				{
					path:  'desarrollo-social/tracing/:id',alias:  'desarrollo-social/tracing/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/tracing/Create.vue')), 'tracing')
				},
				{
					path:  'desarrollo-social/settings',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/Variables.vue')), 'admin')
				},
				{
					path:  'desarrollo-social/census',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/List.vue')), 'census')
				},
				{
					path:  'desarrollo-social/census/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/Create.vue')), 'census')
				},
				{
					path:  'desarrollo-social/census/:id',alias:  'desarrollo-social/census/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/Create.vue')), 'census')
				},
				{
					path:  'desarrollo-social/census/:id/:action',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/Create.vue')), 'census')
				},
				{
					path:  'desarrollo-social/disabled',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/List.vue')), 'disabled')
				},
				{
					path:  'desarrollo-social/disabled/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/Create.vue')), 'disabled')
				},
				{
					path:  'desarrollo-social/disabled/:id',alias:  'desarrollo-social/disabled/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/Create.vue')), 'disabled')
				},
				{
					path:  'desarrollo-social/disabled/:id/:action',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/Create.vue')), 'disabled')
				},
				{
					path:  'desarrollo-social/sivico',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/List.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/Create.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/View.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/Create.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/:id/:action/people',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/people/Create.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/people/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/people/Create.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/:id/:action/agreement',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/agreement/Create.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/sivico/agreement/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/agreement/Create.vue')), 'sivico')
				},
				{
					path:  'desarrollo-social/cancer',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/cancer/List.vue')), 'cancer')
				},
				{
					path:  'desarrollo-social/cancer/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/cancer/Create.vue')), 'cancer')
				},
				{
					path:  'desarrollo-social/cancer/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/cancer/Create.vue')), 'cancer')
				},
				{
					path:  'desarrollo-social/cancer/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/cancer/Create.vue')), 'cancer')
				},
			]
		},
		{
			path:'/login',
			component:  r => require.ensure([], () => r(require('./Login.vue')), 'admin')
		},
		{
			path:'/password',
			component:  r => require.ensure([], () => r(require('./Password.vue')), 'admin')
		},{
			path:'/search',props: true,
			component:  r => require.ensure([], () => r(require('./Search.vue')), 'search'),
		}
	]
});

router.beforeEach((to, from, next) => {
	var session = localStorage.getItem('session');
	//console.log(session);
	if(to.path=='/logout'){
		if(session){
			window.axios.config={};
			localStorage.removeItem('session');
		}
		next('/');
		return;
	}
	if(session)session=JSON.parse(session);
	if (to.path == '/login' && session) {
		next('/admin');
	}else if (to.path !== '/login' && !session) {
		if (to.path == '/register'||to.path == '/password') {
			next();
		}else {
			next('/login');
	}
	}else if (to.path == '/') {
		next('/admin');
	}else {
		next();
	}
});
new Vue({
	router,
	render: h => h(App),
	created(){window.$app=this;},
	pinia
}).$mount('#app')
