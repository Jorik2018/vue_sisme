<template>
  <v-form header="Agregar Cargo" action="/api/hr/employee">
    <div class="v-form">
      <label>Fecha Ini:</label>
      <v-calendar v-model="o.startDate" required="true" />
      <label>Cargo:</label>
      <input v-model="o.position" class="ucase" required="true" />
      <label>Area:</label>
      <input v-model="o.dependency" required="true" />
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
      <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
        $router.replace(
          '/admin/hr/employee/' + (o.tmpId ? -o.tmpId : o.id)
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