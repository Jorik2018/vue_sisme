<template>
  <v-form action="/api/desarrollo-social/vea-materno" :header="(o.id ? 'Editar' : 'Crear') + '  Registro VEA Materno'"
    :class="o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
    " store="vea-materno">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset legend="Datos generales" class="v-form">
        <label>Semana:</label>
        <v-number v-model="o.semana" />
        <label>DIRESA:</label>
        <div>ANCASH</div>
        <label>Red:</label>
        <v-select v-model="o.red" ref="red" v-on:input="$refs.microredSelect.load({ Codigo_Red: o.red })"
          :required="true">
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
        <v-select autoload="false" :disabled="!o.red" store="microred" ref="microredSelect" v-model="o.microred"
          :required="true" @input="$refs.establishment.load({ microredCode: '02' + o.microred })">
          <option>Select One...</option>
          <v-options store="microred" display-field="name" value-field="code" />
        </v-select>
        <label>Establecimiento:</label>
        <v-select ref="establishment" @input="inputEstablishment" v-model="o.codigoEESS" :autoload="false"
          :disabled="!o.microred" :required="true">
          <option>Select One...</option>
          <v-options store="establishment" display-field="name" value-field="code" />
        </v-select>
      </v-fieldset>
      <v-fieldset>
        <label>Nº Gestantes captadas antes de las 14 semanas de Gestación:</label>
        <v-number v-model="o.n1" />
        <label>Nº Gestantes con patologías, identificadas:</label>
        <v-number v-model="o.n2" />
        <label>Nº Gestantes evaluadas por médico en 2° atención prenatal:</label>
        <v-number v-model="o.n3" />
        <label>N° Gestantes que recibieron Teleorientacion o Teleinterconsulta:</label>
        <v-number v-model="o.n4" />
        <label>N° Gestantes/puérperas que recibieron vacuna anti COVID-19, registradas:</label>
        <v-number v-model="o.n5" />
        <label>N° gestantes con Dx (+) para COVId-19, con seguimiento:</label>
        <v-number v-model="o.n6" />
        <label>N° Gestantes con FPP de su jurisdicción en la semana:</label>
        <v-number v-model="o.n7" />
        <label>N° de gestantes con entrevista del tercer plan de parto efectivo a traves de visita domiciliaria:</label>
        <v-number v-model="o.n8" />
        <label>N° Gestantes con anemia diagnosticada:</label>
        <v-number v-model="o.n9" />
        <label>N° Gestantes con anemia recuperadas:</label>
        <v-number v-model="o.n10" />
        <label>N° Gestantes con cambio domiciliario reportadas:</label>
        <v-number v-model="o.n11" />
        <label>N° Ambulancias operativas, con sistema de comunicación activo:</label>
        <v-number v-model="o.n12" />
        <label>N° Partos inminentes con monitoreo atendidos en IPRESS de nivel I-1 al I-3:</label>
        <v-number v-model="o.n13" />
        <label>N° Emergencias obstetricas atendidas según guía de EON:</label>
        <v-number v-model="o.n14" />
        <label>N° Emergencias obstetricas referidas:</label>
        <v-number v-model="o.n15" />
        <label>N° Usuarias nuevas en Planificación Familiar :</label>
        <v-number v-model="o.n16" />
      </v-fieldset>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
    </center>
  </v-form>
</template>
<script>
import { Geolocation } from "@capacitor/geolocation";
import "ol/ol.css";
import Feature from "ol/Feature";
import Icon from "ol/style/Icon";
var { _, axios, ol } = window;
ol.style.Icon = Icon;
ol.style.Feature = Feature;
export default _.ui({
  props: ["id"],
  data() {
    return {
      count: 0,
      red: [],
      age: null,
      financiador: [
        "NINGUNA", "SIS", "ESSALUD", "PRIVADA", "PNP"
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        synchronized: null,
        tmpId: null
      },
    };
  },
  computed: {
    filteredEvent() {
      return this.o.category != null
        ? this.event
          .filter((e) => e.category == this.o.category)
          .map((e) => e.type)
          .filter((value, index, self) => self.indexOf(value) === index)
        : [];
    },
    filteredDetailEvent() {
      return this.o.type != null
        ? this.event
          .filter(
            (e) => e.category == this.o.category && e.type == this.o.type
          )
          .map((e) => e.detail)
        : [];
    },
  },
  created() {
    var me = this;
    me.$on("sync", (o) => {
      me.getStoredList("vea-materno").then((items) => {
        items.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            if (e.damage_salud)
              e.damage_salud.forEach((e) => {
                if (o.damage_salud)
                  o.damage_salud.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.cancerId = o.id;
              });
            _.db
              .transaction(["vea-materno"], "readwrite")
              .objectStore("vea-materno")
              .put(e);
          }
        });
      });
    });
  },
  mounted() {
    var me = this;
    me.changeRoute();
  },

  methods: {
    inputEdad() {
      this.o.edad = this.o.fecha_nacimiento ? this.app.getAge(this.o.fecha_nacimiento) : null;
    },
    async printCurrentPosition() {
      this.trayLocation = 1;
      const coordinates = await Geolocation.getCurrentPosition();
      var c = coordinates.coords;
      this.o.lat = c.latitude;
      this.o.lon = c.longitude;
    },
    onInputFUR(o) {
      if (o) {
        o = new Date(o);
        o.setFullYear(o.getFullYear() + 1);
        o.setMonth(o.getMonth() - 3);
        o.setDate(o.getDate() + 7);
      }
      this.o.gestanteFPP = _.toDate(o, "date-");
    },
    inputProvince(a, b) {
      var me = this, o = me.o;
      o.province = (b ? b.object.name || "" : "");
      me.$refs.district.load({ code: o.province_code })
    },
    inputDistrict(a, b) {
      var me = this, o = me.o;
      o.district = b ? b.object.name || "" : "";
      me.$refs.ccpp.load({ id: o.district_code })
    },
    inputCCPP(a, b) {
      this.o.ccpp = b ? b.object.name || "" : "";
    },
    inputEstablishment(a, b) {
      this.o.establecimiento = b ? b.object.name : "";
    },
    process(o) {
      return o;
    },
    mapBuild() {
      var o = this.o;
      if (0 > o.lon) {
        this.$refs.map.addFeature(
          {
            lon: o.lon,
            lat: o.lat,
          },
          {}
        );
      }
    },
    translateend(o) {
      this.o.lat = o.lat;
      this.o.lon = o.lon;
    },
    async addMarker() {
      //var o = this.o;
      var me = this,
        m = me.$refs.map;
      if (!m.collection.getLength()) {
        me.trayLocation = 1;
        const coordinates = await Geolocation.getCurrentPosition();
        var c = coordinates.coords;
        me.o.lat = c.latitude;
        me.o.lon = c.longitude;
        if (m)
          m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
      } else
        m.map.getView().animate({
          center: m.collection.item(0).getGeometry().getCoordinates(),
          zoom: 17,
          duration: 500,
        });
    },
    async changeRoute() {
      var me = this,
        id = me.id, m = me.$refs.map; me.age = 0;
      me.trayLocation = 0;
      if (id < 0) {
        me.getStoredList("vea-materno").then((cancer) => {
          cancer.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              if (m)
                m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              me.$refs.province.load({ code: me.o.region || "02" });
              me.trayLocation = Number(e.lat) && e.lon;
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/desarrollo-social/vea-materno/" + id)
          .then((response) => {
            var o = response.data;
            if (o.red) {
              o.red = me.pad(o.red, 2);
            }
            if (o.microred) {
              o.microred = me.pad(o.microred, 4);
            }
            if (o.province_code) {
              o.province_code = me.pad(o.province_code, 4);
              o.region = o.province_code.substring(0, 2);
            }
            if (o.district_code) o.district_code = me.pad(o.district_code, 6);
            if (o.ccpp_code) o.ccpp_code = me.pad(o.ccpp_code, 10);
            me.trayLocation = 0;
            me.o = o;
            me.age = o.edad;
            if (Number(o.lat) && Number(o.lon)) {
              if (m)
                m.addFeature({ draggable: true, lat: o.lat, lon: o.lon }, { zoom: 14 });
              me.trayLocation = 1;
            }
            me.$refs.province.load({ code: o && o.region || '02' });
          });
      } else {
        try {
          var s = localStorage.getItem("setting");
          if (s) {
            s = JSON.parse(s);
            var o = this.o;
            if (s.region) o.region = s.region.code;
            if (s.province) o.province_code = s.province.code;
            if (s.district) o.district_code = s.district.code;
            if (s.town) o.ccpp_code = s.town.id;
            /*o.town = s.town;*/
          }
        } catch (e) {
          console.log(e);
        }
        me.$refs.province.load({ code: me.o && me.o.region || '02' });
      }
    },
    close(r) {
      var me = this, o = me.o;
      if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
        if (r.data.uploaded) {
          delete o.tempFile;
        }
      }
      var nid = o.tmpId ? -o.tmpId : o.id;
      if (me.id != nid)
        me.$router.replace("/admin/desarrollo-social/vea-materno/" + nid);
    },
    async getCurrentPosition() {
      var me = this;
      //const {Geolocation} = Plugins;
      const c = await Geolocation.getCurrentPosition();
      me.o.lat = c.coords.latitude;
      me.o.lon = c.coords.longitude;
    },
    getCoordinates() {
      var me = this;
      if (me.getCurrentPosition) {
        me.getCurrentPosition();
      } else
        _.getLocation().then(function (c) {
          me.o.lat = c.coords.latitude;
          me.o.lon = c.coords.longitude;
        });
    },
  },
});
</script>