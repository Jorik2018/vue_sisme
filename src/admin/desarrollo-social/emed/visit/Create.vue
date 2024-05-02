<template>
  <v-form
    action="/api/desarrollo-social/pregnant/visit"
    store="pregnant_visit"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Visita'"
  >
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>Gestante:</label>
      <div>{{ pad(o.pregnantId || 0, 4) }}</div>
      <label>Numbero:</label>
      <div>{{ pad(o.number || 0, 2) }}</div>
      <label>Fecha:</label>
      <v-calendar v-model="o.fechaVisita"></v-calendar>
      <label>Fecha Prox. Visita:</label>
      <v-calendar v-model="o.fechaProxVisita"></v-calendar>
      <label>Detalle:</label>
      <v-textarea v-model="o.detalle"></v-textarea>
      <v-fieldset legend="Coordenadas" style="width: auto">
        <div class="right">
          <v-button
            icon="fa-compass"
            value="Obtener Geolocalización"
            v-on:click="printCurrentPosition"
          />
        </div>
        <div
          class="center"
          v-if="(o.lat && o.lat != 0) || (o.lon && o.lon != 0) || trayLocation"
          style="
            margin-top: 10px;
            border: 1px solid #ffcf00;
            background-color: #ffff80;
            padding: 10px;
          "
        >
          ({{ o.lat }},{{ o.lon }})
        </div>
      </v-fieldset>
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
import { Geolocation } from "@capacitor/geolocation";
var axios = window.axios;
var _ = window._;
export default _.ui({
  props: ["id", "action"],
  data() {
    return {
      type: [
        {
          id: "P",
          name: "SALUD INDIVIDUAL",
          decription:
            "Comprende los paquetes de atención integral por etapas de vida",
        },
        {
          id: "F",
          name: "FUNCIONES DE LA FAMILIA",
          decription:
            "Comprende las funciones básicas: cuidado, afecto, expresi�n de sexualidad, socializaci�n estatus social y las funciones seg�n seg�n sus relaciones internas: comunicaci�n, cohesi�n, permeabilidad, rol, adaptabilidad y armon�a)",
        },
        {
          id: "V",
          name: "CODICIONES MATERIALES DE VIDA Y ENTORNO",
          decription:
            "Comprende las caracteristicas de la vivienda, eliminaci�n de excretas, tenencia de animales, aguas estancadas, vectores, pandillaje y otros alrededor de la vivienda",
        },
      ],
      trayLocation: null,
      o: { pregnantId: null,number:null, lat: null, lon: null, type: null, ext: {} },
    };
  },
  methods: {
    render() {
      var me = this,
        id = me.id,
        action = me.action;
      me.trayLocation = 0;
      if (Number(id)) {
        if (action == "add") {
          me.o = { pregnantId: id, ext: {}, lat: null, lon: null ,number:null};
          if(me.app.connected)
          axios
            .get(
              "/api/desarrollo-social/pregnant/" + id + "/visit/number"
            )
            .then((result) => {
              me.o.number = result.data;
            });
          me.filters.pregnantId = id;
        } else {
          if (id < 0) {
            me.getStoredList("pregnant").then((pregnants) => {
              pregnants.forEach((p) => {
                p.visits.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("pregnant_visit", p.visits);
                    if (!v.lat) v.lat = null;
                    if (!v.lon) v.lon = null;
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/pregnant/visit/" + id)
              .then(function (response) {
                me.filters.pregnantId = response.data.pregnantId;
                me.o = response.data;
              });
        }
      } else if (action == "add") {
        me.o = { pregnantId: id, log: null, lat: null, ext: {} };
        me.filters.pregnantId = id;
        axios
          .get("/api/desarrollo-social/pregnant/" + id + "/visit/number")
          .then((result) => {
            me.o.number = result.data;
          });
      }
    },
    process(o) {
      if (!this.trayLocation && !(o.id && o.lat)) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    async printCurrentPosition() {
      this.trayLocation = 1;
      const coordinates = await Geolocation.getCurrentPosition();
      var c = coordinates.coords;
      this.o.lat = c.latitude;
      this.o.lon = c.longitude;
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
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (
            (o.pregnantId < 0 && e.tmpId == Math.abs(o.pregnantId)) ||
            e.id == o.pregnantId
          ) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) e.visit[i] = o;
            });
            window._.db
              .transaction(["pregnant"], "readwrite")
              .objectStore("pregnant")
              .put(e);
          }
        });
      });
    });
    this.$on("stored", (o, data) => {
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (
            (o.pregnantId < 0 && e.tmpId == Math.abs(o.pregnantId)) ||
            e.id == o.pregnantId
          ) {
            e.visits = data;
            delete e.synchronized;
            window._.db
              .transaction(["pregnant"], "readwrite")
              .objectStore("pregnant")
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