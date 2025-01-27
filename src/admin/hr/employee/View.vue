<template>
  <v-form :header="o.code?('Empleado: '+o.code+' - '+o.fullName):'...' " action="/api/hr/employee">
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
    </div>
    <center>
      <v-button style="margin-left: 10px" value="Editar" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/hr/employee/' + (o.tmpId ? -o.tmpId : o.id)+'/edit'
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
      o: {
        id: null
      },
    };
  },
  mounted() {
    this.changeRoute();
  },
  methods: {
    changeRoute() {
      const id = this.id;
      if (id) {
        axios
          .get("/api/hr/employee/" + id)
          .then(({ data }) => {
            this.o=data;
          });
      }
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