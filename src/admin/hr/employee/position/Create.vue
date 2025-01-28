<template>
  <v-form :header="(o.id?'Editar':'Agregar')+' Cargo'" action="/api/hr/experience">
    <div class="v-form">
      <label>Employee:</label>
      <div>{{ people.fullName }}</div>
      <label>Fecha Ini:</label>
      <v-calendar v-model="o.startDate" required="true" />
      <label>Cargo:</label>
      <input v-model="o.position" class="ucase" required="true" />
      <label>Area:</label>
      <input v-model="o.dependency" required="true" />
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
    </center>
  </v-form>
</template>
<script>
var { _, axios } = window;
export default _.ui({
  props: ["employee","id"],
  data() {
    return {
      o: {
        id: null
      },
      people:{fullName:null}
    };
  },
  mounted() {
    this.changeRoute();
  },
  methods: {
    close(r) {
      const me = this;
      console.log(r);
      /*if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
      }*/
      me.$router.back();
    },
    changeRoute() {
      const id = this.id;
      if (id) {
        axios
          .get("/api/hr/experience/" + id)
          .then(({ data }) => {
            this.o = data;
            this.people=data.people;
          });
      } else {
        axios
          .get("/api/hr/employee/" + this.employee)
          .then(({ data }) => {
            this.people.fullName=data.fullName;
            this.o={employeeId: data.id};
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