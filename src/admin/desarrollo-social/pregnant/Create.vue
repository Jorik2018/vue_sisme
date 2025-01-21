<template>
  <v-form
    action="/api/desarrollo-social/pregnant"
    :header="(o.id ? 'Editar' : 'Crear') + ' Gestante'"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    store="pregnant"
  >
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id ? o.id : 0, 4) }}</div>
      <label>DIRESA:</label>
      <div>ANCASH</div>
      <label>Red:</label>
      <v-select
        v-model="o.red"
        ref="red"
        v-on:input="$refs.microredSelect.load({ Codigo_Red: o.red })"
        :required="true"
      >
        <option>Select One...</option>
        <v-options store="red" display-field="name" value-field="code" />
      </v-select>
      <label>Microred:</label>
      <v-select
        autoload="false"
        :disabled="!o.red"
        store="microred"
        ref="microredSelect"
        v-model="o.microred"
        :required="true"
        @input="$refs.establishment.load({ microredCode:'02'+o.microred})"
      >
        <option>Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
      <label>Establecimiento:</label>
      <v-select
        ref="establishment"
        @input="inputEstablishment"
        v-model="o.codigoEESS"
        :autoload="false"
        :disabled="!o.microred"
        :required="true"
      >
        <option>Select One...</option>
        <v-options
          store="establishment"
          display-field="name"
          value-field="code"
        />
      </v-select>

      <label>Provincia:</label>
      <div v-if="!o.region" class="alert">No hay una región por defecto</div>
      <v-select
        ref="province"
        :disabled="!o.region"
        storage="province_selected"
        v-model="o.province"
        :required="true"
        @input="$refs.district.load({ code: o.province })"
      >
        <option>Select One...</option>
        <v-options store="province" display-field="name" value-field="code" />
      </v-select>
      <label>Distrito:</label>
      <v-select
        ref="district"
        :autoload="false"
        store="district_selected"
        :disabled="!o.province"
        v-model="o.district"
        name="district"
        required="true"
        @input="$refs.cpSelect.load({ id: o.district })"
      >
        <option value="">Select One...</option>
        <v-options store="district" value-field="code" display-field="name" />
      </v-select>

      <label>Centro Poblado:</label>
      <v-select
        :autoload="false"
        :label="o.districtName ? o.districtName : '---'"
        :disabled="!o.district"
        required="required"
        ref="cpSelect"
        v-model="o.codigoCCPP"
        @input="inputCCPP"
      >
        <option value="">Seleccionar Opción</option>
        <v-options store="town" display-field="name" value-field="id" />
      </v-select>
      <label>Sector:</label>
      <input
        type="text"
        v-model="o.sector"
        required="required"
      />
      <label>Dirección:</label>
      <input
        type="text"
        v-model="o.address"
        required="required"
        title="Direccion"
      />
      <v-fieldset legend="DATOS PERSONALES">
        <label>DNI:</label>
        <input
          type="text"
          v-model="o.numeroDNI"
          required="required"
          title="Numero DNI"
        />
        <label>Apellidos:</label>
        <input
          type="text"
          v-model="o.apellidoPaterno"
          required="required"
        />
        <label>Nombres:</label>
        <input
          type="text"
          v-model="o.nombres"
          required="required"
        />
       
        <label>Fecha Nacimiento:</label>
        <v-calendar
          v-model="o.fechaNacimiento"
          required="required"
          title="Fecha Nacimiento"
          :max="today"
        />
        <label>Estado Civil:</label>
        <v-select
          v-model="o.estadoCivil"
          required="required"
          title="Estado Civil"
        >
          <option value="">Select One...</option>
          <option value="SOLTERO">SOLTERO (A)</option>
          <option value="CASADO">CASADO (A)</option>
          <option value="DIVORCIADO">DIVORCIADO (A)</option>
          <option value="VIUDO">VIUDO (A)</option>
          <option value="CONVIVIENTE">CONVIVIENTE</option>
        </v-select>
        <label>Grado Instrucción:</label>
        <v-select v-model="o.gradoInstruccion" required="required">
          <option value="">Select One...</option>
          <option value="PRIMARIA COMPLETA">PRIMARIA COMPLETA</option>
          <option value="PRIMARIA INCOMPLETA">PRIMARIA INCOMPLETA</option>
          <option value="SECUNDARIA COMPLETA">SECUNDARIA COMPLETA</option>
          <option value="SECUNDARIA INCOMPLETA">SECUNDARIA INCOMPLETA</option>
          <option value="SUPERIOR COMPLETA">SUPERIOR COMPLETA</option>
          <option value="SUPERIOR INCOMPLETA">SUPERIOR INCOMPLETA</option>
          <option value="SUPERIOR UNIVERSITARIO COMPLETO">
            SUPERIOR UNIVERSITARIO COMPLETO
          </option>
          <option value="SUPERIOR UNIVERSITARIO INCOMPLETO">
            SUPERIOR UNIVERSITARIO INCOMPLETO
          </option>
          <option value="NO ESTUDIO">NO ESTUDIO</option>
        </v-select>
        <label>Gestante Numero Celular:</label>
        <input
          type="tel"
          v-model="o.gestanteNumeroCelular"
          required="required"
          title="Gestante Numero Celular"
        />
        <label>Gestante Familia Celular:</label>
        <input
          type="tel"
          v-model="o.gestanteFamiliaCelular"
          required="required"
          title="Gestante Familia Celular"
        />
      </v-fieldset>

      <v-fieldset legend="DATOS OBSTETRICOS">
        <label>Gestante:</label>
        <v-number
          v-model="o.gestanteNumero"
          required="required"
          title="Gestante Numero"
        />
        <label>Paridad:</label>
        <v-number
          v-model="o.gestanteParidad"
          required="required"
          title="Gestante Paridad"
        />
        <label>FUR:</label>
        <v-calendar
          v-model="o.gestanteFUR"
          required="required"
          title="Gestante FUR" :max="today"
          @invalid="invalidDate"
          @input="onInputFUR"
        />
        <label>FPP:</label>
        <div
          style="padding: 5px; border: 1px solid lightgrey; border-radius: 8px"
        >
          {{ o.gestanteFPP || "yyyy-MM-dd" }}
        </div>
        <label>EG. En Semanas:</label>
        <v-number
          v-model="o.gestanteEdadGestacionalSemanas"
          required="required"
          title="Gestante Edad Gestacional Semanas"
        />
        <label>Riesgo Obstetrico:</label>
        <v-select v-model="o.gestanteRiesgoObstetrico" v-bind:required="true">
          <option>Select One...</option>
          <v-options store="cie" display-field="name" value-field="code" />
        </v-select>
      </v-fieldset>
      <v-fieldset
        legend="EMERGENCIA Y/O HOSPITALIZACION"
        closable="true"
        class="v-form"
      >
        <label>Red:</label>
        <v-select
          v-model="o.emergencyRed"
          autoload="false"
          ref="emergencyRed"
          v-on:input="
            $refs.emer_microred.load({ code: o.emergencyRed })
          "
        >
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
      <v-select
        autoload="false"
        :disabled="!o.emergencyRed"
        store="microred"
        ref="emer_microred"
        v-model="o.emergencyMicrored"
        :required="true"
        @input="$refs.emer_establishment.load({ microredCode:'02'+ o.emergencyMicrored,type:1  })"
      >
        <option>Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
        <label>IPRESS:</label>
        <v-select
          ref="emer_establishment"
          v-model="o.lugarIPRESS"
          :autoload="true"
          :disabled="!o.emergencyMicrored"
        >
          <option>Select One...</option>
          <v-options
            store="establishment"
            display-field="name"
            value-field="code"
          />
        </v-select>
        <label>Diagnostico:</label>
        <v-textarea
          type="text"
          v-model="o.lugarDiagnostico"
          title="Lugar Diagnostico"
        />
        <label>Fecha:</label>
        <v-calendar
          v-model="o.lugarFechaEmergencia"
          title="Lugar Fecha Emergencia"
        />
        <label>Referencia:</label>
        <v-calendar v-model="o.lugarFechaReferida" />
      </v-fieldset>
      <v-fieldset
        legend="MIGRACIÓN"
        class="v-form"
        closable="true"
        v-model="o.migration"
      >
        <label>Red:</label>
        <v-select
          v-model="o.migra_red"
          autoload="false"
          ref="migra_red"
          v-on:input="
            $refs.migra_microredSelect.load({ Codigo_Red: o.migra_red })
          "
        >
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
        <v-select
          autoload="false"
          :disabled="!o.migra_red"
          store="microred"
          ref="migra_microredSelect"
          v-model="o.migra_microred"
          :required="true"
          @input="
            $refs.migra_establishment.load({
              microredCode:'02'+o.migra_microred,
            })
          "
        >
          <option>Select One...</option>
          <v-options store="microred" display-field="name" value-field="code" />
        </v-select>
        <label>IPRESS:</label>
        <v-select
          ref="migra_establishment"
          v-model="o.migracionIPRESS"
          :autoload="false"
          :disabled="!o.migra_microred"
          :required="true"
        >
          <option>Select One...</option>
          <v-options
            store="establishment"
            display-field="name"
            value-field="code"
          />
        </v-select>

        <label>Observacion:</label>
        <v-textarea
          v-model="o.migracionObservacion"
          title="Migracion Observacion"
        />
      </v-fieldset>
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
      <label>Estado:</label>
        <v-select v-model="o.migracionEstado" required="required">
          <option value="">Select One...</option>

          <option :value="item" :key="item"
          v-for="item in ['GESTANTE','GESTANTE CAPTADA','PUERPERA','MER']">
            {{ item }}
          </option>
        </v-select>
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
            '/admin/desarrollo-social/pregnant/' + (o.tmpId ? -o.tmpId : o.id)
          )
        "
      ></v-button>
    </center>
  </v-form>
</template>
<script>
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Geolocation } from "@capacitor/geolocation";
import "ol/ol.css";
var {_,axios} = window;
export default _.ui({
  props: ["id"],
  data() {
    return {
      count: 0,
      today:null,
      red: [],
      risk: [
        "INVIDENTE",
        "DIFICULTAD PIERNAS",
        "DISCAPACIDAD CARA",
        "DISCAPACIDAD CARA Y LABIOS",
        "DISCAPACIDAD MENTAL",
        "EXTREMIDADES",
        "MINUSVALIDA",
        "PARALISIS",
        "SORDO MUDO",
        "SINDROME DOWN",
        "SORDERA",
        "SORDO MUDO",
        "TARTAMUDO",
        "TRANSTORNO DE CADERA",
        "Otro",
      ],
      areaResidencia: [
        { id: "U", name: "URBANO" },
        { id: "M", name: "URBANO MARGINAL" },
        { id: "R", name: "RURAL" },
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        synchronized: null,
        establecimientoSalud: null,
        lat: null,
        tmpId: null,
        lon: null,
        red: "02",
        microred: null,
        gestanteFPP: null,
        codigoCCPP: null,
        ext: { src: null },
      },
    };
  },
  created() {
    var me = this;
    if(!me.today)me.today=_.toDate(new Date(),'date-');
    this.$on("sync", (o) => {
      me.getStoredList("pregnant").then((pregnants) => {
        pregnants.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            e.peoples.forEach((e) => {
              if (o.peoples)
                o.peoples.forEach((o) => {
                  if (o.tmpId == e.tmpId) {
                    e.id = o.id;
                    e.synchronized = o.synchronized;
                  }
                });
              e.masterId = o.id;
            });
            e.agreements.forEach((e) => {
              if (o.agreements)
                o.agreements.forEach((o) => {
                  if (o.tmpId == e.tmpId) {
                    e.id = o.id;
                    e.synchronized = o.synchronized;
                  }
                });
              e.masterId = o.id;
            });
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
    inputCCPP(a, b) {
        this.o.ccpp = b&&b.object ? (b.object.name) : "";
    },
    inputEstablishment(a, b) {
        this.o.establecimientoSalud = b&&b.object ? b.object.name : "";
    },
    process(o) {
      if (!this.trayLocation) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    errorImg() {},
    changeImage(result) {
      var me = this,
        o = me.o;
      o.tempFile = result.tempFile;
      if (o.id > 0) {
        result.id = o.id;
        axios
          .post("/api/desarrollo-social/pregnant/attach-image", result)
          .then(() => {
            delete o.ext.pending;
            delete o.tempFile;
            if (o.tmpId) {
              var objectStore = window._.db
                .transaction(["pregnant"], "readwrite")
                .objectStore("pregnant");
              var item = objectStore.get(o.tmpId);
              item.onsuccess = function () {
                objectStore.put(o);
              };
            }
            me.app.toast("Imagen adjuntada!");
          });
      }
    },
    syncImage() {
      var me = this;
      fetch(me.o.ext.src)
        .then((r) => r.blob())
        .then(function (b) {
          me.$refs.uploader.submitFile(b, "name.jpg");
        });
    },
    uploaderClick(uploader) {
      var me = this,
        o = me.o;
      me.count++;
      Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
      }).then(function (result) {
        me.count--;
        if (me.count == 0) {
          var fs = Filesystem;
          if (result.path) {
            o.ext.path = result.path;
            fs.readFile({
              path: result.path,
            }).then(function (r) {
              var filename = new Date().getTime() + ".jpeg";
              //Aqui se guarda una copia del archivo
              fs.writeFile({
                data: r.data,
                path: filename,
                directory: Directory.Data,
              }).then(function () {
                fs.getUri({
                  path: filename,
                  directory: Directory.Data,
                }).then(function (s) {
                  //incluso si se envia la imagen es mejor tener una referencia local
                  me.o.ext.src = Capacitor.convertFileSrc(s.uri);
                  me.o.ext.pending = true;
                  if (me.app.connected) {
                    fetch(me.o.ext.src)
                      .then((r) => r.blob())
                      .then(function (b) {
                        uploader.submitFile(b, "name." + result.format);
                      });
                  }
                });
              });
            });
          } else {
            fetch(result.webPath)
              .then((r) => r.blob())
              .then(function (b) {
                o.ext.src = result.webPath;
                o.ext.pending = 1;
                if (me.app.connected)
                  uploader.submitFile(b, "name." + result.format);
              });
          }
        }
      });
    },
    async printCurrentPosition() {
      this.trayLocation = 1;
      const coordinates = await Geolocation.getCurrentPosition();
      var c = coordinates.coords;
      this.o.lat = c.latitude;
      this.o.lon = c.longitude;
    },
    async changeRoute() {
      var me = this,
        id = me.id;
      me.trayLocation = 0;
      me.$refs.emergencyRed.load();
      me.$refs.migra_red.load();
      if (id < 0) {
        console.log(me.getStoredList("pregnant"));
        me.getStoredList("pregnant").then((pregnant) => {
          console.log(pregnant);
          pregnant.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              console.log(e.visits);
              me.$refs.province.load({ code: me.o.region || "02" });
              me.trayLocation = e.lat && e.lon;
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/desarrollo-social/pregnant/" + id)
          .then(function (response) {
            var o = response.data;
            if (o.red) o.red = me.pad(o.red, 2);

            if (o.province) {
              o.province = me.pad(o.province, 4);
              o.region = o.province.substring(0, 2);
            }
            if (o.district) o.district = me.pad(o.district, 6);
            o.ext.src = null;
            o.ext.tempFile = null;
            me.trayLocation = 1;
            me.o = o;
            me.$refs.province.load({ code: me.o.region });
          });
      } else {
        try {
          var s = localStorage.getItem("setting");
          if (s) {
            s = JSON.parse(s);
            var o = this.o;
            o.red = s.red;
            o.microred = s.microred;
            o.codigoEESS = s.establishment;
            if (s.region) {
              o.region = s.region.code;
            }
            if (s.province) o.province = s.province.code;
            if (s.district) o.district = s.district.code;
            if (s.town) o.codigoCCPP = s.town.id;
            /*o.town = s.town;*/
          }
        } catch (e) {
          console.log(e);
        }
        me.$refs.province.load({ code: me.o.region||'02' });
      }
    },
    close(r) {
      var me = this;
      if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
        if (r.data.uploaded) {
          delete o.tempFile;
          delete o.ext.pending;
        }
      }
      var o = me.o;
      var nid = o.tmpId ? -o.tmpId : o.id;
      if (me.id != nid)
        me.$router.replace("/admin/desarrollo-social/pregnant/" + nid);
    },
    async getCurrentPosition() {
      var me = this;
      //const {Geolocation} = Plugins;
      const c = await Geolocation.getCurrentPosition();
      me.o.lat = c.coords.latitude;
      me.o.lon = c.coords.longitude;
    },
    invalidDate(e){
      this.MsgBox('Fecha no valida '+e.value);
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