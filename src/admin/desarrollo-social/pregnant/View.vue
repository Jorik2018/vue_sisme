<template>
  <v-form
    action="/api/desarrollo-social/pregnant"
    :title="o.synchronized"
    header="Ver Gestante"
    @resize="onResize"
    store="pregnant"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
  >
    <div class="v-form">
      <label>ID:</label>
      <div>
        {{ pad(o.id, 4) }}
      </div>
      <label>DIRESA:</label>
      <div>ANCASH</div>
      <label>Red:</label>
      <div>
        {{ o.red }}<template v-if="o.redName">: {{ o.redName }}</template>
      </div>
      <label>Microred:</label>
      <div>{{ o.microred ? o.microred : "---" }}</div>
      <label>Establecimiento:</label>
      <div>
        {{ o.codigoEESS ? o.codigoEESS : "---" }}
        <template v-if="o.establecimientoSalud"
          >: {{ o.establecimientoSalud }}</template
        >
      </div>
      <v-fieldset legend="DATOS PERSONALES" closable="true" class="v-form">
        
        <label>DNI:</label>
        <div>{{ o.numeroDNI }}</div>
        <label>Nombre completo:</label>
        <div>{{ o.apellidoPaterno }} {{ o.apellidoMaterno }} {{ o.nombres }}</div>
        <label>Provincia:</label>
        <div>{{ o.province ? o.province : "---" }}</div>
        <label>Distrito:</label>
        <div>{{ o.district ? o.district : "---" }}</div>
        <label>Centro Poblado:</label>
        <div>{{ o.codigoCCPP }}: {{ o.ccpp }}</div>
        <label>Sector:</label>
        <div>{{ o.address ? o.address : "---" }}</div>
        <label>Dirección:</label>
        <div>{{ o.address ? o.address : "---" }}</div>
        <label>Telefono:</label>
        <div>{{ o.phone ? o.phone : "---" }}</div>
      </v-fieldset>
      <v-fieldset legend="DATOS OBSTETRICOS">
        <label>Gestante:</label>
        <div>{{ o.gestanteNumero }}</div>
        <label>Paridad:</label>
        <div>{{ o.gestanteParidad }}</div>
        <label>FUR:</label>
        <div>
          {{ o.gestanteFUR || "yyyy-MM-dd" }}
        </div>
        <label>FPP:</label>
        <div>
          {{ o.gestanteFPP || "yyyy-MM-dd" }}
        </div>
        <label>EG. En Semanas:</label>
        <div>{{ o.gestanteEdadGestacionalSemanas }}</div>
        <label>Riesgo Obstetrico:</label>
        <v-select v-model="o.gestanteRiesgoObstetrico" v-bind:required="true">
          <option>Select One...</option>
          <v-options store="cie" display-field="name" value-field="code" />
        </v-select>
      </v-fieldset>
      <v-fieldset legend="Coordenadas" style="width: auto">
        <div
          class="center location"
          v-if="(o.lat && o.lat != 0) || (o.lon && o.lon != 0)"
        >
          <a
            :href="
              'https://www.google.com/maps/search/?api=1&query=' +
              o.lat +
              ',' +
              o.lon
            "
            target="_blank"
            >({{ o.lat ? o.lat : "---" }},{{ o.lon }})</a
          >
        </div>
      </v-fieldset>
      <v-fieldset legend="Visitas">
        <v-table
          autoload="false"
          class="visit"
          :scrollable="true" :width="width" :style="{ maxHeight: maxHeight }"
          src="/api/desarrollo-social/pregnant/visit/0/0"
          :value="o.visits"
          store="pregnant_visit"
          row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
          ref="visit"
          :filters="filters"
          @row-select="visitSelected = $event.current"
        >
          <template v-slot:default="{ row }">
            <td header="N°" class="center" width="40">
              {{ pad(row.number, 2) }}
            </td>
            <td header="Fecha" class="center" width="120">
              {{ row.fechaVisita | date }}
            </td>
            <td header="Detalle" width="220">{{ row.detalle }}</td>
            <td header="Prox. Visita" class="center" width="120">
              {{ row.fechaProxVisita | date }}
            </td>
          </template>
        </v-table>
        <div class="right" style="margin-top: 10px">
          <v-button
            icon="fa-trash"
            :disabled="!visitSelected"
            @click="destroy($refs.visit)"
          ></v-button>
          <v-button
            icon="fa-pen"
            :disabled="!visitSelected"
            @click="edit"
          ></v-button>
          <v-button icon="fa-plus" @click="addPeople(o)"></v-button>
        </div>
      </v-fieldset>
      <label>Estado Migracion:</label>
      <div>{{ o.migracionEstado||'--' }}</div>
    </div>
    <center style="margin-bottom: 10px">
      <v-button
        style="margin-left: 10px"
        value="Editar"
        :disabled="!o.id"
        icon="fa-eye"
        class="blue"
        @click.prevent="
          $router.replace(
            '/admin/desarrollo-social/pregnant/' +
              (o.tmpId ? -o.tmpId : o.id) +
              '/edit'
          )
        "
      ></v-button>
    </center>
  </v-form>
</template>
<script>
var { _, axios } = window;
export default _.ui({
  props: ["id"],
  watch: {
    $route() {
      this.render();
    },
  },
  created() {
    var me = this;
    this.$on("destroyed", (o) => {
      console.log(o);
    });
    this.$on("sync", (o) => {
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            e.visits.forEach((visit) => {
              if (o.visits)
                o.visits.forEach((o) => {
                  if (o.tmpId == visit.tmpId) {
                    visit.id = o.id;
                    visit.synchronized = o.synchronized;
                  }
                });
              visit.pregnantId = o.id;
            });
            _.db
              .transaction(["pregnant"], "readwrite")
              .objectStore("pregnant")
              .put(e);
          }
        });
      });
    });
  },
  data() {
    return {
      maxHeight: '400px',
      visitSelected: null,
      k: 0,
      dd: [],
      agreementType: {
        P: "SALUD INDIVIDUAL",
        F: "FUNCIONES DE LA FAMILIA",
        V: "CODICIONES MATERIALES DE VIDA Y ENTORNO",
      },
      relationship: [
        { id: "P", name: "PADRE", sex: "M" },
        { id: "M", name: "MADRE", sex: "F" },
        { id: "H", name: "HIJA/O", sex: "X" },
        { id: "HA", name: "HIJA/O ADOPTIVA/O", sex: "X" },
        { id: "A", name: "ABUELA/O", sex: "X" },
        { id: "T", name: "TIA/O", sex: "X" },
        { id: "N", name: "NIETA/O", sex: "X" },
        { id: "PA", name: "PADASTRO", sex: "M" },
        { id: "MA", name: "MADASTRA", sex: "F" },
        { id: "S", name: "SOBRINA/O", sex: "X" },
        { id: "PR", name: "PRIMA/O", sex: "X" },
        { id: "BA", name: "BIS-ABUELA/O", sex: "X" },
        { id: "AMG", name: "AMIGA/O", sex: "X" },
        { id: "HM", name: "HERMANA/O", sex: "X" },
        { id: "Y", name: "YERNO", sex: "M" },
        { id: "N", name: "NUERA", sex: "F" },
      ],
      civilStatus: [
        { id: "S", name: "SOLTERA/O" },
        { id: "CO", name: "CONVIVIENTE" },
        { id: "C", name: "CASADA/O" },
        { id: "SP", name: "SEPARADA/O" },
        { id: "D", name: "DIVORCIADA/O" },
        { id: "V", name: "VIUDA/O" },
        { id: "O", name: "OTROS" },
      ],
      width: null,
      degreeInstruction: [
        { id: "SI", name: "SIN INSTRUCCION" },
        { id: "I", name: "INICIAL" },
        { id: "PC", name: "PRIMARIA COMPLETA" },
        { id: "PI", name: "PRIMARIA INCOMPLETA" },
        { id: "SC", name: "SECUNDARIA COMPLETA" },
        { id: "SI", name: "SECUNDARIA INCOMPLETO" },
        { id: "SUC", name: "SUPERIOR COMPLETO" },
        { id: "SUI", name: "SUPERIOR INCOMPLETO" },
      ],
      occupationCondition: [
        { id: "S", name: "TRABAJADOR ESTABLE" },
        { id: "V", name: "EVENTUAL" },
        { id: "SO", name: "SIN OCUPACION" },
        { id: "J", name: "JUBILADA/O" },
        { id: "E", name: "ESTUDIANTE" },
      ],
      o: { synchronized: null, ext: {} },
    };
  },
  methods: {
    
    getScrollBarWidth() {
      var w = this.w;
      if (!w) {
        let el = document.createElement("div");
        el.style.cssText = "overflow:scroll; visibility:hidden; position:absolute;";
        document.body.appendChild(el);
        this.w = w = el.offsetWidth - el.clientWidth;
        el.remove();
      }
      return w;
    },
    onResize(e) {
      var w = e.$target.$el.offsetWidth - 44 - this.getScrollBarWidth();

      Array.prototype.forEach.call(
        this.$el.querySelectorAll(".v-datatable"),
        (e) => {
          e.style.width = w + "px";
          this.width = w;
        }
      );
    },
    close() {},
    addPeople(o) {
      this.open(
        "/admin/desarrollo-social/pregnant/" + o.id + "/add/visit",
        this.$refs.visit.load
      );
    },
    loadTables() {
      var refs = this.$refs;
      refs.visit.load();
    },
    render() {
      var me = this,
        id = me.id;

      if (id < 0) {
        me.getStoredList("pregnant").then((pregnant) => {
          pregnant.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              me.trayLocation = e.lat && e.lon;
              console.log(e);
              me.setStoredList("pregnant_visit", me.o.visits);
              me.filters.pregnantId = e.id;
              me.loadTables();
              me.k++;
            }
          });
        });
      } else if (Number(id)) {
        me.filters.gestanteId = me.id;
        var loaded = 0;
        me.getStoredList("pregnant").then((pregnant) => {
          pregnant.forEach((e) => {
            if (e.id == me.id) {
              me.o = e;
              me.trayLocation = e.lat && e.lon;
              me.setStoredList("pregnant_visit", me.o.visits);
              me.loadTables();
              loaded = 1;
            }
          });
        });
        axios
          .get("/api/desarrollo-social/pregnant/" + id)
          .then(function (response) {
            me.o = response.data;
            if (!loaded) me.loadTables();
          });
      }
    },
    rewrite(url){
        return '/admin'+url;
    }
  },
  mounted() {
    var me = this;
    if (this.$children[0]) me.app.title = this.$children[0].header;
    me.render();
  },
});
</script>
<style scoped>
.visit >>> table {
  width: 100%;
}
#dateDiff:empty,
#msg:empty {
  display: none;
}
#dateDiff {
  border-radius: 4px;
  background-color: #fdfad9;
  border: 1px solid #dddddd;
  padding: 5px 10px;
  margin-top: 10px;
}
.location{
  margin-top: 10px;
            border: 1px solid #ffcf00;
            background-color: #ffff80;
            padding: 10px;
}
</style>