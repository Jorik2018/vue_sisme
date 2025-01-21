<template>
  <v-form
    action="/api/desarrollo-social/emed/damage-salud"
    store="emed_damage_salud"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Daño Salud'"
  >
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emedId || 0, 4) }}</div>
      <label>DNI:</label>
      <v-number class="center" v-model="o.code"/>
      <label>Apellidos y Nombres:</label>
      <input maxlength="100" v-model="o.nombre_completo"/>
      <label>Edad:</label>
      <input v-model="o.edad"/>
      <label>Diagnóstico:</label>
      <v-textarea v-model="o.diagnostico"/>
      <label>Gravedad:</label>
      <v-select v-model="o.gravedad" required="required">
          <option value="">Select One...</option>
          <option v-for="type in ['LEVE', 'MODERADO', 'GRAVE', 'FALLECIDO']" :key="type" :value="type">
            {{ type }}
          </option>
        </v-select>
      <label>Situación:</label>
      <v-select v-model="o.situacion" required="required">
          <option value="">Select One...</option>
          <option v-for="type in ['ALTA', 'HOSPITALIZADO', 'REFERIDO', 'FALLECIDO', 'DESAPARECIDO', 'EN OBSERVACION', 'PARA EVALUAR']" :key="type" :value="type">
            {{ type }}
          </option>
        </v-select>
      <label>Observación:</label>
      <v-textarea v-model="o.observacion"/>
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
      o: { emedId: null,type: null },
    };
  },
  methods: {
    render() {
      var me = this,
        id = me.id,
        action = me.action;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id};
          me.filters.emed = id;
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.damage_salud.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_damage_salud", p.damage_salud);
                    if (!v.lat) v.lat = null;
                    if (!v.lon) v.lon = null;
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/damage-salud/" + id)
              .then(function (response) {
                me.filters.emed = response.data.emedId;
                me.o = response.data;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id};
        me.filters.emed = id;
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
          if ((o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||e.id == o.emedId) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) 
                e.damage_salud[i] = o;
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
            e.damage_salud = data;
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
    me.render();
  },
});
</script>