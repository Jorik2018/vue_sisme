<template>
	<v-form id="DsPeopleCreateForm" action="/api/desarrollo-social/census" v-bind:header="(o.id?'Editar':'Crear')+' Empadronamiento'" storage="census"> 
 <div class="v-form" v-if="o"> <label>Familia:</label> 
  <div>
   {{o.masterId}}
  </div> 
  <template v-if="!o.ext.bossId"> <label>Regi&amp;oacute;n:</label> <v-select v-model="o.region" storage="region_selected" v-bind:required="true" v-on:input="$refs.province.load({regionId:o.region})"> 
    <option>Select One...</option> 
    <v-options value-field="code" storage="region" url="/api/directory/region/0/0"> 
     <template v-slot="{item}">
       {{item.name}} 
     </template> 
    </v-options> 
   </v-select> <label>Provincia:</label> <v-select ref="province" storage="province_selected" v-model="o.province" v-bind:autoload="false" v-bind:disabled="!o.region" v-bind:required="true" v-on:input="$refs.district.load({provinceId:o.province})"> 
    <option>Select One...</option> 
    <v-options value-field="code" url="/api/directory/province/0/0"> 
     <template v-slot="{item}">
       {{item.name}} 
     </template> 
    </v-options> 
   </v-select> <label>Distrito:</label> <v-select ref="district" v-model="o.district" v-bind:autoload="false" v-bind:disabled="!o.province" v-bind:required="true" v-on:input="$refs.ccpp.load({district:o.district});$refs.establishment.load({location:o.district});"> 
    <option>Select One...</option> 
    <v-options value-field="code" url="/api/directory/district/0/0"> 
     <template v-slot="{item}">
       {{item.name}} 
     </template> 
    </v-options> 
   </v-select> <label v-bind:title="o.ccpp">Localidad:</label> <v-select ref="ccpp" v-model="o.ccpp" v-bind:autoload="false" storage="ccpp" v-bind:disabled="!o.district" v-bind:required="true"> 
    <option>Select One...</option> 
    <v-options value-field="id" url="/api/directory/town/0/0"> 
     <template v-slot="{item}">
       {{item.name}} 
     </template> 
    </v-options> 
   </v-select> 
  </template> <label>DNI:</label> 
  <input type="tel" required="required" v-model="o.code" class="numeric center" style="text-align:center !important;" maxlength="12" pattern="[0-9]*" /> <label>ApPaterno:</label> 
  <input type="text" v-model="o.apPaterno" required="required" maxlength="45" title="ApPaterno" /> <label>ApMaterno:</label> 
  <input type="text" v-model="o.apMaterno" required="required" maxlength="45" title="ApMaterno" /> <label>Nombres:</label> 
  <input type="text" v-model="o.names" required="required" maxlength="45" title="Nombres" /> <label>Telefono:</label> 
  <input type="text" v-model="o.phone" maxlength="12" /> <label>Fecha Nacimiento:</label> <v-calendar v-model="o.birthdate" required="required" title="Fecha Nacimiento"></v-calendar> 
  <div id="dateDiff" v-if="dateDiff" style="    border: 1px solid #ffcb60;     background-color: #f9ff70;     padding: 5px;     margin-top: 5px;">
   HACE {{dateDiff}}
  </div> <label>Sexo:</label> <v-radio-group required="true" v-model="o.sex"> 
   <v-radio label="Masculino" value="M"></v-radio> 
   <v-radio label="Femenino" value="F"></v-radio> 
  </v-radio-group> <label v-bind:title="o.ext.bossId">PARENTESCO con JEFE FAMILIA:</label> <v-radio-group required="true" v-model="o.relationship"> <!--v-radio value="1" label="SOCIO"/--> 
   <v-radio value="2" label="Conyugue"></v-radio> 
   <v-radio value="3" label="Hijo"></v-radio> 
   <v-radio value="4" label="Nieto"></v-radio> 
   <v-radio value="5" label="Padre"></v-radio> 
   <v-radio value="6" label="Hermano"></v-radio> 
   <v-radio value="7" label="Yerno/Nuera"></v-radio> 
   <v-radio value="8" label="Abuelo"></v-radio> 
   <v-radio value="9" label="Suegro"></v-radio> 
   <v-radio value="10" label="Tio"></v-radio> 
   <v-radio value="11" label="Sobrino"></v-radio> 
   <v-radio value="12" label="Primo"></v-radio> 
   <v-radio value="13" label="Cu&ntilde;ado"></v-radio> 
   <v-radio value="14" label="Otro"></v-radio> 
  </v-radio-group> <label>Estado Civil:</label> <v-select v-model="o.civilStatus" required="required"> 
   <option value="">Select One...</option> 
   <option v-for="(civilStatus,key) in options.civilStatus" v-bind:key="key" v-bind:value="civilStatus">{{civilStatus}}</option> 
  </v-select> <label>Grado de Instrucci&oacute;n:</label> <v-select v-model="o.degreeInstruction" required="required"> 
   <option value="">Select One...</option> 
   <option v-for="(degreeInstruction,key) in options.degreeInstruction" v-bind:key="key" v-bind:value="degreeInstruction">{{degreeInstruction}}</option> 
  </v-select> <v-textarea v-if="o.degreeInstruction=='Observaciones'" required="true" style="margin-top: 6px" maxlength="100" v-model="o.otherDegreeInstruction"></v-textarea> <label>Ocupaci&oacute;n:</label> <v-select v-model="o.occupation" required="required"> 
   <option value="">Select One...</option> 
   <option v-for="(occupation,key) in options.occupation" v-bind:key="key" v-bind:value="key+1">{{occupation}}</option> 
  </v-select> <label>Idioma:</label> <v-select v-model="o.language" required="required"> 
   <option value="">Select One...</option> 
   <option v-for="(language,key) in options.language" v-bind:key="key" v-bind:value="key+1">{{language}}</option> 
  </v-select> <label>Seguro:</label> <v-select v-model="o.assured" required="required"> 
   <option value="">Select One...</option> 
   <option v-for="(assured,key) in options.assured" v-bind:key="key" v-bind:value="key+1">{{assured}}</option> 
  </v-select> <label>Vulnerabilidad:</label> 
  <template v-if="o.sex=='F'"> <v-checkbox v-model="o.pregnant" v-on:input="o.puerpera=o.pregnant?0:o.puerpera" label="Embarazada"></v-checkbox> <v-checkbox v-model="o.puerpera" v-on:input="o.pregnant=o.puerpera?0:o.pregnant" label="Puerpera"></v-checkbox> 
  </template> <v-checkbox v-model="o.diabetes" label="Diabetes"></v-checkbox> <v-checkbox v-model="o.obesity" label="Obesidad"></v-checkbox> <v-checkbox v-model="o.disability" label="Discapacitado"></v-checkbox> <v-checkbox v-model="o.hypertensive" label="Hipertenso"></v-checkbox> <label>Intervenci&oacute;n COVID?:</label> <v-switch required="true" v-model="o.covid"></v-switch> <v-fieldset v-if="(o.covid+'')=='true'" legend="Ultima Intervencion"> 
   <label>Sintomatolog�a:</label> 
   <v-radio-group required="true" v-model="o.sintomatologia"> 
    <v-radio value="1" label="SI"></v-radio> 
    <v-radio value="0" label="NO"></v-radio> 
   </v-radio-group> 
   <label>Tipo Prueba:</label> 
   <v-radio-group required="true" v-model="o.testType"> 
    <v-radio value="SEROLOGICA"></v-radio> 
    <v-radio value="ANTIGENO"></v-radio> 
    <v-radio value="PCR"></v-radio> 
   </v-radio-group> 
   <label>Resultado Reactivo:</label> 
   <v-radio-group required="true" v-model="o.reactive"> 
    <v-radio value="SI"></v-radio> 
    <v-radio value="NO"></v-radio> 
   </v-radio-group> 
   <template v-if="o.reactive=='SI'"> <label>En Aislamiento?:</label> <v-switch required="true" v-model="o.isolation"></v-switch> <v-fieldset v-if="o.isolation"> 
     <label>Tipo Aislamiento:</label> 
     <v-radio-group required="true" v-model="o.isolationType"> 
      <v-radio value="CASA"></v-radio> 
      <v-radio value="CATS"></v-radio> 
     </v-radio-group> 
     <label>Dias:</label> 
     <input type="number" v-model="o.isolationDays" /> 
    </v-fieldset> 
   </template> 
  </v-fieldset> <label>Establecimiento:</label> <v-select ref="establishment" v-model="o.establishment" v-bind:autoload="false" v-bind:disabled="!o.district" v-bind:required="true"> 
   <option>Select One...</option> 
   <v-options value-field="id" storage="establishment" url="/api/desarrollo-social/establishment/0/0"> 
    <template v-slot="{item}">
      {{item.name}} 
    </template> 
   </v-options> 
  </v-select> <label>Observaci&oacute;n:</label> <v-textarea v-model="o.remark" maxlength="355" placeholder="Informacion adicional por ejemplo: localidad, establecimiento, etc."></v-textarea> 
  <template> <v-fieldset legend="Coordenadas"> 
    <template v-if="0>o.lat">
      ({{o.lat}},{{o.lon}}) 
    </template> 
    <div class="alert yellow" v-if="o.lat>=0">
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
        import Vue from 'vue'
        var _=window._;
        export default _.ui({
            props: ['id', 'action'],
            data() {
                return {district: null,
                    options:{
                        civilStatus:['Casada','Coviviente','Viuda','Soltera','Divorciada','Separada'],
                        language:["Castellano","Quechua","Ambos"],
                        degreeInstruction:["No escolaridad","Incial/ preescolar","Primaria Completa",
                            "Primaria InCompleta","Secundaria Completa","Secundaria Incompleta",
                            "Superior no Universitaria","Superior Universitaria","Post Grado","Observaciones"],
                        assured:["SIS","EsSalud","Otros","Ninguno"],
                        occupation:["Depend. salariado","Independ.",'Empleador','Serv. Domestico','Desempleado','Casa','Estudiante','Jubilado','Sin actividad']
                    },
                    o: {lat: null, lon: null, ext: {}}};
            },
            computed: {
                dateDiff(){
                    var r='',f=this.o.birthdate;
                    if(f){
                        var r2=Vue.dateDiff(f,new Date());
                        if(r2.ans)
                            r+=(r2.ans+' ANIOS ');
                        if(r2.meses)
                            r+=(r2.meses+' MESES ');
                        if(r2.dias)
                            r+=(r2.dias+' DIAS ');
                    }
                    return r;
                }
            },
            created() {
                this.district = JSON.parse(localStorage.getItem("district_selected"));
            },
            mounted() {
                this.changeRoute();
            },
            methods: {
                changeRoute() {
                    var me = this, id = me.id, action = me.action;
                    if (id) {
                        if (action == 'add') {
                            var v = id.split('.');
                            var o = {lat: null, lon: null, bossId: v[1], district: null, masterId: v[0], ext: {bossId: v[1] ? v[1] : null}};
                            if (!me.online || o.ext.bossId) {
                                o.district = me.district;
                                if (!me.online) {
                                    if (me.$refs)
                                        me.$refs.ccpp.load({district: o.district});
                                    me.$refs.establishment.load({location: o.district});
                                } else {
                                    //si el padre no es un registro guardado se pedira q se guarde
                                    //Se debe crear 1 registro para poder recuperar el centro de salud
                                    axios.get('/api/desarrollo-social/tracing/' + v[0]).then(function (response) {
                                        me.o.district = response.data.district;
                                        me.$refs.establishment.load({location: Vue.pad(me.o.district, 0)});
                                    });
                                }
                            }
                            me.o = o;
                            me.getCoordinates();
                        } else {
                            axios.get('/api/desarrollo-social/census/' + id).then(function (response) {
                                me.o = response.data;
                                console.log(me.o);
                                if (!me.o.district) {
                                    axios.get('/api/desarrollo-social/tracing/' + me.o.masterId).then(function (response) {
                                        me.o.district = response.data.district;
                                        me.$refs.establishment.load({location: me.o.district});
                                    });
                                } else {
                                    me.$refs.establishment.load({location: Vue.pad(me.o.district, 6)});
                                }
                            });
                        }
                    } else {
                        me.o = {lat: null, lon: null, ext: {}};
                        me.getCoordinates();
                    }
                },
                close(r){if(r===true){this.$router.back();}},
                regionInput() {

                },
                async getCurrentPosition() {
                    var me = this;
                    const {Geolocation} = Plugins;
                    const c = await Geolocation.getCurrentPosition();
                    me.o.lat = c.coords.latitude;
                    me.o.lon = c.coords.longitude;
                },
                getCoordinates() {
                    var me = this;
                    if(me.getCurrentPosition){me.getCurrentPosition()}else
                    _.getCurrentPosition().then(function (c) {
                        me.o.lat = c.coords.latitude;
                        me.o.lon = c.coords.longitude;
                    });
                },
                process(o) {
                    var user = this.user;
                    var join = function (v) {
                        if (v)
                            if (v.join)
                                v = v.join('|');
                        return v;
                    };
                    o.vulnerabilidades = join(o.vulnerabilidades);
                    if (user)
                        o.user = user.id;
                    return o;
                }
            }
        })
</script>