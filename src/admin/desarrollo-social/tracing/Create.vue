<template>
	<v-form v-bind:header="(o.id?'Editar ':'Crear ')+'Seguimiento Socioeconomico'" storage="tracing" action="/api/desarrollo-social/tracing"> 
 <div class="v-form"> <label>Provincia:</label> <v-select v-model="o.province" name="province" storage="province_selected" required="required" v-on:input="$refs.districtSelect.load({provinceId:parseInt(o.province)})"> 
   <option value="">Select One...</option> 
   <v-options url="/api/directory/province/0/0?regionId=2" storage="province" value-field="code" display-field="name"></v-options> 
  </v-select> <label>Distrito:</label> <v-select ref="districtSelect" v-bind:autoload="false" storage="district_selected" v-bind:disabled="!o.province" v-model="o.district" name="district" required="required" v-on:input="$refs.localitySelect.load({district:o.district})"> 
   <option value="">Select One...</option> 
   <v-options url="/api/directory/district/0/0" storage="district" value-field="code" display-field="name"></v-options> 
  </v-select> <label>Poblado:</label> <v-select ref="localitySelect" v-bind:autoload="false" v-bind:disabled="!o.district" v-model="o.locality"> 
   <option value="">Select One...</option> 
   <v-options url="/api/directory/town/0/0" value-field="id" storage="town" display-field="name"></v-options> 
  </v-select> <label>Direcci&oacute;n:</label> <v-textarea type="text" rows="1" maxlength="100" v-model="o.address" title="Direcci&oacute;n"></v-textarea> <label>C&oacute;digo Casa:</label> 
  <input type="text" v-model="o.houseCode" maxlength="6" title="C&oacute;digo Casa" /> <label>Condici&oacute;n Vivienda:</label> <v-radio-group required="true" v-model="o.houseCondition"> 
   <v-radio label="Abierta" value="1"></v-radio> 
   <v-radio label="Rechazo" value="2"></v-radio> 
   <v-radio label="Cerrada" value="3"></v-radio> 
   <v-radio label="Abandonada" value="4"></v-radio> 
  </v-radio-group> 
  <template v-if="o.houseCondition==1"> <v-fieldset legend="Jefe de Familia" class="v-form"> 
    <label>DNI:</label> 
    <input v-model="o.dni" type="number" /> 
    <label>Actividad Economica:</label> 
    <v-radio-group v-model="o.economicActivity"> 
     <v-radio value="Agricultura"></v-radio> 
     <v-radio value="Ganaderia"></v-radio> 
     <v-radio value="Comercio"></v-radio> 
     <v-radio value="Transporte"></v-radio> 
    </v-radio-group> 
   </v-fieldset> <!--label&gt;Nivel Econ&oacute;mico:&lt;/label&gt;
            &lt;v-radio-group required="true" v-model="o.nivelEconomico"&gt;
                &lt;v-radio label="No pobre" value="1" /&gt;
                &lt;v-radio label="Pobre" value="2" /&gt;
                &lt;v-radio label="Extrema Pobreza" value="3" /&gt;
                &lt;v-radio label="No sabe" value="4" /&gt;
            &lt;/v-radio-group--> <label>Programas Sociales:</label> <v-checkbox-group v-model="o.socialPrograms"> 
    <v-checkbox value="Pension 65"></v-checkbox> 
    <v-checkbox value="Juntos"></v-checkbox> 
    <v-checkbox value="Cuna M&aacute;s"></v-checkbox> 
    <v-checkbox value="Contigo"></v-checkbox> 
   </v-checkbox-group> <label>Programas Municipales:</label> <v-checkbox-group v-model="o.municipalPrograms"> 
    <v-checkbox value="Vaso de Leche"></v-checkbox> 
    <v-checkbox value="Comedor Popular"></v-checkbox> 
   </v-checkbox-group> <!--label&gt;Beneficios Recibidos:&lt;/label&gt;
            &lt;v-checkbox-group v-model="o.beneficiosEstado"&gt;
                &lt;v-checkbox value="Bono de S/380 para familias vulnerables" /&gt;
                &lt;v-checkbox value="Bono de S/380 para trabajadores independientes" /&gt;
                &lt;v-checkbox value="Bono de S/720 a personal de salud" /&gt;
                &lt;v-checkbox value="Retiro de CTS" /&gt;
                &lt;v-checkbox value="Retiro de AFP" /&gt;
                &lt;v-checkbox value="Entrega de v&iacute;veres" /&gt;
                &lt;v-checkbox value="Pagos de recibos de luz y gas natural" /&gt;
                &lt;v-checkbox value="Pago del recibo de agua" /&gt;
                &lt;v-checkbox value="Pago del telefono, internet y cable" /&gt;
            &lt;/v-checkbox-group--> <label>Regi&oacute;n de Origen:</label> <v-select v-model="o.originRegion" required="required"> 
    <option value="">Select One...</option> 
    <v-options url="/api/directory/region/0/0" storage="region" value-field="code" display-field="name"></v-options> 
   </v-select> <label>Condici&oacute;n de Vivienda:</label> <v-radio-group required="true" v-model="o.housingCondition"> 
    <v-radio v-for="(item,i) in housingCondition" v-bind:key="i" v-bind:label="item" v-bind:value="''+(i+1)"></v-radio> 
   </v-radio-group> <label>Agua:</label> <v-radio-group required="true" v-model="o.water"> 
    <v-radio v-for="(item,i) in water" v-bind:label="item" v-bind:key="i" v-bind:value="''+(i+1)"></v-radio> 
   </v-radio-group> <label>Tipo de SS.HH:</label> <v-radio-group required="true" v-model="o.sshhType"> 
    <v-radio v-for="(item,i) in sshhType" v-bind:label="item" v-bind:key="i" v-bind:value="''+(i+1)"></v-radio> 
   </v-radio-group> <label>Alumbrado Electrico:</label> <v-radio-group required="true" v-model="o.electricalLighting"> 
    <v-radio v-for="(item,i) in electricalLighting" v-bind:label="item" v-bind:key="i" v-bind:value="''+(i+1)"></v-radio> 
   </v-radio-group> <label>Conectividad:</label> <v-radio-group required="true" v-model="o.connectivity"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="0"></v-radio> 
   </v-radio-group> 
   <template v-if="o.connectivity==1"> <label>Operadores:</label> <v-checkbox-group v-model="o.phoneOperator"> 
     <v-checkbox value="Claro"></v-checkbox> 
     <v-checkbox value="Bitel"></v-checkbox> 
     <v-checkbox value="Movistar"></v-checkbox> 
     <v-checkbox value="Entel"></v-checkbox> 
    </v-checkbox-group> 
   </template> <v-fieldset legend="Coordenadas"> 
    <template v-if="o.lat">
      ({{o.lat}},{{o.lon}}) 
    </template> 
    <div class="alert yellow" v-if="!o.lat">
      No se pudo obtener las coordenadas 
    </div> 
    <div class="right" style="margin-top:10px"> <v-button icon="fa-compass" value="Obtener coordenadas actuales" v-on:click.prevent="getCoordinates"></v-button> 
    </div> 
   </v-fieldset> 
  </template> 
 </div> 
 <center> <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button> <v-button value="Cancelar" icon="fa-ban" v-on:click.prevent="close"></v-button> 
 </center> 
</v-form>
</template>
<script>
	import { Plugins } from '@capacitor/core'
    import 'ol/ol.css';
    var axios=window.axios;
    var _=window._;
    export default _.ui({
        props:['id'],
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
            this.changeRoute();
        },
        methods: {
            changeRoute(){
                var me = this,id=me.id;
                if (id){
                    axios.get('/api/desarrollo-social/tracing/' + id).then(function (r) {
                        me.o = r.data;
                    });
                }else{
                    me.o={province: null, district: null, connectivity: null, lat: null, lon: null};
                    me.getCoordinates();
                }
            },
            close(r){if(r===true){this.$router.back();}},
            async getCurrentPosition(){
                var me=this;
                const { Geolocation } = Plugins;
                const c = await Geolocation.getCurrentPosition();
                me.o.lat = c.coords.latitude;
                me.o.lon = c.coords.longitude;
            },
            getCoordinates(){
                var me=this;
                if(me.getCurrentPosition){me.getCurrentPosition()}else
                _.getLocation().then(function (c) {
                    me.o.lat = c.coords.latitude;
                    me.o.lon = c.coords.longitude;
                });
            },
            process(o) {
                var me=this;
                var join=function(v){
                    if(v)if(v.join)v=v.join('|');
                    return v;
                };
                o.programasSociales = join(o.programasSociales);
                o.socialPrograms = join(o.socialPrograms);
                o.municipalPrograms = join(o.municipalPrograms);
                o.beneficiosEstado = join(o.beneficiosEstado);
                o.phoneOperator = join(o.phoneOperator);
                o.connectivity = (o.connectivity + 0) > 0;
                if (me.app)
                    o.user = me.app.session.id;
                return o;
            }
        }
    });
</script>