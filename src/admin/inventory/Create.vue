<template>
  <v-form action="/api/inventory/item" :header="(o.id ? 'Editar' : 'Crear') + '  Item'" :class="o.id < 0 || (o.tmpId && !o.synchronized)
    ? 'yellow'
    : o.tmpId
      ? 'green'
      : ''
    " store="cancer">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset legend="DATOS USUARIO" class="v-form">
        <label>Usuario Responsable:</label>
        <input v-model="o.usuario_responsable" />
        <label>Modalidad:</label>
        <v-radio-group required="true" v-model="o.usuario_modalidad">
          <v-radio value="CAS"></v-radio>
          <v-radio value="LOCADOR"></v-radio>
        </v-radio-group>
        <label>Departamento/Área:</label>
        <v-select v-model="o.usuario_area">
          <option value="">Select One...</option>
          <option v-for="item in usuario_area" :key="item.name" :value="item.name">
            {{ (item.type=='U'||item.type=='S')?'&emsp;&emsp; ':'' }} {{ item.name }}
          </option>
        </v-select>
        <label>Ubicación:</label>
        <v-select v-model="o.usuario_ubicacion" required="required">
          <option value="">Select One...</option>
          <option v-for="item in usuario_ubicacion" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
      </v-fieldset>
      <v-fieldset legend="DATOS DEL EQUIPO / ACCESORIO" class="v-form">
        <label>Código Patrimonial:</label>
        <input v-model="o.codigo_patrimonial" class="center" />
        <label>Código Inventerio:</label>
        <input v-model="o.codigo_inventario" />
        <label>Tipo de Equipo / Accesorio:</label>
        <v-select v-model="o.tipo_equipo_accesorio" required="required">
          <option value="">Select One...</option>
          <option v-for="item in financiador" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
        <label>Marca:</label>
        <input v-model="o.marca" />
        <label>Modelo:</label>
        <input v-model="o.modelo" />
      </v-fieldset>
      <v-fieldset legend="PROCESADOR" class="v-form">
        <label>Nombre:</label>
        <input v-model="o.procesador_nombre" />
        <label>Generación:</label>
        <input v-model="o.procesador_generacion" />
      </v-fieldset>
      <v-fieldset legend="MEMORIA" class="v-form">
        <label>Capacidad:</label>
        <v-number v-model="o.memoria_capacidad" />
        <label>Tipo:</label>
        <input v-model="o.memoria_tipo" />
      </v-fieldset>
      <v-fieldset legend="ALMACENAMIENTO" class="v-form">
        <label>Capacidad:</label>
        <input v-model="o.almacenamiento_capacidad" />
        <label>Tipo:</label>
        <input v-model="o.almacenamiento_tipo" />
      </v-fieldset>
      <v-fieldset legend="MULTIMEDIA" class="v-form">
        <label>Altavoces:</label>
        <input v-model="o.multimedia_altavoces" />
      </v-fieldset>
      <v-fieldset legend="Sistema Operativo" class="v-form">
        <label>Versión:</label>
        <input v-model="o.sistema_operativo_version" />
      </v-fieldset>
      <v-fieldset legend="Monitor" class="v-form">
        <label>Pulgadas:</label>
        <input v-model="o.monitor_pulgadas" />
      </v-fieldset>
      <label>Estado:</label>
      <v-select v-model="o.estado" required="required">
        <option value="">Select One...</option>
        <option v-for="item in estado" :key="item" :value="item">
          {{ item }}
        </option>
      </v-select>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
    </center>
  </v-form>
</template>
<script>
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
      usuario_area: 
      [
  {"name": "PRESIDENCIA EJECUTIVA", "type": "P"},
  {"name": "GERENCIA GENERAL", "type": "G"},
  {"name": "OFICINA DE ADMINISTRACIÓN", "type": "O"},
  {"name": "UNIDAD DE ABASTECIMIENTO Y CONTROL PATRIMONIAL", "type": "U"},
  {"name": "UNIDAD DE FINANZAS", "type": "U"},
  {"name": "UNIDAD DE RECURSOS HUMANOS", "type": "U"},
  {"name": "OFICINA DE ASESORÍA JURÍDICA", "type": "O"},
  {"name": "OFICINA DE PLANEAMIENTO, PRESUPUESTO Y MONITOREO", "type": "O"},
  {"name": "UNIDAD DE PRESUPUESTO", "type": "U"},
  {"name": "UNIDAD DE PLANEAMIENTO Y MODERNIZACIÓN", "type": "U"},
  {"name": "DIRECCIÓN DE DESARROLLO DE CAPACIDADES Y DESPLIEGUE TERRITORIAL", "type": "D"},
  {"name": "SUBDIRECCIÓN DE FORMACIÓN Y ACREDITACIÓN", "type": "S"},
  {"name": "SUBDIRECCIÓN DE DESPLIEGUE TERRITORIAL", "type": "S"},
  {"name": "DIRECCIÓN DE GOBIERNO DE DATOS Y SUPERVISIÓN", "type": "D"},
  {"name": "SUBDIRECCIÓN DE GOBIERNO DE DATOS", "type": "S"},
  {"name": "DIRECCIÓN DE SISTEMAS DE INFORMACIÓN SOCIAL", "type": "D"},
  {"name": "SUBDIRECCIÓN DE INFORMACIÓN E INNOVACIÓN", "type": "S"},
  {"name": "SUBDIRECCIÓN DE GESTIÓN DE LOS SERVICIOS E INFRAESTRUCTURA TECNOLÓGICA", "type": "S"},
  {"name": "DIRECCIÓN DE DISEÑO Y METODOLOGÍAS PARA LA FOCALIZACIÓN Y LA GESTIÓN DE LA INFORMACIÓN", "type": "D"},
  {"name": "SUBDIRECCIÓN ANÁLISIS, INVESTIGACIÓN Y METODOLOGÍA", "type": "S"},
  {"name": "SUBDIRECCIÓN DE DISEÑO DE FOCALIZACIÓN", "type": "S"},
  {"name": "DIRECCIÓN DE RELACIONAMIENTO Y COMUNICACIÓN SOCIAL", "type": "D"},
  {"name": "SUBDIRECCIÓN DE COMUNICACIÓN SOCIAL", "type": "S"},
  {"name": "SUBDIRECCIÓN DE ATENCIÓN AL CIUDADANO Y GESTIÓN DE SOLICITUDES", "type": "S"}
]
,
      usuario_ubicacion: [

        "PISO 06",
        "PISO 08"
      ],
      financiador: [
        "AURICULAR",
        "CAMARA WEB",
        "COMPUTADORA",
        "ESTACION DE TRABAJO",
        "LAPTO",
        "MONITOR",
        "MOUSE",
        "TABLET",
        "TECLADO",
        "TABLET",
        "UPS"
      ],









      estado: [
        "Bueno",
        "Malo",
        "Regular"
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        tipo_equipo_accesorio: null,
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
  mounted() {
    var me = this;
    me.changeRoute();
  },
  methods: {
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
    async changeRoute() {
      var me = this,
        id = me.id, m = me.$refs.map; me.age = 0;
      me.trayLocation = 0;
      if (id < 0) {
        me.getStoredList("cancer").then((cancer) => {
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
          .get("/api/inventory/item/" + id)
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
        me.$router.replace("/admin/inventory/item");
    }
  },
});
</script>