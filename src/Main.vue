<template>
	<div class="v-main" id="app">
		<div id="page-header">
			<div class="primary center">
				<img style="padding:10px 0px 0px 0px;max-height: 40px;max-width: 100%;" src="@/fs/images/APPShamiblancopartesuperior.svg">
			</div>
			<div class="primary" style="position: relative;display: inline-block;width: calc(100% - 0px);">
				<span style="display: inline-block;padding: 5px 8px;" v-on:click="$router.go(-1)">
					<i class="fa fa-arrow-left"></i>
				</span>
				<span class="v-title">{{title}}</span>
				<span v-on:click="toggleMenu" style="position: absolute;right: 0px;padding: 5px 8px;display: inline-block;;">
					<i class="fa fa-bars"></i>
				</span>
			</div>
		</div>
		<div id="page-content">
		
			<div class="view-list" style="padding:15px;position:relative;">	
				<div style="position: sticky;padding: 0px;top: 15px;z-index: 2;" class="v-form">
					<input style="background-color: #e8e8e8;" v-model="query" v-on:keyup.enter="showResult" 
						placeholder="¿Qué producto estas buscando?"/>
					<span style="position:absolute;top:0px;right:0px;width:auto;margin: 4px 7px;" 
						v-on:click="showResult"><i class="fa fa-search"></i></span>
				</div>
				<div v-show="resultVisible" style="padding:30px;position:relative;height: calc(100% - 60px);">
					<div style="width: calc(100% - 0px);
						position:relative;
						z-index: 10001;" class="v-form">
						<input style="background-color: #e8e8e8;" v-model="query" v-on:keyup.enter="showResult" 
							placeholder="¿Qué producto estas buscando?"/>
						<span style="position:absolute;top:0px;right:0px;width:auto;margin: 4px 7px;" 
							v-on:click="showResult"><i class="fa fa-search"></i></span>
					</div>
					<v-dataview  class="products" style="width: calc(100% - 0px);background-color:white;max-height:100%;overflow-y:auto" ref="dataview" src="/admin/commerce/api/product" 
						v-bind:autoload="false" pagination="10" 
						v-on:updated="app.bindLinks($refs.dataview.$el)" v-bind:filters="{query:query}" row-style-class="product-3 clearfix">
						<template v-slot="{row}">
							<div class="img">
								<img v-bind:src="row.image&&row.image.startsWith('http')?row.image:(baseURL+(!row.image.startsWith('img-')?('/fs/shami/product/'+row.id+'/'+row.image):('/apishami/api/archivos/imgproducto/'+row.image)))"/>
							</div>
							<div class="product-info">
								<a v-bind:href="'/shami/product/'+row.id"><h2>{{row.name}}</h2></a>
								<div>Precio: S/. {{row.price}}</div>
							</div>
						</template>
					</v-dataview>
				</div>
				<div style="width:100%;overflow-x:scroll" v-if="categories">
					<div v-bind:style="{width:categories.length*84+'px'}" style="padding: 10px 0px;text-align: center;" >
						<a v-for="item in categories" v-bind:class="{'v-ss':item.id==idcategoria}" style="padding: 5px 2px 2px 2px;float:left" 
							v-bind:href="'/shami/category/'+item.id" v-bind:key="item.id" class="category2">
							<img v-bind:src="'http://web.regionancash.gob.pe/apishami/api/archivos/imgcategoria/'+item.icono" height="70px" />
							<div style="font-size:12px;width:80px;height:40px" >
								{{item.categoria}}
							</div>
						</a>
					</div>
				</div>
				<router-view></router-view>
				<div class="clearfix center subs" style="padding:5px;">
					<div v-on:click="opp('terminos-condiciones')">Terminos y Condiciones</div>
					<div v-on:click="opp('politica-garantia-devolucion')">Politica de Garantia y Devoluciones</div>
					<div v-on:click="opp('politica-ventas-producto')">Politica de Ventas de Productos</div>
					<div v-on:click="opp('comprobantes-electronicos')">Comprobantes Electronicos</div>
				</div>
				<hr style="border-width: 1px;"/>
				<div class="clearfix center subs" style="padding:5px 60px;">
					<div v-on:click="opp('politica-entrega')" class="c-4">Politica de Entrega</div>
					<div v-on:click="opp('libro-reclamaciones')" class="c-4">Libro de Reclamaciones</div>
					<div v-on:click="opp('contactanos')" class="c-4">Contactanos</div>
				</div>
			</div>			
			<div class="clearfix" style="background-color: #f3f3f3;width: 100%;">
				<div style="float: left;padding: 20px 5px 20px 10px;width: calc(40% - 15px);display: inline;">
					<img style="width:100%" src="@/fs/images/logo reactivancash-10.png">
				</div>
				<ul style="padding: 20px 10px 20px 5px;float: right;width: calc(60% - 15px);">
					<li>Comercio Electrónico</li>
					<li>Mercados y Ferias Agropecuarias Itinerantes</li>
					<li>Programa de Microfinanciamiento</li>
					<li>ProCompite Áncash</li>
					<li>Proyectos de Servicios Ambientales</li>
					<li>Pesca, Acuicultura y Mypes</li>
					<li>Reactivación de la Pequeña Minería y Minería Artesanal</li>
					<li>Nueva Visión del Turismo frente al Covid-19</li>
					<li>Reactivación de Infraestructura</li>
					<li>Centro Regional de Desarrollo Humano</li>
				</ul>
			</div>
			<div class="primary center">
				<img style="max-height: 60px;max-width: 100%;" src="@/fs/images/franja azul inferior-11.png">
			</div>
		
		</div>
		<AppMenu ref="menu"></AppMenu>
	</div>
</template>
<script>
import AppMenu from './Menu.vue'
var app=window.app;
export default {
	watch: {
		$route() {
			window._.resize();
			var me=this;
			me.resultVisible=false;
			me.mask=window._.unmask(me.mask);
		}
	},
	mounted(){
		app.bindLinks(this.$el,this.hide);
	},
	updated(){
		app.bindLinks(this.$el,this.hide);
		window._.resize();
	},
	created(){
		var me=this;
		me.app=window.app;
		me.app.cccc=function(){
			me.resultVisible=false;
			me.mask=window._.unmask(me.mask);
		};
	},
	components:{AppMenu},
	computed:{
		baseURL(){return window.axios.defaults.baseURL;},
		showMenu(){return app.showMenu;},
		categories(){return app.categories;},
		cart(){return window.app.cart;},
		title(){return this.app.title;},
		idcategoria(){return this.app.idcategoria;}
	},
	methods:{
		toggleMenu(){
			this.$refs.menu.toggle();
		},
		showResult(){
			var me=this;
			if(!me.mask){
				me.mask=window._.mask(me.$refs.dataview.$el.parentNode);
				me.mask.children[0].onclick=me.$refs.dataview.$el.parentNode.onclick=function(e){
					if (e.target !== this)return;
					me.resultVisible=false;
					me.mask=window._.unmask(me.mask);
				}
			}
			me.resultVisible=true;
			me.$refs.dataview.load(true);
		},
		hide(){
			var me=this;
			me.resultVisible=false;
			window._.unmask(me.mask);
			if(me.$refs.menu)me.$refs.menu.hide();
		},
		opp(path){
			window.app.$router.push('/shami/'+path);
		}
	},
	data:function(){return {app:null,data:[],mask:null,mode:0,query:null,resultVisible:null}}
};
</script>
<style scope>
	a{
		display:inline-block;
	}
	.controls a:not(:last-child){
		display:inline-block;
		margin-right:10px;
	}
	.contact svg{
		margin-right: 10px;
		color: orange;
		font-size: 25px;
	}
	.v-ss{
		background-color: #ffecbd;
		border-radius: 35px 35px 0 0;
		float: left;
	}
	.product-3{
		padding:10px;
	}
	.subs > div.c-4{
		width:33.33%;
	}
	.subs > div {
		float: left;
		display: inline-block;
		width: calc(25%);
		font-size: 10px;
		text-align:center;
		padding: 0px 5px;
	}
	.c-4{
		width:calc(33.33%);
	}
	.subs > div:not(:last-child){
		border: 1px solid gray;
		border-width: 0px 1px 0px 0px;
	}
	.v-cart{
		border-radius: 50%;
		background-color: white;
		position: fixed;
		border: 1px solid gray;
		right: 15px;
		bottom: 15px;
		padding: 14px;
		display: inline-block;
	}
	.v-cart svg{
		margin-right: 0px;
	}
</style>