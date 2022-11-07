<template>
<v-form v-bind:header="o.title" action="/admin/desarrollo-social/api/hemoglobin">
	<div class="v-form">
	<img style="width:100%;" onerror="this.src='http://web.regionancash.gob.pe/fs/images/Image.png'" v-bind:src="'http://web.regionancash.gob.pe/fs/recipe/'+o.id+'.png'"/>
	<div style="position:relative">
	<a v-if="o.video" v-bind:href="'http://youtube.com/channel/UCp83ekM5ZzVKcgyTG3liEWw'" target="_video" style="    display: inline-block;
	rigth: 4px;
	position: absolute;
	bottom: 8px;
	background-color: rgba(255, 0, 0, 0.5);
	border-radius: 10px;
	color: white;font-size: 22px;
	border: 1px solid brown;
	right: 4px;
	position: absolute;
	bottom: 8px;
	padding: 4px 8px;">
	Ver video
	</a>
	</div>
		
			<label>Ingredientes:</label>
			<div v-html="o.ingredientes"></div>
			<label>Preparación:</label>
			<div v-html="o.preparacion"></div>
			<div class="right">
						<a v-on:click="go" href="/recipe" style="display: inline-block;
    background-color: rgba(0, 0, 255, 0.7);
    border-radius: 10px;
    color: white;font-size: 22px;
    margin-top:10px;
    padding: 4px 12px;">
		Buscar recetas
	</a></div>
       
			<div>
				<div style="border: 1px solid gray;
				background-color: #ffffa8;
				margin-top: 10px;padding: 10px;
				font-weight: bolder;
				font-size: 20px;">
					Los ingredientes para esta receta y muchas mas se pueden encontrar en nuestra pagina de comercio electronico.
					<a href="http://web.regionancash.gob.pe/shami" target="_shami"><img width="100%" src="http://web.regionancash.gob.pe/shami/assets/img/shami_logo_principal.png"/></a>
				</div>
			</div>
		</div>
    </v-form>
</template>
<script>
	var axios=window.axios;
	//var _=window._;
	export default {
		props: ['id'],
		data:function(){return{o:{}}},
		extends:window._.extends,
		mounted() {
			var me=this;
			if(me.id){
				axios.get('/fs/recipe/recipes.json').then(function(r){
					var d=r.data;
					for(var i=0;i<d.length;i++){
						if(d[i].id==me.id){
							var o=d[i];
							if(o.ingredientes)
								o.ingredientes=o.ingredientes.replace(/(\r\n|\n|\r)/gm, "<br/>");
							if(o.preparacion)
								o.preparacion=o.preparacion.replace(/(\r\n|\n|\r)/gm, "<br/>");
							me.o=o;
						}
					}
				});
			}
		},
		methods: {
			/*camera() {
				var me = this;
				_.getCamera().then(function (r) {
					//{src:?,name:?}
					if (r.src)
						r.src = 'file://' + r.src;
					me.o.ext.files.push(r);
				});
			}*/
			/*addFile(f) {
				MsgBox('this.code=' + this.code);
				if (this.code) {
					this.files.push(f);
					_.syncFile('file://' + f.src, this.code);
				} else
					MsgBox('Se requiere un identificador de monitoreado valido');
			},
			sync(f) {
				if (!f.synced) {
					if (this.code)
						_.syncFile('file://' + f.src, this.code);
					else
						MsgBox('Se requiere un identificador de monitoreado valido');
				}
			},
			updateSync(id) {
				for (i = 0; this.files.lengt > i; i++) {
					if (id == this.files[i].id) {
						this.files[i].synced = true;
						Vue.set(this.files, i, this.files[i]);
					}

				}
			},
			removeRow(index) {
				this.rows.splice(index, 1); // why is this removing only the last row?
			},
			getCoordinates(){
				_.getLocation().then(function (c) {
					this.o.lat = c.coords.latitude;
					this.o.lon = c.coords.longitude;
				});
			}*/
		}
	}
	/*var input = document.querySelector('input[type=file]'); // see Example 4
	if (input) {
		input.onchange = function () {
			var file = input.files[0];
			//upload(file);
			drawOnCanvas(file);   // see Example 6
			//displayAsImage(file); // see Example 7
		};
	}
	function drawOnCanvas(file) {
		var reader = new FileReader();
		reader.onload = function (e) {
			var dataURL = e.target.result,
					c = document.querySelector('canvas'), // see Example 4
					ctx = c.getContext('2d'),
					img = new Image();
			img.onload = function () {
				c.width = img.width;
				c.height = img.height;
				ctx.drawImage(img, 0, 0);
			};
			img.src = dataURL;
		};
		reader.readAsDataURL(file);
	}
	function displayAsImage(file) {
		var imgURL = URL.createObjectURL(file),
				img = document.createElement('img');
		img.onload = function () {
			URL.revokeObjectURL(imgURL);
		};
		img.src = imgURL;
		document.body.appendChild(img);
	}*/
</script>
<style scope>
	#dateDiff:empty,#msg:empty{
		display:none;
	}
	#dateDiff{
		border-radius:4px;background-color:#fdfad9;border:1px solid #dddddd;padding:5px 10px;margin-top:10px;
	}
	#msg{
		border-radius:4px;background-color:#ffd2d2;border:1px solid #dddddd;padding:5px 10px;margin-top:10px;
	}
	.i-coords{
		display:none !important;
	}
	#gallery > img{
		border:3px solid #61ff5f;
		max-width:100%;
	}
	#gallery > .synced{
		border:3px solid #dddddd !important;
	}
	#gallery{
		margin-bottom:18px;
	}
</style>