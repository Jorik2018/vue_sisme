<template>
	<v-form id="SidList" header="SID" action="/admin/desarrollo-social/sid"> 
 <v-table v-bind:selectable="true" v-bind:scrollable="true" rowKey="id" src="/api/desarrollo-social/sid" v-bind:pagination="20" v-bind:filters="filters" v-on:row-select="rowSelectedCount=getRowSelectedCount()"> 
  <template v-slot:header=""> <v-button icon="fa-plus" v-on:click.prevent="create" class="on" v-if="true" value="Crear"></v-button> <v-button icon="fa-pen" v-on:click.prevent="edit" v-if="true" v-bind:disabled="rowSelectedCount==0" value="Editar"></v-button> <v-button icon="fa-trash" v-on:click.prevent="destroy" v-if="true" v-bind:disabled="rowSelectedCount==0" value="Eliminar"></v-button> <v-button icon="fa-download" v-on:click.prevent="get('download')" value="Descargar"></v-button> <v-button v-on:click.prevent="refresh" title="Refrescar" icon="fa-sync"></v-button> 
  </template> 
  <template v-slot:default="{row}"> 
   <td width="100" label="Representante Familia" class="center">  {{row.people}} </td> 
   <td width="100" label="Codigo Familia" class="center">  {{row.sidIdfamilia}} </td> 
   <td width="160" class="center" label="Provincia">  {{row.ext?row.ext[3]:''}} </td> 
   <td width="160" class="center" label="Distrito">  {{row.ext?row.ext[1]:''}} </td> 
   <td width="200" label="Direcci&oacute;n">  {{row.address}} </td> 
   <td width="100" class="center" label="EESS">  {{row.eess}} </td> 
   <td width="200" label="Referencia">  {{row.reference}} </td> 
   <td width="100" class="center" label="Varones"> {{row.men}} </td> 
   <td width="100" class="center" label="Mujeres"> {{row.women}} </td> 
   <td width="100" class="center" label="&iquest;Consumen agua clorada?"> {{row.aClorada}} </td> 
   <td width="100" class="center" label="&iquest;La almacenan en dep&oacute;sitos limpios y con tapa?"> {{row.aAlmacenada}} </td> 
   <td width="100" class="center" label="&iquest;Sacan el agua almacenada sin contaminarla (en jarra)?"> {{row.aSacan}} </td> 
   <td width="100" class="center" label="&iquest;Utilizan el agua directamente del ca&ntilde;o?"> {{row.aguaCano}} </td> 
   <td width="100" class="center" label="&iquest;La batea est&aacute; limpia y funcionando?"> {{row.aBatea}} </td> 
   <td width="100" class="center" label="&iquest;Las personas est&aacute;n aseadas?"> {{row.hAseadas}} </td> 
   <td width="200" class="center" label="&iquest;Lavado de manos?"> {{row.hLavada}} </td> 
   <td width="100" class="center" label="&iquest;Tiene letrinas o ba&ntilde;o?"> {{row.lTiene}} </td> 
   <td width="100" class="center" label="&iquest;La letrina o ba&ntilde;o esta limpio?"> {{row.lLimpio}} </td> 
   <td width="100" class="center" label="&iquest;Usan la letrina o ba&ntilde;o?"> {{row.lUsan}} </td> 
   <td width="100" class="center" label="&iquest;Se lavan las manos despu�s de usarla?"> {{row.lLavan}} </td> 
   <td width="100" class="center" label="&iquest;La cocina est&aacute; limpia y ordenado?"> {{row.vLimpia}} </td> 
   <td width="100" class="center" label="&iquest;Los utensilios de cocina estan limpios y rotegidos?"> {{row.vProtegidos}} </td> 
   <td width="100" class="center" label="&iquest;Usan el corral para los animales mayores y menores?"> {{row.vAnimales}} </td> 
   <td width="100" class="center" label="&iquest;El patio y alrededor de la vivienda est&aacute; limpia?"> {{row.vPatio}} </td> 
   <td width="100" class="center" label="&iquest;Entierran la basura o la echan en el microrrelleno sanitario?"> {{row.dEntierran}} </td> 
   <td width="100" class="center" label="&iquest;Se present&oacute; diarrea en menores de 5 a&ntilde;os?"> {{row.eMenores}} </td> 
   <td width="100" class="center" label="N&deg; de casos"> {{row.edaCasomen}} </td> 
   <td width="100" class="center" label="&iquest;Se present&oacute; diarrea en mayores de 5 a&ntilde;os?"> {{row.eMayores}} </td> 
   <td width="100" class="center" label="N&deg; de casos"> {{row.edaCasomay}} </td> 
   <td width="100" class="center" label="&iquest;Se presentaron enfermedades de la piel en menores de 5 a&ntilde;os?"> {{row.pMenores}} </td> 
   <td width="100" class="center" label="EpCasomen"> {{row.epCasomen}} </td> 
   <td width="100" class="center" label="&iquest;Se presentaron enfermedades de la piel en mayores de 5 a&ntilde;os?"> {{row.pMayores}} </td> 
   <td width="100" class="center" label="N&deg; de casos"> {{row.epCasomay}} </td> 
   <td width="100" class="center" label="SidRegistro"> {{row.sidRegistro|date}} </td> 
   <td width="100" class="center" label="Usuario"> {{row.user}} </td> 
  </template> 
  <template v-slot:filters="">
   <v-filter index="0"> 
    <input v-model="filters.personal" /> 
   </v-filter><v-filter index="1"> 
    <input v-model="filters.familly" /> 
   </v-filter><v-filter index="2"> 
    <v-select v-model="filters.province" index="3" v-on:input="$refs.districtSelect.load({provinceId:filters.province})"> 
     <option value="">Select One...</option> 
     <v-options url="/api/directory/province/0/0?regionId=2" value-field="code" display-field="name"></v-options> 
    </v-select> 
   </v-filter><v-filter index="3"> 
    <v-select v-model="filters.district" v-bind:disabled="!filters.province" index="4"> 
     <option value="">Select One...</option> 
     <v-options url="/api/directory/district/0/0" value-field="code" ref="districtSelect" display-field="name"></v-options> 
    </v-select> 
   </v-filter><v-filter index="4"> 
    <input v-model="filters.address" /> 
   </v-filter><v-filter index="5"> 
    <input v-model="filters.eess" /> 
   </v-filter><v-filter index="6"> 
    <input v-model="filters.reference" /> 
   </v-filter>
  </template>
  <template v-slot:columns="">
   <td width="100" label="Representante Familia"></td>
   <td width="100" label="Codigo Familia"></td>
   <td width="160" label="Provincia"></td>
   <td width="160" label="Distrito"></td>
   <td width="200" label="Direcci&oacute;n"></td>
   <td width="100" label="EESS"></td>
   <td width="200" label="Referencia"></td>
   <td width="100" label="Varones"></td>
   <td width="100" label="Mujeres"></td>
   <td width="100" label="&iquest;Consumen agua clorada?"></td>
   <td width="100" label="&iquest;La almacenan en dep&oacute;sitos limpios y con tapa?"></td>
   <td width="100" label="&iquest;Sacan el agua almacenada sin contaminarla (en jarra)?"></td>
   <td width="100" label="&iquest;Utilizan el agua directamente del ca&ntilde;o?"></td>
   <td width="100" label="&iquest;La batea est&aacute; limpia y funcionando?"></td>
   <td width="100" label="&iquest;Las personas est&aacute;n aseadas?"></td>
   <td width="200" label="&iquest;Lavado de manos?"></td>
   <td width="100" label="&iquest;Tiene letrinas o ba&ntilde;o?"></td>
   <td width="100" label="&iquest;La letrina o ba&ntilde;o esta limpio?"></td>
   <td width="100" label="&iquest;Usan la letrina o ba&ntilde;o?"></td>
   <td width="100" label="&iquest;Se lavan las manos despu�s de usarla?"></td>
   <td width="100" label="&iquest;La cocina est&aacute; limpia y ordenado?"></td>
   <td width="100" label="&iquest;Los utensilios de cocina estan limpios y rotegidos?"></td>
   <td width="100" label="&iquest;Usan el corral para los animales mayores y menores?"></td>
   <td width="100" label="&iquest;El patio y alrededor de la vivienda est&aacute; limpia?"></td>
   <td width="100" label="&iquest;Entierran la basura o la echan en el microrrelleno sanitario?"></td>
   <td width="100" label="&iquest;Se present&oacute; diarrea en menores de 5 a&ntilde;os?"></td>
   <td width="100" label="N&deg; de casos"></td>
   <td width="100" label="&iquest;Se present&oacute; diarrea en mayores de 5 a&ntilde;os?"></td>
   <td width="100" label="N&deg; de casos"></td>
   <td width="100" label="&iquest;Se presentaron enfermedades de la piel en menores de 5 a&ntilde;os?"></td>
   <td width="100" label="EpCasomen"></td>
   <td width="100" label="&iquest;Se presentaron enfermedades de la piel en mayores de 5 a&ntilde;os?"></td>
   <td width="100" label="N&deg; de casos"></td>
   <td width="100" label="SidRegistro"></td>
   <td width="100" label="Usuario"></td>
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