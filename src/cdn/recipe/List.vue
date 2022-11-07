<template>
<v-form id="DsSeguimientoDetList" header="Recetario Nutricional" action="/admin/desarrollo-social/anemia">
	<div style="padding-bottom: 0px;">
	<input style="border-radius: 5px;
    width: calc(100% - 14px);
    padding: 5px;
    font-size: 22px;" v-model="query" v-on:keydown.enter="addCategory"></div>
    <div style="height:calc(100% - 20px)">
	<div v-for="item in filteredItems" v-bind:key="item.id" style="margin-bottom:10px">
	<div style="position:relative;">
	<img style="width:100%;" onerror="this.src='http://web.regionancash.gob.pe/fs/images/Image.png'" v-bind:src="'http://web.regionancash.gob.pe/fs/recipe/'+item.id+'.png'"/>
	<h2 style="display:inline-block;left: 0px;position:absolute;top:0px;background-color:rgba(0,0,0,0.5);color:white;padding: 5px;">{{item.title}}</h2>
	<a v-if="item.video" v-bind:href="'https://www.youtube.com/channel/UCp83ekM5ZzVKcgyTG3liEWw'" target="_video" style="    display: inline-block;
    left: 4px;
    position: absolute;
    bottom: 8px;
    background-color: rgba(255, 0, 0, 0.5);
    border-radius: 10px;
    color: white;font-size: 22px;
    border: 1px solid brown;
    padding: 4px 8px;">
		Ver video
	</a>
	<a v-on:click.prevent="go" v-bind:href="'/recipe/'+item.id" style="display: inline-block;
    right: 4px;
    position: absolute;
    bottom: 8px;
    background-color: rgba(0, 0, 255, 0.5);
    border-radius: 10px;font-size: 22px;
    color: white;
    border: 1px solid brown;
    padding: 4px 8px;">
		Ver mas..
	</a>
	</div>
	</div>
	</div>
</v-form>
</template>
<script>
	var axios=window.axios;
	export default{
		extends:window._.extends,
		data:function(){return {query:null,recipes:null}},
		computed: {
			filteredItems() {
				var me=this;
				return me.query?this.recipes.filter(function(item){
					return item.title.toLowerCase().indexOf(me.query.toLowerCase()) > -1
				}):this.recipes;
			}
		},
		mounted:function(){
			var me=this;
			axios.get('/fs/recipe/recipes.json').then(function(r){
				me.recipes=r.data;
			});
		},
		methods:{
			addCategory: function(e){
				if(e) e.preventDefault();
				console.log("Added a new category, thanks!");
			},
			getSelectedId(r){
				return (r.pk.peopleId+'.'+r.pk.resultDate);
			}
		}
	};
</script>