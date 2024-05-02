<template>
	<v-form header="Configuraci&oacute;n Fuera de Linea" action="/api/desarrollo-social/tracing"> 
		<div class="v-form"> 
			<label>Provincia:</label>
			<v-select v-model="o.province" name="province" storage="province_selected" required="required" v-on:input="$refs.districtSelect.load({provinceId:parseInt(o.province)})"> 
			<option value="">Select One...</option> 
			<v-options url="/api/directory/province/0/0?regionId=2" storage="province" value-field="code" display-field="name"></v-options> 
			</v-select> 
			<label>Distrito:</label> 
			<v-select ref="districtSelect" v-bind:autoload="false" storage="district_selected" v-bind:disabled="!o.province" v-model="o.district" name="district" 
			required="required" v-on:input="$refs.localitySelect.load({district:o.district});$refs.establishment.load({location:o.district});"> 
			<option value="">Select One...</option> 
			<v-options url="/api/directory/district/0/0" storage="district" value-field="code" display-field="name"></v-options> 
			</v-select> 
			<label>Poblado:</label>
			<v-select ref="localitySelect" v-bind:autoload="false" v-bind:disabled="!o.district" v-model="o.locality"> 
			<option value="">Select One...</option> 
			<v-options url="/api/directory/town/0/0" value-field="id" storage="town" display-field="name"></v-options> 
			</v-select>
			<label>Establecimiento:</label> 
			<v-select ref="establishment" v-model="o.establishment" v-bind:autoload="false" v-bind:disabled="!o.district" v-bind:required="true"> 
				<option>Select One...</option> 
				<v-options value-field="id" storage="establishment" url="/api/desarrollo-social/establishment/0/0"> 
				<template v-slot="{item}">
				{{item.name}} 
				</template> 
				</v-options> 
			</v-select>
			<label>Regi&oacute;n de Origen:</label> 
			<v-select v-model="o.originRegion" required="required"> 
			<option value="">Select One...</option> 
			<v-options url="/api/directory/region/0/0" storage="region" value-field="code" display-field="name"></v-options> 
			</v-select>
			<v-button style="margin-top:20px" value="Guardar Datos en Servidor" v-on:click.prevent="guardar"/>
		</div> 
		
	</v-form>
</template>
<script>
    import 'ol/ol.css';
    var axios=window.axios;
    var _=window._;
    export default {
        watch:{
            $route(){
                var me=this;
                setTimeout(function(){me.render()},200);
            }
        },
        extends:window._.extends,
        data(){
            return {
                housingCondition:[
                    'Propia',
                    'Alquilado'
                ],
                water:[
                    'Red publica dentro de vivienda',
                    'Red publica fuera de la vivienda',
                    'Rio/ Asequia',
                    'Cisterna'
                ],
                sshhType:[
                    'Red publica dentro de la vivienda ',
                    'Pozo ciego/ letrina',
                    'No tiene'
                ],
                electricalLighting:[
                    'SI',
                    'NO'
                ],
                o: {province: null, district: null, connectivity: null, lat: null, lon: null}}
        },
        mounted() {
            this.render();
        },
        updated(){this.app.title=this.$children[0].header;},
        methods: {
			guardar(){
				var data=localStorage.getItem('census')+'\n\n'+localStorage.getItem('tracing');
				axios.post('/api/desarrollo-social/tracing/save-data',{user:this.app.session.id,data:data}).then(function(r){_.MsgBox(r.data)});
			},
            render(){
                var me = this,id=me.id;
                if(!id){
                    var path=me.$el.parentNode.getAttribute('path');
                    if(path){
                        var action = path.split('/')[4].split('?')[0];
                        id = action == 'create' ? 0 : action;
                    }
                }
                if (id){
                    axios.get('/api/desarrollo-social/tracing/' + id).then(function (r) {
                        me.o = r.data;
                    });
                }else{
                    me.o={province: null, district: null, connectivity: null, lat: null, lon: null};
                }
                setTimeout(function(){ me.app.title=me.$children[0].header; }, 200);
            },
            close(r){if(r===true){this.$router.back();}},
            process(o) {
                return o;
            }
        }
    }
</script>