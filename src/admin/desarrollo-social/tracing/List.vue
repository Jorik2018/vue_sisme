<template>
	<v-form id="DsSeguimientoDetList" header="Seguimiento Socioecon&oacute;mico" action="/admin/desarrollo-social/tracing"> 
 <v-table v-bind:selectable="true" v-bind:scrollable="true" rowKey="id" v-on:synchronized="postSync" storage="tracing" v-bind:pagination="20" 
 row-style-class="row.tmpSynchronized?'green':(row.tmpId>0?'yellow':'')" src="/api/desarrollo-social/tracing" v-bind:filters="filters"> 
  <template v-slot:header=""> <v-button value="Crear" v-if="canRegister()" icon="fa-plus" class="on" v-on:click.prevent="create"></v-button> <v-button value="Editar" v-if="canRegister()" icon="fa-pen" v-on:click.prevent="edit" v-bind:disabled="!rowSelectedCount"></v-button> <v-button value="Agregar Persona" v-if="canRegister()" icon="fa-user-plus" v-on:click.prevent="add(getSelected())" v-bind:disabled="rowSelectedCount==0||!canRegister(getSelected()[0])"></v-button> <v-button value="Eliminar" v-if="canRegister()" icon="fa-trash" v-on:click.prevent="destroy" v-bind:disabled="!rowSelectedCount"></v-button> <v-button value="Descargar" icon="fa-download" v-if="perms.ADMIN_DESARROLLO_SOCIAL||user.uid==1" v-on:click.prevent="download"></v-button> <v-button title="Refrescar" icon="fa-sync" class="on" v-on:click.prevent="refresh"></v-button> <v-button title="Enviar al Servidor" v-if="online" icon="fa-database" class="on" v-on:click.prevent="sync"></v-button> <v-button value="Empadronamiento" v-if="online" icon="fa-user-friends" class="on" v-on:click.prevent="census"></v-button> 
  </template> 
  <template v-slot:default="{row}"> 
   <td width="80" class="center" v-bind:class="{'yellow':0>row.id}" header="ID">  {{row.id&gt;0?pad(row.id,6):'?'}} </td> 
   <td width="200" header="Provincia" v-bind:title="row.ext?row.ext[0]:''">  {{row.ext?row.ext[1]:row.province}} </td> 
   <td width="200" header="Distrito" v-bind:title="row.ext?row.ext[2]:''">  {{row.ext?row.ext[3]:row.district}} </td> 
   <td width="200" header="Poblado">  {{row.localityName?row.localityName:row.locality}} </td> 
   <td width="200" header="Direcci&oacute;n">  {{row.address}} </td> 
   <td width="50" class="center" header="C&oacute;digo Casa">  {{row.houseCode}} </td> 
   <td width="80" class="center" header="Condici&oacute;n Vivienda">  {{row.houseCondition}} 
    <template v-if="row.houseConditionName">
      : {{row.houseConditionName}} 
    </template> </td> 
   <td width="80" class="center" header="DNI Jefe">  {{row.dni}} </td> 
   <td width="200" header="Programas Sociales">  {{row.socialPrograms}} </td> 
   <td width="200" header="Programas Municipales">  {{row.municipalPrograms?row.municipalPrograms.replace(/[|]/g,", "):''}} </td> 
   <td width="100" class="center" header="Conectividad">  {{row.connectivity?'SI':'NO'}} </td> 
   <td width="100" header="Operador Telefonico">  {{row.phoneOperator?row.phoneOperator.replace(/[|]/g,", "):''}} </td> 
   <td width="100" class="center" header="Tipo de SS.HH">  {{row.sshhType}} </td> 
   <td width="90" class="center" header="Coordenadas">  {{0&gt;row.lat?'SI':'NO'}} </td> 
   <td width="80" class="center" header="Usuario">  {{row.user}} </td> 
   <td width="80" class="center" header="Fecha Creaci&oacute;n">  {{row.createDate|date}} </td> 
   <td width="80" class="center" header="Fecha Actualizaci&oacute;n">  {{row.updateDate|date}} </td> 
  </template>
  <template v-slot:columns="">
   <td width="80" header="ID"></td>
   <td width="200" header="Provincia"></td>
   <td width="200" header="Distrito"></td>
   <td width="200" header="Poblado"></td>
   <td width="200" header="Direcci&oacute;n"></td>
   <td width="50" header="C&oacute;digo Casa"></td>
   <td width="80" header="Condici&oacute;n Vivienda"></td>
   <td width="80" header="DNI Jefe"></td>
   <td width="200" header="Programas Sociales"></td>
   <td width="200" header="Programas Municipales"></td>
   <td width="100" header="Conectividad"></td>
   <td width="100" header="Operador Telefonico"></td>
   <td width="100" header="Tipo de SS.HH"></td>
   <td width="90" header="Coordenadas"></td>
   <td width="80" header="Usuario"></td>
   <td width="80" header="Fecha Creaci&oacute;n"></td>
   <td width="80" header="Fecha Actualizaci&oacute;n"></td>
  </template>
 </v-table> 
 <div style="display:none ;text-align: initial;margin-bottom: 20px"> 
  <div id="downloadDlg" class="v-form"> <label>Tipo de Archivo:</label> <v-radio-group v-model="option"> 
    <v-radio value="PDF"></v-radio> 
    <v-radio value="XLS"></v-radio> 
   </v-radio-group> 
  </div> 
 </div> 
</v-form>
</template>
<script>
	import 'ol/ol.css';
    var {_,axios}=window;
    var MsgBox=_.MsgBox;
    export default _.ui({
        created(){
            this.filters.user=this.app.session.id;
            this.filters.uid=this.user.uid;
            this.perms.DESARROLLO_SOCIAL_ADMIN_TRACING=true;
        },
        methods: {
            download(){
                var me=this,o={format:me.option.toLowerCase(),filename:'tracing.'+me.option.toLowerCase()};
                MsgBox(document.querySelector('#downloadDlg'),function(b){
                    if(b==0){
                        _.download('/api/desarrollo-social/tracing/download',o);
                    }
                },['Descargar','Cancelar']);
            },
            census(){
                window.location.href = "/admin/desarrollo-social/census/";
            },
            canRegister(o) {
                var me = this, user = me.user, perms = me.perms;
                        return user.uid == 1 || perms.ADMIN_DESARROLLO_SOCIAL || o &&
                perms.DESARROLLO_SOCIAL_REGISTER_TRACING &&
                o.user == user.id;
            },
            postSync(o) {
                console.log(o);
                var census = JSON.parse(localStorage.getItem('census'));
                console.log(census);
                if (census) {
                    for (var i = 0; census.length > i; i++) {
                        if (Number(census[i].masterId) == o.data.id)
                            census[i].masterId = o.result.id;
                    }
                    localStorage.setItem('census', JSON.stringify(census));
                }
            },
            canSync(o) {
                var me = this, user = me.user;
                        return o &&
                o.user == user.id &&
                o.tmpId;
            },
            add(o) {
                var me = this, action = '/admin/desarrollo-social/census';
                if (me.app.$router)
                    me.app.$router.push(_.currentPath = action + '/' + o[0].id + '.' + (Number(o[0].dni)?o[0].dni:'') + '/add');
                else
                    axios.get(((_.currentPath = action + '/' + o[0].id + '.' + o[0].dni + '/add') + '?modal').replace(/([^:]\/)\/+/g, "$1")).then(me.open).catch(me.error);
            }
        },
        data(){return{option:'XLS'}}
    });
</script>