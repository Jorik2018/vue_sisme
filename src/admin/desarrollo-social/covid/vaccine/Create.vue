<template>
  <v-form header="VACUNAS COVID" action="/admin/desarrollo-social/covid">
    <div>
      <v-fieldset legend="BUSQUEDA POR DOCUMENTO IDENTIDAD" class="v-form">
        <v-autocomplete
          placeholder="Ingrese mas de 5 caracteres y presione ENTER"
          ref="peopleAutocomplete"
          v-bind:show-selection="true"
          inputClass="center"
          v-on:input="inputPeople"
          v-bind:params="{ distinct: 1 }"
          minQueryLength="5"
          required="required"
          v-model="o"
          v-on:complete="peopleComplete"
          src="/api/desarrollo-social/covid/vaccine-covid"
        >
          <template v-slot:label="{ selected }">
            <template v-if="selected">
              {{ selected.numDoc }}: {{ selected.paciente }}
            </template>
          </template>
          <template v-slot="{ row }">
            {{ row.numDoc }}: {{ row.paciente }} - {{ row.dosisAplicada }}
            {{ row.fabricanteAbrev }} en {{ row.fechaVacunacion }}
          </template>
        </v-autocomplete>
        <div v-if="!o" class="right" style="margin-top: 10px">
          <v-button
            title="Refrescar"
            icon="fa-sync"
            class="on"
            v-on:click.prevent="$refs.peopleAutocomplete.search()"
          ></v-button>
        </div>
      </v-fieldset>
      <v-fieldset v-if="o" legend="Resultados">
        <div
          v-for="(o, j) in l"
          v-bind:key="j"
          class="v-item"
          style="
            padding: 5px;
            background-color: black;
            color: white;
            line-break: anywhere;
          "
        >
          <label>DOSIS APLICADA</label>
          <div>{{ o.dosisAplicada }} {{ row.fabricanteAbrev }}</div>
          <label>FECHA VACUNACION</label>
          <div>
            {{ o.fechaVacunacion }}
          </div>
        </div>
      </v-fieldset>
    </div>
  </v-form>
</template>
<script>
import Vue from "vue";
//            var axios=window.axios;
export default window.ui({
  data() {
    return { people: null, o: null, l: [] };
  },
  created() {
    this.perms.ADMIN_DESARROLLO_SOCIAL_SID = true;
  },
  computed: {},
  mounted() {
    var me = this;
    setTimeout(function () {
      me.app.title = me.$children[0].header;
    }, 200);
  },
  methods: {
    dateDiff(f) {
      var r = "";
      if (f) {
        var r2 = Vue.dateDiff(new Date(f), new Date());
        if (r2.ans) r += r2.ans + " AÑOS ";
        if (r2.meses) r += r2.meses + " MESES ";
        if (r2.dias) r += r2.dias + " DIAS ";
      }
      return r;
    },
    peopleComplete(e) {
      if (e.data && e.data.length == 1) {
        e.setSelected(e.data[0]);
      } else if (e.data && e.data.length == 0) {
        //e.setSelected(null, true);
      }
    },
    inputPeople() {
      var me = this;
      me.l = [me.o];
    },
  },
});
</script>
<style scoped>
.v-item {
  margin-bottom: 10px;
}
.v-item:last-child {
  margin-bottom: 0px;
}
.v-fieldset > div {
  width: auto;
}
</style>