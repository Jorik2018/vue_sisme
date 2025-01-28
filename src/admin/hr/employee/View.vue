<template>
  <v-form :header="o.code ? ('Empleado: ' + o.code + ' - ' + o.fullName) : '...'" action="/api/hr/employee">
    <div class="v-form">
      <label>DNI:</label>
      <div>{{ o.code }}</div>
      <label>Nombres:</label>
      <div>{{ o.names }}</div>
      <label>Ap. Paterno:</label>
      <div>{{ o.firstSurname }}</div>
      <label>Ap. Materno:</label>
      <div>{{ o.lastSurname }}</div>
      <label>RUC:</label>
      <div>{{ o.ruc }}</div>
      <v-fieldset legend="Cargos">
        <v-table autoload="false" :key="tkey" src="/api/hr/employee/position/0/0"
          :style="{ maxHeight: maxHeight }" :scrollable="true" :value="o.experience"
          @row-select="selections.position = $event.current" selectable="false"
          ref="position" :filters="filters" >
          <template v-slot:default="{ row, index }">
            <td header="N°" class="center" width="40">
              {{ pad(index + 1, 2) }}
            </td>
            <td header="Cargo" width="200">
              {{ row.position }}
            </td>
            <td header="Area" width="250">
              {{ row.dependency }}
            </td>
          </template>
        </v-table>

        <div class="right" style="margin-top: 10px">
          <v-button icon="fa-trash" :disabled="!selections.position" @click="destroy"></v-button>
          <v-button icon="fa-pen" :disabled="!selections.position" @click="edit"></v-button>
          <v-button icon="fa-plus" @click="add('position', o)"></v-button>
        </div>
      </v-fieldset>
    </div>
    <center>
      <v-button style="margin-left: 10px" value="Editar" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/hr/employee/' + (o.tmpId ? -o.tmpId : o.id) + '/edit'
        )
        "></v-button>
    </center>
  </v-form>
</template>
<script>
var { _, axios } = window;
export default _.ui({
  props: ["id"],
  data() {
    return {
      tkey:0,
      selections: { position: null },
      maxHeight: '400px',
      o: {
        id: null,
        experience:[]
      },
    };
  },
  mounted() {
    this.changeRoute();
  },
  methods: {
    add(table, o) {
      this.open(
        "/admin/hr/employee/" + o.id + "/position/create",
        this.$refs[table].load
      );
    },
    loadTables() {
      var refs = this.$refs;
      for (var e in refs) {
        if (refs[e] && refs[e].load) refs[e].load();
      }
    },
    changeRoute() {
      const id = this.id;
      if (id) {
        axios
          .get("/api/hr/employee/" + id)
          .then(({ data }) => {
            this.o = data;
            this.tkey++;
          });
      }
    },
    rewrite(url){
        return '/admin'+url;
    }
  },
});
</script>
<style scoped>
.xyz {
  padding: 0px !important;
}

.xyz>a {
  padding: 10px;
  background-color: #e1f8ff;
  border: 1px solid gray;
  margin-top: 10px;
  display: block;
}
</style>