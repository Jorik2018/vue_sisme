import Vue from 'vue'
import Router from 'vue-router'
import './cdn/vue-ui.js'
import IsobitUI from 'isobit-ui'
import App from './App.vue'
import Ionic from '@ionic/vue';
import '@ionic/core/css/ionic.bundle.css';
Vue.config.productionTip = false;
Vue.use(Router);
Vue.use(IsobitUI);
Vue.use(Ionic);
Vue.config.ignoredElements = [/^ion-/];   // add this line
Vue.config.productionTip = false;

const  router  =  new  Router({
	mode: 'history',
	routes: [
		{
			path:'/admin',
			component:  r => require.ensure([], () => r(require('./Admin.vue')), 'big-pages'),
			children:[
				{
					path:  '',
					component:  r => require.ensure([], () => r(require('./Blank.vue')), 'big-pages')
				},
				{
					path:  'setting',
					component:  r => require.ensure([], () => r(require('./admin/Setting.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/covid',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/covid/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/covid/vaccine',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/covid/vaccine/Create.vue')), 'big-pages')
				},
				{
					path:  'profile',
					component:  r => require.ensure([], () => r(require('./admin/Profile.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/pregnant',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/pregnant/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/pregnant/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/View.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/pregnant/:id/:action/visit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/visit/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/pregnant/visit/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/visit/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/pregnant/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/pregnant/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/anemia',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/anemia/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/anemia/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/anemia/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/anemia/:id',alias:  'desarrollo-social/anemia/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/anemia/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sid',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sid/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sid/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sid/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sid/:id',alias:  'desarrollo-social/sid/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sid/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/tracing',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/tracing/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/tracing/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/tracing/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/tracing/:id',alias:  'desarrollo-social/tracing/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/tracing/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/settings',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/Variables.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/census',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/census/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/census/:id',alias:  'desarrollo-social/census/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/census/:id/:action',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/census/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/disabled',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/disabled/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/disabled/:id',alias:  'desarrollo-social/disabled/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/disabled/:id/:action',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/disabled/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/List.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/create',
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/:id',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/View.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/:id/:action/people',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/people/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/people/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/people/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/:id/:action/agreement',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/agreement/Create.vue')), 'big-pages')
				},
				{
					path:  'desarrollo-social/sivico/agreement/:id/edit',props: true,
					component:  r => require.ensure([], () => r(require('./admin/desarrollo-social/sivico/agreement/Create.vue')), 'big-pages')
				}
			]
		},
		{
			path:'/login',
			component:  r => require.ensure([], () => r(require('./Login.vue')), 'big-pages')
		},
		{
			path:'/password',
			component:  r => require.ensure([], () => r(require('./Password.vue')), 'big-pages')
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
			window.$app.session=null;
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
	created(){window.$app=this;}
}).$mount('#app')
