<template>
	<ion-page>
		<AppMenu></AppMenu>
		<ion-router-outlet id="main" style="display:none"></ion-router-outlet>
		<ion-header>
			<div class="primary center" v-bind:class="{'v-red':!app.networkStatus.connected}" style="padding-top: 3px;padding-bottom: 7px;z-index:20;border-bottom: 1px solid #a9acb1;">
				<a v-show="app.networkStatus.connected" 
					style="position: absolute;right: 0px;padding: 10px;
    display: inline-block;font-size: 20px;" 
				href="/search">
					<i class="fa fa-search" v-bind:class="icono"></i>
				</a>
				<span v-on:click="$ionic.menuController.open('menuprincipal')" style="position: absolute;left: 0px;padding: 5px 13px;display: inline-block; margin-top: 8px;font-size: 18px;">
					<i class="fa fa-bars"></i>
				</span>
				<!--span v-show="!app.networkStatus.connected" href="/shami/notification" style="position: absolute;left: 50px;padding: 5px 13px;display: inline-block; margin-top: 8px;font-size: 18px;">
					<i class="fa fa-exclamation-triangle"></i>
				</span-->
				<!--a href="/shami/notification" style="position: absolute;left: 50px;padding: 5px 13px;display: inline-block; margin-top: 8px;font-size: 18px;">
					<i class="fa fa-bell"></i>
					<span v-if="app.notification.length" style="color: white;
    border-radius: 50%;
    background-color: red;
    position: absolute;
    top: -2px;
    font-size: 10px;
    text-align: center;
    padding-top: 2px;
    width: 20px;
    height: 18px;
    right: 14px;">
						<template v-if="app.notification.length<100">{{app.notification.length}}</template>
						<template v-if="app.notification.length>99">+99</template>
					</span>
				</a-->
				
				<div style="height:80px;padding:10px 0px 0px 0px;max-height: 42px;max-width: 100%;" src="@/fs/images/logo.svg"></div>
			</div>	
		</ion-header>		
		<router-view></router-view>
		<!--ion-footer style="border-top: 1px solid #d2d2d2;">
			<ion-toolbar class="toolbar">
				<a href="/shami"><i class="fa fa-home"></i>Inicio</a>
				<a href="/shami/cart" style="position:relative"><i class="fa fa-shopping-cart"></i>
					<span v-if="cart.products.length" style="color: white; border-radius: 50%; background-color: red; position: absolute; top: -5px;font-size:14px; ;text-align:center;padding-top:2px;width:28px;height:23px; right: 10px;">
						<template v-if="cart.total<100">{{cart.total}}</template>
						<template v-if="cart.total>99">+99</template>
					</span>
					Carrito
				</a>
				<a href="/shami/benefits"><i class="fa fa-star"></i>Beneficios</a>
				<a href="/shami/map" ><i class="fa fa-map-marker-alt"></i>Ubicación</a>
			</ion-toolbar>
		</ion-footer-->
	</ion-page>
</template>
<script>
import AppMenu from './Menu.vue';
var Vue=window.Vue;
export default window.ui({
	components:{AppMenu},
	watch: {
		$route() {
			console.log("ENTRO A ROUTE")
			Vue.resize();
			var me=this;
			me.resultVisible=false;
			me.mask=window._.unmask(me.mask);
		}
	},
	mounted(){
		var app=this.app;
		app.bindLinks(this.$el,this.hide);
		setTimeout(Vue.resize, 600);
	},
	updated(){
		this.app.bindLinks(this.$el,this.hide);
		this.app.bindLinks(this.$el);
		Vue.resize();
		//this.$refs.dataview.load(true); 
		//this.categoria = this.app.idcategoria;
	},
	methods:{
		find(ev){
			console.log(ev)
			var valor = ev.target.value;
			this.query = valor;
			console.log(valor);
			this.$refs.dataview.load(true);			
		},
	},
	computed:{
		cart(){return this.app.cart;},
		title(){return this.app.title;},
		icono(){return this.app.icono;},
	},
	data(){return {data:[],mode:0,query:null,mask:null,path:process.env.BASE_URL}},
});
</script>
<style scoped>
	#main{
		display: none;
	}
</style>
<style>
	.toolbar{
		font-size: 12px;
	}
	.fade-enter-active, .fade-leave-active {
		transition: opacity .5s;
	}
	.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
		opacity: 0;
	}
	.v-input-field svg{
		margin: 5px;
		opacity:.5;
	}
	.v-form input,.v-form select,.v-form textarea{
		border-radius: 8px !important;
	}
	.v-input-field input{
		width: calc(100% - 31px) !important;
		border-radius: 8px !important;
		padding-left: 26px !important;
	}
	.v-tab-content > span{
		text-align:justify;
		padding:5px 0px;
	}
	.v-accordion > div:not(:last-child) > .v-tab-content{
		padding-bottom:20px;
	}
	.v-accordion > div:not(:last-child){
		border-bottom:1px solid gray;
	}
	.v-accordion > * > .expanded{
		font-weight: bolder;
	}
	.v-cart{
		border-radius: 50%;
		background-color: #0f62ac;
		position: fixed;
		border: #0f62ac;
		right: 15px;
		bottom: 15px;
		padding: 14px;
		display: inline-block;
		box-shadow: 1px 2px 2px #535353a3; /*agregando sombra*/
	}
	.v-cart svg{
		margin-right: 0px;
	}
	a{
		display:inline-block;
	}
	.controls a:not(:last-child){
		display:inline-block;
		margin-right:0px;
	}
	.store .img{
		min-height:120px;
		width: 50%;
	}
	.store{
		position:relative;
		width: calc(100% - 0px);
	}
	.v-dataview div.store-info{
		width: calc(50% - 10px);
		margin-left: 10px;
	}
	.store-info .controls{
		position:absolute;
		top:0px;
		right:-10px;
	}
	.sc-ion-input-md-h {
		--padding-top: 5px;
		--padding-right: 0px;
		--padding-left: 0px;
		--padding-end: 0;
		--padding-bottom: 5px;
		--padding-start: 8px;
		font-size: inherit;
	}
	.searchionic{
		--icon-color: #f39200;
		--clear-button-color: #f39200;
		--cancel-button-color: #f39200;
		padding-right: 5px;
		padding-left: 5px;
		padding-top: 0px;
		padding-bottom: 0px;
		margin-top: -10px;
	}
	.searchbar-input-container.sc-ion-searchbar-ios {
		height: 36px;
		contain: strict;
		border: 1px solid rgb(187, 187, 187);
		border-radius: 10px;
	}
	ion-header svg{
		color:white;
	}
	.v-red{
		background-color:#ff9d9d !important;
		
	}
	.v-red svg{
		color:black;
	}
</style>