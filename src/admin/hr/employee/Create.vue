<template>
    <v-form header="Crear Empleado" action="/api/hr/employee">
        <div class="v-form">
            <label>DNI:</label>
            <input v-model="o.code" required="true" class="center" type="number"/>
            <label>Nombres:</label>
            <input v-model="o.names" class="ucase" required="true" />
            <label>Ap. Paterno:</label>
            <input v-model="o.firstSurname" required="true" />
            <label>Ap. Materno:</label>
            <input v-model="o.lastSurname" required="true" />
            <label>RUC:</label>
            <input v-model="o.ruc" class="center" />
        </div>
        <center>
      <v-button
        value="Grabar"
        icon="fa-save"
        class="blue"
        @click.prevent="save"
      ></v-button>
      <v-button
        style="margin-left: 10px"
        value="Ver"
        :disabled="!o.id"
        icon="fa-eye"
        class="blue"
        @click.prevent="
          $router.replace(
            '/admin/hr/employee/' + (o.tmpId ? -o.tmpId : o.id)
          )
        "
      ></v-button>
    </center>
    </v-form>
</template>
<script>
var {_} = window;
export default _.ui({
    props: ["id"],
    data() {
        return {
            o: {
                id: null
            },
        };
    },
    methods: {
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