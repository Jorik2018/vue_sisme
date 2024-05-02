<template>
	<ion-page>
		<ion-router-outlet id="main" style="display:none"></ion-router-outlet>
		<ion-header>
			<div class="primary center v-form" style="padding-top: 3px;padding-bottom: 7px;z-index:20;border-bottom: 1px solid #a9acb1;    padding: 8px !important;">
				<span style="margin-right:10px;left: 0px;display: inline-block; margin-top: 10px;font-size: 15px;width:30px;" @click="$router.back();">
					<i class="fa fa-arrow-left" style="color:white"></i>
				</span>
				<input v-model="filters.query" placeholder="Buscar" v-on:keyup="keyup" style="text-align: left;
    display: inline-block;
    width: calc(100% - 40px);">
			</div>	
		</ion-header>
		<div ref="content" style="overflow-y:auto;height: -webkit-fill-available;">	
			
			<v-dataview ref="dataview" v-bind:autoload="false" class="aaa" 
			src="/api/desarrollo-social/sivico/search" pagination="10" :updated="app.bindLinks($el)" 
				v-bind:filters="filters" >
				<template v-slot="{item}" >
				<a class="people" style="display:block;" v-bind:href="'/admin/desarrollo-social/sivico/'+item.id" 
					v-on:click="$refs.content.scrollToTop(1000);">
					<div>
						<div v-if="item.fecha">FECHA={{item.fecha}}</div>
						<div v-if="item.encuestador">ENCUESTADOR={{item.encuestador}}</div>
						<div v-if="item.informante">INFORMANTE={{item.informante}}</div>
						<div v-if="item.distrito">DISTRITO={{item.distrito}}</div>
						<div>DIRECCION={{item.address}}</div>
						<div v-if="item.phone">TELEFONO={{item.phone}}</div>
						<div>INTEGRANTE={{item.code}}: {{item.fullName}}</div>
					</div>
				</a>
				</template>
			</v-dataview>
		</div>
	</ion-page>
</template>
<script>

export default window.ui({
	watch: {
		$route() {
			
			var me=this;
			me.resultVisible=false;
			me.mask=window._.unmask(me.mask);
			window.Vue.resize();
		}
	},
	mounted(){
		this.app.bindLinks(this.$el,this.hide);
	},
	updated(){
		var me=this,app=me.app;
		app.bindLinks(me.$el);
		window.Vue.resize();
	},
	methods:{
		keyup(){
			var me=this,ti=me.calendarTimer;
			if(ti)clearTimeout(ti);
			me.calendarTimer = setTimeout(function() {
				me.$refs.dataview.load(true);
				me.calendarTimer=null;
			},1000);
		},
		find(ev){
			var valor = ev.target.value;
			this.query = valor;
			console.log(valor);
			this.$refs.dataview.load(true);			
		},
	},
	data(){return {data:[],calendarTimer:null,mode:0,query:null,mask:null,path:process.env.BASE_URL}},
});
</script>
<style>
.people{
display:inline-block;
padding:20px;
border:1px solid gray;
}
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
		/* width: calc(100% - 60px); */
		/* background-color: rgb(232, 232, 232); */
		/* padding: 5px 30px; */
		border-radius: 10px;
	}
	.dataviewres{      
		margin-left: 10px;
		margin-right: 10px;
	}
	.aaa{
		padding:10px;
	}
	.aaa > .product{
		padding:0px !important;
		position:relative;
	}
</style>