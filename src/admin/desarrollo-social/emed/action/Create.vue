<template>
  <v-form
    action="/api/desarrollo-social/emed/action"
    store="emed_action"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Acción'"
  >
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emedId || 0, 4) }}</div>
      <label>Fecha:</label>
      <v-calendar v-model="o.fecha"/>
      <label>Hora:</label>
      <v-calendar type="time" v-model="o.hora"/>
      <label>Descripción:</label>
      <v-textarea v-model="o.descripcion"/>
    </div>
    <center>
      <v-button
        value="Grabar"
        icon="fa-save" 
        v-on:click.prevent="save"
      ></v-button>
    </center>
  </v-form>
</template>
<script>
var {_,axios} = window;
export default _.ui({
  props: ["id", "action"],
  data() {
    return {
      keep:0,
      o: { emedId: null,type: null },
    };
  },
  methods: {
    changeRoute() {
      var me = this,
        id = me.id,
        action = me.action;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id };
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.action.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_action", p.actions);
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/action/" + id)
              .then(function (response) {
                me.filters.emedId = response.data.emedId;
                me.o = response.data;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id };
      }
    },
    close(r) {
      var me = this;
      if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
      }
      me.$router.back();
    },
  },
  created() {
    var me = this;
    this.$on("sync", (data, o) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.action.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) e.action[i] = o;
            });
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    this.$on("stored", (o, data) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.action = data;
            delete e.synchronized;
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    
  },
  mounted() {
    var me=this;
    if (me.$children[0]) me.app.title = me.$children[0].header;
    me.changeRoute();
  },
});
</script>