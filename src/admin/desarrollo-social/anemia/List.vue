<template>
	<v-form id="DsSeguimientoDetList" header="Control de Anemia" action="/admin/desarrollo-social/anemia"> 
 <v-table v-bind:selectable="true" v-bind:scrollable="true" rowKey="id" v-bind:pagination="20" src="/api/desarrollo-social/hemoglobin" v-bind:filters="filters" v-on:row-select="rowSelectedCount=getRowSelectedCount()"> 
  <template v-slot:header=""> <v-button value="Crear" v-if="true" icon="fa-plus" class="on" v-on:click.prevent="create"></v-button> <v-button value="Editar" v-if="true" icon="fa-pen" v-on:click.prevent="edit" v-bind:disabled="rowSelectedCount==0"></v-button> <v-button value="Eliminar" v-if="true" icon="fa-trash" v-on:click.prevent="destroy" v-bind:disabled="rowSelectedCount==0"></v-button> <v-button title="Refrescar" icon="fa-sync" class="on" v-on:click.prevent="refresh"></v-button> 
  </template> 
  <template v-slot:default="{row}"> 
   <td width="80" class="center" label="Dni">  {{row.pk.peopleId}} </td> 
   <td width="80" class="center" label="Fecha Resultado"> {{row.pk.resultDate|date}} </td> 
   <td width="100" class="right" label="Altura"> {{row.height}} </td> 
   <td width="100" class="right" label="Peso"> {{row.weight}} </td> 
   <td width="100" class="right" label="Hemoglobin"> {{row.hemoglobin}} </td> 
   <td width="80" class="center" label="Fecha Nacimiento"> {{row.birthDate|date}} </td> 
   <td width="260" class="center" label="Coordenadas"> 
    <template v-if="row.lat&amp;&amp;row.lat!=0">
      ({{row.lat}},{{row.lon}}) 
    </template> </td> 
   <td width="80" class="center" label="Usuario"> {{row.user}} </td> 
  </template> 
  <template v-slot:filters="">
   <v-filter index="0"> 
    <input class="center" v-model="filters.peopleId" /> 
   </v-filter>
  </template>
  <template v-slot:columns="">
   <td width="80" label="Dni"></td>
   <td width="80" label="Fecha Resultado"></td>
   <td width="100" label="Altura"></td>
   <td width="100" label="Peso"></td>
   <td width="100" label="Hemoglobin"></td>
   <td width="80" label="Fecha Nacimiento"></td>
   <td width="260" label="Coordenadas"></td>
   <td width="80" label="Usuario"></td>
  </template>
 </v-table> 
</v-form>
</template>
<script>
	export default {
        extends:window._.extends,
        created(){this.filters.user=this.app.session.id;},
        mounted(){this.app.title=this.$children[0].header;}
    }
</script>