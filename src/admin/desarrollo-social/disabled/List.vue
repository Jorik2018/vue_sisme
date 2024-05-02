<template>
	<v-form id="DisabledList" header="Discapacitados" action="/admin/desarrollo-social/disabled"> 
 <v-table v-bind:selectable="true" v-bind:scrollable="true" v-on:synchronized="postSync" row-style-class="row.tmpSynchronized?'green':(row.tmpId>0?'yellow':'')" rowKey="id" storage="disabled" v-bind:pagination="20" src="/api/desarrollo-social/disabled" v-bind:filters="filters"> 
  <template v-slot:header=""> <v-button value="Crear" v-if="canRegister()" icon="fa-plus" class="on" v-on:click.prevent="create"></v-button> <v-button value="Editar" v-if="canRegister()" icon="fa-pen" v-on:click.prevent="edit" v-bind:disabled="rowSelectedCount==0"></v-button> <v-button value="Eliminar" v-if="canRegister()" icon="fa-trash" v-on:click.prevent="destroy" v-bind:disabled="rowSelectedCount==0"></v-button> <v-button title="Refrescar" icon="fa-sync" v-on:click.prevent="refresh"></v-button> <v-uploader v-on:input="upload" value="Importar"></v-uploader> <v-button title="Enviar al Servidor" v-if="online" icon="fa-database" class="on" v-on:click.prevent="sync"></v-button> 
  </template> 
  <template v-slot:default="{row,index}"> 
   <td class="center" header="#" width="28">  {{pad(index+1,3)}} </td> 
   <td width="80" class="center" v-bind:class="{'yellow':0>row.id}" header="ID">  {{row.id&gt;0?pad(row.id,6):'?'}} </td> 
   <td width="80" class="center" header="DNI">  {{row.code}} </td> 
   <td width="200" header="Nombres">  {{row.names}} </td> 
   <td width="200" header="Apellidos">  {{row.surnames}} </td> 
   <td width="80" class="center" header="Fecha Nacimiento">  {{row.birthdate|date}} </td> 
   <td width="160" header="Provincia">  {{row.provinceName?row.provinceName:row.province}} </td> 
   <td width="160" header="Distrito">  {{row.districtName?row.districtName:row.district}} </td> 
   <td width="160" header="Poblado">  {{row.townName?row.townName:row.town}} </td> 
   <td width="200" header="Direcci&oacute;n">  {{row.address}} </td> 
   <td width="200" header="Telefono">  {{row.phone}} </td> 
   <td width="200" header="Mail">  {{row.mail}} </td> 
   <td width="130" class="center" header="Cuenta con certificado de discapacidad?">  
    <template v-if="!row.certified">
      NO 
    </template> 
    <template v-if="row.certified"> <a v-bind:href="'/fs/desarrollo-social/disabled/certified/'+row.id+'.jpeg'" target="_new"> SI </a> 
    </template> <span v-if="row.ext">{{row.ext.tmpSrc}}</span> </td> 
   <td width="200" header="Resoluci&oacute;n">  {{row.nroResolution}} </td> 
   <td width="200" header="Nro Cerficado">  {{row.nroCertificate}} </td> 
   <td width="80" class="center" header="Fecha Emisi&oacute;n">  {{row.issuanceDate|date}} </td> 
   <td width="80" class="center" header="Fecha Caducidad">  {{row.expiryDate|date}} </td> 
   <td width="200" header="Tipo">  {{row.type}} 
    <template v-if="row.otherType">
      : {{row.otherType}} 
    </template> </td> 
   <td width="200" header="Severidad">  {{row.severity}} </td> 
   <td width="200" header="Dispositivos o productos de apoyo que utiliza">  {{row.devices}} </td> 
   <td width="100" class="center" header="Requiere asistencia?">  {{row.assistance?'SI':'NO'}} </td> 
   <td width="200" header="Persona que asiste">  {{row.assistant}} </td> 
   <td width="80" header="Necesidades Basicas">  {{row.basicNeeds}} </td> 
   <td width="200" header="Descripcion Necesidades">  {{row.descriptionNeeds}} </td> 
   <td width="80" class="center" header="Fecha Fallecimiento">  {{row.deathDate|date}} </td> 
   <td width="90" class="center" header="Coordenadas">  {{0&gt;row.lat&amp;&amp;0&gt;row.lon?'SI':'NO'}} </td> 
   <td width="80" class="center" header="Usuario">  {{row.user}} </td> 
   <td width="80" class="center" header="Fecha Actualizaci&oacute;n">  {{row.updateDate|date}} </td> 
  </template> 
  <template v-slot:filters="">
   <v-filter index="0"> 
    <input disabled="disabled" v-model="filters.x" /> 
   </v-filter><v-filter index="1"> 
    <input disabled="disabled" v-model="filters.x" /> 
   </v-filter><v-filter index="2"> 
    <input v-model="filters.code" /> 
   </v-filter><v-filter index="3"> 
    <input v-model="filters.names" /> 
   </v-filter><v-filter index="4"> 
    <input v-model="filters.surnames" /> 
   </v-filter><v-filter index="5"> 
    <input disabled="disabled" v-model="filters.birthdate" /> 
   </v-filter><v-filter index="6"> 
    <input disabled="disabled" v-model="filters.province" /> 
   </v-filter><v-filter index="7"> 
    <input v-model="filters.district" /> 
   </v-filter><v-filter index="8"> 
    <input v-model="filters.ccpp" /> 
   </v-filter><v-filter index="9"> 
    <input v-model="filters.address" /> 
   </v-filter><v-filter index="10"> 
    <input v-model="filters.phone" /> 
   </v-filter><v-filter index="11"> 
    <input disabled="disabled" v-model="filters.mail" /> 
   </v-filter><v-filter index="12"> 
    <input v-model="filters.certified" /> 
   </v-filter><v-filter index="13"> 
    <input v-model="filters.nroResolution" /> 
   </v-filter><v-filter index="14"> 
    <input v-model="filters.nroCertificate" /> 
   </v-filter><v-filter index="15"> 
    <input v-model="filters.issuanceDate" /> 
   </v-filter><v-filter index="16"> 
    <input v-model="filters.expiryDate" /> 
   </v-filter><v-filter index="17"> 
    <input v-model="filters.type" /> 
   </v-filter><v-filter index="18"> 
    <input v-model="filters.severity" /> 
   </v-filter><v-filter index="19"> 
    <input v-model="filters.devices" /> 
   </v-filter><v-filter index="20"> 
    <input v-model="filters.assistance" /> 
   </v-filter><v-filter index="21"> 
    <input v-model="filters.assistant" /> 
   </v-filter><v-filter index="22"> 
    <input v-model="filters.basicNeeds" /> 
   </v-filter><v-filter index="23"> 
    <input v-model="filters.descriptionNeeds" /> 
   </v-filter><v-filter index="24"> 
    <input v-model="filters.deathDate" /> 
   </v-filter><v-filter index="25"> 
    <input v-model="filters.lat" /> 
   </v-filter><v-filter index="26"> 
    <input v-model="filters.user" /> 
   </v-filter><v-filter index="27"> 
    <input v-model="filters.updateDate" /> 
   </v-filter>
  </template>
  <template v-slot:columns="">
   <td width="28" header="#"></td>
   <td width="80" header="ID"></td>
   <td width="80" header="DNI"></td>
   <td width="200" header="Nombres"></td>
   <td width="200" header="Apellidos"></td>
   <td width="80" header="Fecha Nacimiento"></td>
   <td width="160" header="Provincia"></td>
   <td width="160" header="Distrito"></td>
   <td width="160" header="Poblado"></td>
   <td width="200" header="Direcci&oacute;n"></td>
   <td width="200" header="Telefono"></td>
   <td width="200" header="Mail"></td>
   <td width="130" header="Cuenta con certificado de discapacidad?"></td>
   <td width="200" header="Resoluci&oacute;n"></td>
   <td width="200" header="Nro Cerficado"></td>
   <td width="80" header="Fecha Emisi&oacute;n"></td>
   <td width="80" header="Fecha Caducidad"></td>
   <td width="200" header="Tipo"></td>
   <td width="200" header="Severidad"></td>
   <td width="200" header="Dispositivos o productos de apoyo que utiliza"></td>
   <td width="100" header="Requiere asistencia?"></td>
   <td width="200" header="Persona que asiste"></td>
   <td width="80" header="Necesidades Basicas"></td>
   <td width="200" header="Descripcion Necesidades"></td>
   <td width="80" header="Fecha Fallecimiento"></td>
   <td width="90" header="Coordenadas"></td>
   <td width="80" header="Usuario"></td>
   <td width="80" header="Fecha Actualizaci&oacute;n"></td>
  </template>
 </v-table> 
</v-form>
</template>
<script>
	var axios=window.axios;
	var _=window._;
         export default _.ui({
            data(){return{}},
            created(){
                this.filters.uid=this.user.uid;
            },
            methods:{
                
                upload(o) {
                    axios.post('/api/desarrollo-social/disabled/import/' + o.tempFile).then(function (e) {
                        console.log(e)
                    });
                },
                process(o){
                    delete o.tmpMasterId;
                },
                postSync(o) {
                    var me=this;
                    o=o.data;
                    console.log('verificar si tiene tmpSrc '+JSON.stringify(o));
                    if(o.tmpSrc){
                        fetch(o.tmpSrc).then(r=>r.blob()).then(function(b) {
                            me.submitFile(b,'name.jpeg',function(r){
                                axios.post('/api/desarrollo-social/disabled/change-image',{id:o.id,tmpFile:r.tempFile}).then(function(r){
                                    delete o.tmpSrc;
                                    _.MsgBox(r.data)
                                });
                            });
                        });
                    }
                },
                canRegister(o){
                    var me = this, user = me.user, perms = me.perms;
                    if(o){
                        return user.uid == 1||perms.DESARROLLO_SOCIAL_ADMIN_DISABLED||perms.DESARROLLO_SOCIAL_REGISTER_DISABLED &&o.user == user.id;                        
                    }else
                        return user.uid == 1||perms.DESARROLLO_SOCIAL_ADMIN_DISABLED||perms.DESARROLLO_SOCIAL_REGISTER_DISABLED;
                }
            }
         });
</script>