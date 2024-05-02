<template>
	<v-form id="SidCreateForm" v-bind:header="(o.id?'Editar':'Crear')+' SID'" action="/api/desarrollo-social/sid"> 
 <div> <v-fieldset legend="Informaci&oacute;n General" class="v-form"> 
   <label>Representante Familia:</label> 
   <input type="text" required="true" autocapitalize="word" maxlength="50" pattern="[a-zA-Z]+" name="user" v-model="o.people" /> 
   <label>Codigo Familia:</label> 
   <input type="text" required="true" name="sidIdfamilia" maxlength="10" pattern="[a-zA-Z0-9]+" v-model="o.sidIdfamilia" title="SidIdfamilia" /> 
   <label>Total Varones:</label> 
   <input type="number" required="true" name="men" min="0" v-model="o.men" title="Varones" /> 
   <label>Total Mujeres:</label> 
   <input type="number" required="true" name="women" min="0" v-model="o.women" title="Mujeres" /> 
   <label>Provincia:</label> 
   <v-select v-model="o.province" name="province" required="required" v-on:input="$refs.districtSelect.load({provinceId:parseInt(o.province)});"> 
    <option value="">Select One...</option> 
    <v-options url="/api/directory/province/0/0?regionId=2" value-field="code" display-field="name"></v-options> 
   </v-select> 
   <label>Distrito:</label> 
   <v-select ref="districtSelect" v-bind:autoload="false" v-bind:disabled="!o.province" name="sidDistrito" v-model="o.district" required="required" v-on:input="$refs.establishmentSelect.load({location:o.district+'%'})"> 
    <option value="">Select One...</option> 
    <v-options url="/api/directory/district/0/0" value-field="code" display-field="name"></v-options> 
   </v-select> 
   <label>Direcci&oacute;n:</label> 
   <v-textarea type="text" required="true" v-model="o.address" title="Direcci&oacute;n"></v-textarea> 
   <label>Referencia:</label> 
   <v-textarea type="text" required="true" v-model="o.reference" title="Referencia"></v-textarea> 
   <label>Establecimiento Salud:</label> 
   <v-select v-bind:disabled="!o.district" ref="establishmentSelect" v-bind:autoload="false" name="eess" v-model="o.eess"> 
    <option value="0">Select One...</option> 
    <v-options url="/api/desarrollo-social/establishment/0/0" v-bind:filters="{location:o.district+'%'}" value-field="id" display-field="name"></v-options> 
   </v-select> 
  </v-fieldset> 
  <div class="dark">
   VERIFICACI&Oacute;N H&Aacute;BITOS DE HIGIENE
  </div> <v-fieldset legend="Agua"> 
   <label>&iquest;Consumen agua clorada?:</label> 
   <v-radio-group required="true" v-model="o.aClorada"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
    <v-radio label="DESCONOCE" value="3"></v-radio> 
   </v-radio-group> 
   <label>&iquest;La almacenan en dep&oacute;sitos limpios y con tapa?:</label> 
   <v-radio-group required="true" v-model="o.aAlmacenada"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;Sacan el agua almacenada sin contaminarla (en jarra)?:</label> 
   <v-radio-group required="true" v-model="o.aSacan"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;Utilizan el agua directamente del ca&ntilde;o?:</label> 
   <v-radio-group required="true" v-model="o.aguaCano"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;El lavadero est&aacute; limpio y funcionando?:</label> 
   <v-radio-group required="true" v-model="o.aBatea"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;Hierven el agua antes de consumirla?:</label> 
   <v-radio-group required="true" v-model="o.hiervenAguaAntesConsumirla"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
  </v-fieldset> <v-fieldset legend="Higiene Personal"> 
   <div class="v-col"> <label>&iquest;Las personas est&aacute;n aseadas? (Observar):</label> <v-radio-group required="true" v-model="o.hAseadas"> 
     <v-radio label="SI" value="1"></v-radio> 
     <v-radio label="NO" value="2"></v-radio> 
    </v-radio-group> 
   </div> 
   <div class="v-col"> <label>&iquest;Lavado de manos? (Observar y verificar):</label> <v-checkbox-group name="hLavada" v-model="o.hLavada"> 
     <v-checkbox value="Tienen las manos limpias"></v-checkbox> 
     <v-checkbox value="Se lava las manos de chorro"></v-checkbox> 
     <v-checkbox value="Se lava las manos antes de preparar los alimentos"></v-checkbox> 
     <v-checkbox value="Se lava las manos antes de comer"></v-checkbox> 
     <v-checkbox value="Utiliza jabon o ceniza para lavarse"></v-checkbox> 
    </v-checkbox-group> 
   </div> 
  </v-fieldset> <v-fieldset legend="Letrinas" class="v-form"> 
   <label>&iquest;Tiene letrinas o ba&ntilde;o?:</label> 
   <v-radio-group required="true" v-model="o.lTiene"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <template v-if="o.lTiene==1"> <label>&iquest;La letrina o ba&ntilde;o esta limpio? (Verificar):</label> <v-radio-group required="true" v-model="o.lLimpio"> 
     <v-radio label="SI" value="1"></v-radio> 
     <v-radio label="NO" value="2"></v-radio> 
    </v-radio-group> <label>&iquest;Se lavan las manos despu�s de usarla?:</label> <v-radio-group required="true" v-model="o.lLavan"> 
     <v-radio label="SI" value="1"></v-radio> 
     <v-radio label="NO" value="2"></v-radio> 
    </v-radio-group> 
   </template> 
   <template v-if="o.lTiene==2"> <label>Si no tiene letrina o ba&ntilde;o, &iquest;qu� usa?:</label> <v-textarea v-model="o.sinLetrinaUsa" maxlength="45"></v-textarea> 
   </template> 
  </v-fieldset> <v-fieldset legend="Vivienda" class="v-form"> 
   <label>&iquest;La cocina est&aacute; limpia y ordenado? (Observar):</label> 
   <v-radio-group required="true" v-model="o.vLimpia"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;Los utensilios de cocina estan limpios y rotegidos? (Observar):</label> 
   <v-radio-group required="true" v-model="o.vProtegidos"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;Usan el corral para los animales mayores y menores?:</label> 
   <v-radio-group required="true" v-model="o.vAnimales"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>&iquest;El patio y alrededor de la vivienda est&aacute; limpia? (verificar):</label> 
   <v-radio-group required="true" v-model="o.vPatio"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
  </v-fieldset> <v-fieldset legend="DISPOSICI&Oacute;N DE BASURA" class="v-form"> 
   <label>&iquest;C&oacute;mo disponen de la basura? (observar):</label> 
   <v-checkbox-group required="true" v-model="o.comoDisponenBasura"> 
    <v-checkbox value="Entierran la basura"></v-checkbox> 
    <v-checkbox value="La echan en el microrrelleno sanitario"></v-checkbox> 
    <v-checkbox value="La recoge el carro basurer"></v-checkbox> 
    <v-checkbox value="Otro"></v-checkbox> 
    <v-textarea style="margin-top: 8px;" v-if="o.comoDisponenBasura&amp;&amp;o.comoDisponenBasura.contains('Otro')" v-model="o.disposicionBasuraOtro"></v-textarea> 
   </v-checkbox-group> 
  </v-fieldset> 
  <div class="dark">
   PRESENCIA DE ENFERMEDADES EN EL MES ANTERIOR
  </div> <v-fieldset legend="EDA" class="v-form"> 
   <label>&iquest;Se present&oacute; diarrea en menores de 5 a&ntilde;os?:</label> 
   <v-radio-group required="true" v-model="o.eMenores"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>N&deg; de casos:</label> 
   <input type="number" required="true" v-bind:disabled="o.eMenores!=1" min="0" name="edaCasomen" v-model="o.edaCasomen" title="N&deg; de casos" /> 
   <label>&iquest;Se present&oacute; diarrea en mayores de 5 a&ntilde;os?:</label> 
   <v-radio-group required="true" v-model="o.eMayores"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>N&deg; de casos:</label> 
   <input type="number" required="true" v-bind:disabled="o.eMayores!=1" min="0" name="edaCasomay" v-model="o.edaCasomay" /> 
  </v-fieldset> <v-fieldset legend="Enfermedades de la Piel" class="v-form"> 
   <label>&iquest;Se presentaron enfermedades de la piel en menores de 5 a&ntilde;os?:</label> 
   <v-radio-group required="true" name="pMenores" v-model="o.pMenores"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>N&deg; de casos:</label> 
   <input type="number" required="true" v-bind:disabled="o.pMenores!=1" min="0" name="epCasomen" v-model="o.epCasomen" /> 
   <label>&iquest;Se presentaron enfermedades de la piel en mayores de 5 a&ntilde;os?:</label> 
   <v-radio-group required="true" v-model="o.pMayores"> 
    <v-radio label="SI" value="1"></v-radio> 
    <v-radio label="NO" value="2"></v-radio> 
   </v-radio-group> 
   <label>N&deg; de casos:</label> 
   <input type="number" required="true" v-bind:disabled="o.pMayores!=1" min="0" name="epCasomay" v-model="o.epCasomay" /> 
  </v-fieldset> 
 </div> 
 <center style="margin-top: 10px"> <v-button v-on:click.prevent="save" icon="fa-save" value="Grabar"></v-button> <v-button v-on:click.prevent="close" icon="fa-ban" value="Cancelar"></v-button> 
 </center> 
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
        props:['id'],
        data(){
            return {o: {}}
        },
        mounted: function () {
            this.render();
        },
        updated(){this.app.title=this.$children[0].header;},
        methods: {
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
                    axios.get('/api/desarrollo-social/sid/' + id).then(function (r) {
                        var o=r.data;
                        //o.hLavada = o.hLavada ? o.hLavada.split('|') : [];
                        //o.comoDisponenBasura = o.comoDisponenBasura ? o.comoDisponenBasura.split('|') : [];
                        me.o = o;
                    });
                }else{
                    me.o={};
                    var o = me.o;
                    _.getLocation().then(function (c) {
                        o.lat = c.coords.latitude;
                        o.lon = c.coords.longitude;
                    });
                }
                setTimeout(function(){ me.app.title=me.$children[0].header; }, 200);
            },
            close(r){if(r===true){this.$router.back();}},
            process(o) {
                var me=this;
                var join=function(v){
                    if(v)if(v.join)v=v.join('|');
                    return v;
                };
                if (!o.edaCasomen)
                    o.edaCasomen = 0;
                if (!o.edaCasomay)
                    o.edaCasomay = 0;
                o.sidRegistro = null;
                o.hLavada = join(o.hLavada);
                o.comoDisponenBasura=join(o.comoDisponenBasura);
                if (me.app)
                    o.user = me.app.session.id;
                return o;
            }
        }
    }
</script>
<style scoped>
	.dark{
        background-color: #4a4a4a;
        color: white;
        text-align: center;
        padding: 5px;
        margin-top: 8px;
    }
</style>