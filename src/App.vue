<template>
	<router-view></router-view>
</template>
<script>
	import './cdn/isobit.css'
	import '@fortawesome/fontawesome-free/css/all.css'
	import '@fortawesome/fontawesome-free/js/all.js'
	import { Network } from '@capacitor/network';
	import axios from 'axios'
	var session = localStorage.getItem('session');
	if(session){
		try{
			session=JSON.parse(session);
			axios.defaults.headers.common = {'Authorization': `Bearer `+(session.token?session.token:session.uid)};
		}catch(e){
			localStorage.removeItem('session');
			session={};
		}
	}
	if(!session)session={};
	if(!session.perms)session.perms={};
	axios.defaults.baseURL =process.env.VUE_APP_BASE_URL;
	export default window.ui({
		watch:{
			connected(v){
				window._.networkStatus.connected=v;
				this.networkStatus.connected=v;
			}
		},
		data(){
			return {
				connected:true,
				showMenu:false,
				showUser:false,
				overlay:null,
				cartItem:[],
				networkStatus:{connected:null},
				lifeStage: [
					{id: 1, name: 'NIÑO', min: 0, max: 11},
					{id: 2, name: 'ADOLESCENTE', min: 12, max: 17},
					{id: 3, name: 'JOVEN', min: 18, max: 29},
					{id: 4, name: 'ADULTO', min: 30, max: 59},
					{id: 5, name: 'ADULTO MAYOR', min: 60},
				],
				healthInsurance: [
					'SIS',
					'ESSALUD/FFAA/PNP',
					'PRIVADO',
					'SIN SEGURO'
				],
			}
		},
		methods:{
			
			updateStatus(e){
				console.log('app.updateStatus '+e);
			},
			toggleMenu(){
				this.$refs.menu.toggle();
			},
			logout(){
				this.$router.push('/logout');
				this.session=null;
				window.axios.config={};
			},
			connect() {
				var /*me=this,*/session = localStorage.getItem('session');
				if(session){
					session=JSON.parse(session);
				}
				if(session!=null){
					/*var ws = new WebSocket("wss://web.regionancash.gob.pe/ws/S"+session.uid);
					ws.onopen = function() {
						// subscribe to some channels
						//ws.send(JSON.stringify({
						//.... some message the I must send when I connect ....
						//}));
					};
					ws.onmessage = function(e) {
						me.notify({body:e.data.msg?e.data.msg:e.data,title:'SHAMI APP'});
					};
					ws.onclose = function(e) {
						console.log('Socket is closed. Reconnect will be attempted in 1 second.', e.reason);
						setTimeout(function() {
							me.connect();
						}, 5000);
					};
					ws.onerror = function(err) {
						console.error('Socket encountered error: ', err.message, 'Closing socket');
						ws.close();
					};
					me.ws=ws;*/
				}
			},
			async toast(msx,callback) {
				const toast = await this.$ionic.toastController.create({
					message: msx,
					duration: 2000
				});
				await toast.present();
				if(callback)callback();
			}
		},
		created(){
			var me=this;
			if(!session)me.$router.push('/');
			var sf=function(status){
				status.connected=status.connected&&me.connected;
				window._.networkStatus =status;
				me.networkStatus=status;
			};
			Network.addListener('networkStatusChange',sf);
			Network.getStatus().then(sf);
			window.app=this;

			var _=window._;
			_.indexedDB = window.indexedDB || window.mozIndexedDB || window.webkitIndexedDB || window.msIndexedDB;
			_.IDBTransaction = window.IDBTransaction || window.webkitIDBTransaction || window.msIDBTransaction;
			_.IDBKeyRange = window.IDBKeyRange || window.webkitIDBKeyRange || window.msIDBKeyRange;
			if (!_.indexedDB) {
				window.alert("Your browser doesn't support a stable version of IndexedDB.")
			}else{
				var request = window.indexedDB.open("db", 1);
				request.onerror = function() {
					alert("error al crear db :/!");
				};
				request.onsuccess = function() {
					_.db = request.result;
				};
				request.onupgradeneeded = function(event) {
					var db = event.target.result;
					db.createObjectStore("region", {keyPath: "id"});
					db.createObjectStore("province", {keyPath: "code"});
					db.createObjectStore("district", {keyPath: "code"});
					db.createObjectStore("town", {keyPath: "id"});
					db.createObjectStore("sample", {keyPath: "id"});
					db.createObjectStore("pool", {keyPath: "tmpId"});
					db.createObjectStore("people", {keyPath: "tmpId"});
					db.createObjectStore("agreement", {keyPath: "tmpId"});
					db.createObjectStore("red", {keyPath: "code"});
					db.createObjectStore("microred", {keyPath: "ID"});
					db.createObjectStore("establishment", {keyPath: "ID"});
					db.createObjectStore("setting", {keyPath: "code"});
				}
			}



		},
		mounted(){
			var me=this;
			window.o=this.o;
			window.app=me;
			if(session){
				window.app.profileImg=session.people?session.people.urlPerfil:null;
				me.connected=session.connected;
			}
			me.bindLinks();
		}
	});
</script>
<style>

	@font-face {
		font-family: "PTSans";
		src: local("PTSans"),
		url(./cdn/fonts/ptsansnarrow-regular.ttf) format("truetype");
	}
	* {
		margin: 0px;
		padding: 0px;
	}
	#app {
		font-family: Avenir, Helvetica, Arial, sans-serif;
		-webkit-font-smoothing: antialiased;
		-moz-osx-font-smoothing: grayscale;
		color: #2c3e50;
		margin-top: 0px;
	}
	#page-header{
		border: 1px solid gray;		
		min-height: 36px;
	}
	#page-header > *{	
		min-height: 36px;
	}
	.primary{
		background-color: #0f62ac;
	}
	.v-widget-header,.ui-state-default{
		border: 1px solid #a8a8a8;
		background: #c4c4c4 linear-gradient(top,rgba(255,255,255,0.8),rgba(255,255,255,0));
		background: #c4c4c4 -webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.8)),to(rgba(255,255,255,0)));
		background: #c4c4c4 -moz-linear-gradient(top,rgba(255,255,255,0.8),rgba(255,255,255,0));
		background: #c4c4c4 -webkit-gradient(linear,left top,left bottom,from(rgba(255,255,255,0.8)),to(rgba(255,255,255,0)));
		color: #333;
		font-weight: bold;
		text-shadow: 0 1px 0 rgba(255,255,255,0.7);
	}
	.v-button-text-icon-left i,.v-button-text-icon-left svg,.tre svg{
		margin-right: 10px;
	}
	.v-text-icon-left svg {
		margin-right: 10px;
	}
	.tre li a {
		border-bottom: 1px solid #5d4141;
		padding: 10px;
		font-weight: normal;
	}
	.tre ul {
	padding-left: 30px;
	}
	.tre i{
	margin-right: 10px;
	width: 26px;
	text-align: center;
	}
	#page-header > .v-header-button {
	min-height: 36px;
	padding: 0px 6px;
	display: inline-block;
	}
	.v-header-button{
	cursor:pointer;
	}
	.v-header-button:hover{
	background-color:#0e355a;
	}
	.v-header-button > svg {
	overflow: visible;
	height: 34px;
	width: 22px !important;
	color: white;
	}
	.ui-datatable thead th, .ui-datatable tbody td, .ui-datatable tfoot td, .ui-datatable tfoot th {
	padding: 4px 5px;
	border-color: #ccd0d4;
	overflow: hidden;
	border: 1px solid #ccd0d4;
	}
	body{
	overflow-y:unset;
	}
	.v-popup-2 svg{
	left:0px;
	top:0px;
	margin:10px;
	position:absolute;
	}
	.v-popup-2 li{
	position:relative;
	border: 1px solid #c1c1c1;
	cursor:pointer;
	padding: 7px 7px 7px 50px;
	}
	.v-popup-2 li:hover{
	font-weight:bold;
	background-color: #dae1e4;
	}
	.ui-dialog-content{
	background-color:white;
	}
	.v-popup-2{
		list-style-type: none;
	}
	@media (min-width: 700px){
		.v-mobil{
			visibility: hidden;
			display: none;
		}
	}
	@media (max-width: 700px){
		.v-popup-2{
			width:100% !important;
		}
		.ui-datatable-header{
			visibility: hidden;
			display: none;
		}
	}
	.ic-42 svg{
		height: 36px;
		width: 36px;
		-webkit-filter: brightness(10);
		filter: brightness(10);
		background-size: 34px 34px;
		background-position: 2px 2px;
		background-repeat: no-repeat;
	}
	.ui-user > a{
		display:inline-block;
		padding:5px;
	}
	.ui-user{
		min-height: 0px !important;
		float: right;
		color: white;
		padding: 7px 0px 7px 7px;
		margin: 0px;
	}
	.x-menu-list{
		z-index: 1005;
		width:-webkit-fill-available;
	}
	.x-menu-list > li > a {
		padding: 10px 20px;
		display: block !important;
		width:unset !important;
	}
	.x-menu-bar svg.fa-bars{
		padding: 5px !important;
	}
	.tre ul > li a > svg{
		width:24px;
		height:24px;
	}
	.ui-panel-titlebar{
		border-width:0px;
	}
	@media (max-width: 700px){
		*{
			font-size: 103%;
		}
	}
	.v-head-cloned{display-:none;}
	.v-menubar > li > a{
		padding:10px;
	}
	.loading{
		background:url(./cdn/images/loading.svg) no-repeat top center;
	}
	.ui-panel > .v-widget-content > form > center:last-child {
		position: sticky;
		bottom: 0;
		background-color: #0f62ac;
		border-top: 1px solid gray;
		padding: 10px;
	}
	input{
		color:black;
	}
	.v-table th input {
    color:black;
}
.v-table th input:disabled {
    background-color: #dadada !important;
    opacity: 0.5;
}
</style>