<template>
  <v-form
    id="DisabledCreateForm"
    action="/api/desarrollo-social/disabled"
    v-bind:header="(o.id ? 'Editar ' : 'Crear ') + 'Discapacitado'"
    storage="disabled"
  >
    <div class="v-form">
      <label>DNI:</label>
      <input
        v-model="o.code"
        type="tel"
        class="numeric center"
        style="text-align: center !important"
        maxlength="12"
        pattern="[0-9]*"
      />
      <label>Nombres:</label>
      <input type="text" v-model="o.names" title="Nombres" />
      <label>Apellidos:</label>
      <input type="text" v-model="o.surnames" title="Apellidos" />
      <label>Telefono:</label> <input type="text" v-model="o.phone" />
      <label>Mail:</label> <input type="email" v-model="o.mail" />
      <label>Fecha Nacimiento:</label>
      <v-calendar v-model="o.birthdate"></v-calendar>
      <div
        id="dateDiff"
        v-if="dateDiff"
        style="
          border: 1px solid #ffcb60;
          background-color: #f9ff70;
          padding: 5px;
          margin-top: 5px;
        "
      >
        HACE {{ dateDiff }}
      </div>
      <label>Provincia:</label>
      <v-select
        v-model="o.province"
        name="province"
        storage="province_selected"
        required="required"
        v-on:input="
          $refs.districtSelect.load({ provinceId: parseInt(o.province) })
        "
      >
        <option value="">Select One...</option>
        <v-options
          url="/api/directory/province/0/0?regionId=2"
          storage="province"
          value-field="code"
          display-field="name"
        ></v-options>
      </v-select>
      <label>Distrito:</label>
      <v-select
        ref="districtSelect"
        v-bind:autoload="false"
        storage="district_selected"
        v-bind:disabled="!o.province"
        v-model="o.district"
        name="district"
        required="required"
        v-on:input="$refs.localitySelect.load({ district: o.district })"
      >
        <option value="">Select One...</option>
        <v-options
          url="/api/directory/district/0/0"
          storage="district"
          value-field="code"
          display-field="name"
        ></v-options>
      </v-select>
      <label>Poblado:</label>
      <v-select
        ref="localitySelect"
        v-bind:autoload="false"
        v-bind:disabled="!o.district"
        v-model="o.town"
      >
        <option value="">Select One...</option>
        <v-options
          url="/api/directory/town/0/0"
          value-field="id"
          storage="town"
          display-field="name"
        ></v-options>
      </v-select>
      <label>Dirección:</label>
      <v-textarea
        type="text"
        required="true"
        maxlength="55"
        v-model="o.address"
        title="Dirección"
      ></v-textarea>
      <label>Cuenta con certificado de discapacidad?:</label>
      <v-switch required="true" v-model="o.certified"></v-switch>
      <v-fieldset
        v-if="o.certified + '' == 'true'"
        legend="Datos del certificado"
      >
        <label>Resolución:</label>
        <input v-model="o.nroResolution" maxlength="20" />
        <label>Numero:</label>
        <input v-model="o.nroCertificate" maxlength="20" />
        <label>Fecha Emisión:</label>
        <v-calendar v-model="o.issuanceDate"></v-calendar>
        <label>Fecha Caducidad:</label>
        <v-calendar v-model="o.expiryDate"></v-calendar>
        <div class="right">
          <v-uploader
            icon="fa-camera"
            style="margin-top: 10px"
            value="Obtener Imagen"
            v-bind:click="uploaderClick"
            v-on:input="changeImage($event)"
          ></v-uploader>
          <a class="_" v-bind:key="'img-' + count" style="display: block">
            <img
              onerror="this.parentNode.style.display='none'"
              style="
                width: calc(100% - 4px);
                display: block;
                border: 2px solid green;
                margin-top: 10px;
              "
              v-bind:src="
                o.ext.src
                  ? o.ext.src
                  : baseURL +
                    '/fs/desarrollo-social/disabled/certified/' +
                    o.id +
                    '.jpeg'
              "
          /></a>
        </div>
      </v-fieldset>
      <label v-bind:title="o.type">Tipo:</label>
      <v-select v-model="o.type" required="required">
        <option value="">Select One...</option>
        <option v-for="(v, i) in type" v-bind:key="i" v-bind:value="v">
          {{ v }}
        </option>
      </v-select>
      <v-textarea
        v-if="o.type == 'Otro' || o.otherType"
        v-model="o.otherType"
      ></v-textarea>
      <label>Severidad:</label>
      <v-select v-model="o.severity" required="required">
        <option value="">Select One...</option>
        <option value="ALTA">ALTA</option>
        <option value="MODERADO">MODERADO</option>
        <option value="LEVE">LEVE</option>
      </v-select>
      <label>Dispositivos o productos de apoyo que utiliza:</label>
      <v-textarea
        type="text"
        maxlength="45"
        v-model="o.devices"
        title="Dispositivos o productos de apoyo que utiliza"
      ></v-textarea>
      <label>Requiere asistencia?:</label>
      <v-switch required="true" id="active" v-model="o.assistance"></v-switch>
      <v-fieldset legend="Persona que asiste" v-if="o.assistance">
        <label>DNI:</label>
        <input
          v-model="o.assistant"
          type="tel"
          class="numeric center"
          style="text-align: center !important"
          maxlength="12"
          pattern="[0-9]*"
        />
        <label>Telefono:</label>
        <input type="text" v-model="o.assistantPhone" />
      </v-fieldset>
      <label>Necesidades Basicas:</label>
      <v-select v-model="o.basicNeeds" required="required">
        <option value="">Select One...</option>
        <option value="SALUD">SALUD</option>
        <option value="SOCIAL">SOCIAL</option>
      </v-select>
      <label>Descripcion Necesidades:</label>
      <v-textarea v-model="o.descriptionNeeds"></v-textarea>
      <label>Fecha Fallecimiento:</label>
      <v-calendar v-model="o.deathDate"></v-calendar>
      <template>
        <v-fieldset legend="Coordenadas">
          <template v-if="0 > o.lat"> ({{ o.lat }},{{ o.lon }}) </template>
          <div class="alert yellow" v-if="o.lat >= 0">
            No se pudo obtener las coordenadas
          </div>
          <div class="right" style="margin-top: 10px">
            <v-button
              icon="fa-compass"
              value="Obtener coordenadas actuales"
              v-on:click.prevent="getCoordinates"
            ></v-button>
          </div>
        </v-fieldset>
      </template>
    </div>
    <center>
      <v-button
        value="Grabar"
        icon="fa-save"
        v-on:click.prevent="save"
      ></v-button>
      <v-button
        value="Cancelar"
        icon="fa-ban"
        v-on:click.prevent="close"
      ></v-button>
    </center>
  </v-form>
</template>
<script>
import {
  Capacitor,
  Plugins,
  CameraResultType,
  FilesystemDirectory,
} from "@capacitor/core";
var { _, axios } = window;
import Vue from "vue";
export default _.ui({
  computed: {
    dateDiff() {
      var r = "",
        f = this.o.birthdate;
      if (f) {
        var r2 = Vue.dateDiff(f, new Date());
        if (r2.ans) r += r2.ans + " ANIOS ";
        if (r2.meses) r += r2.meses + " MESES ";
        if (r2.dias) r += r2.dias + " DIAS ";
      }
      return r;
    },
  },
  props: ["id"],
  data() {
    return {
      count: 0,
      type: [
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
      o: { lat: null, lon: null, ext: { province: null } },
    };
  },
  mounted() {
    this.changeRoute();
  },
  methods: {
    async getCurrentPosition() {
      var me = this;
      const { Geolocation } = Plugins;
      const c = await Geolocation.getCurrentPosition();
      me.o.lat = c.coords.latitude;
      me.o.lon = c.coords.longitude;
    },
    getCoordinates() {
      var me = this;
      if (me.getCurrentPosition) {
        me.getCurrentPosition();
      } else
        _.getCurrentPosition().then(function (c) {
          me.o.lat = c.coords.latitude;
          me.o.lon = c.coords.longitude;
        });
    },
    changeRoute() {
      var me = this,
        id = me.id;
      if (Number(id)) {
        if (0 > id) {
          var d = JSON.parse(localStorage.getItem("disabled"));
          for (var k = 0; d.length > k; k++) {
            if (d[k].tmpId == -id) {
              me.o = d[k];
              break;
            }
          }
        } else
          axios
            .get("/api/desarrollo-social/disabled/" + id)
            .then(function (response) {
              var o = response.data;
              me.count++;
              o.ext.src = null;
              o.ext.tempFile = null;
              me.o = o;
            });
      } else {
        me.o = { lat: null, lon: null, ext: { src: null } };
        me.getCoordinates();
      }
    },
    close(r) {
      if (r === true) {
        this.$router.back();
      }
    },
    process(o) {
      var user = this.user;
      if (user) o.user = user.id;
      return o;
    },
    changeImage(url) {
      var me = this;
      me.count++;
      me.o.ext.src = me.baseURL + "/fs/temp/" + url.tempFile;
      me.o.ext.tempFile = url.tempFile;
    },
    uploaderClick(u) {
      this.test(u);
    },
    test(u) {
      if (typeof Plugins !== "undefined") {
        var me = this;
        me.count++;
        Plugins.Camera.getPhoto({
          quality: 100,
          resultType: CameraResultType.Uri,
        }).then(function (result) {
          me.count--;
          if (me.count == 0) {
            var fs = Plugins.Filesystem;
            if (result.path)
              fs.readFile({
                path: result.path,
              }).then(function (r) {
                var fn = new Date().getTime() + ".jpeg";
                fs.writeFile({
                  data: r.data,
                  path: fn,
                  directory: FilesystemDirectory.Data,
                }).then(function () {
                  fs.getUri({
                    path: fn,
                    directory: FilesystemDirectory.Data,
                  }).then(function (s) {
                    me.o.ext.src = Capacitor.convertFileSrc(s.uri);
                    if (me.online) {
                      fetch(me.o.ext.src)
                        .then((r) => r.blob())
                        .then(function (b) {
                          u.submitFile(b, "name." + result.format);
                        });
                    } else {
                      me.o.ext.tmpSrc = me.o.ext.src;
                    }
                  });
                });
              });
            else if (me.online)
              fetch(result.webPath)
                .then((r) => r.blob())
                .then(function (b) {
                  u.submitFile(b, "name." + result.format);
                });
          }
        });
      }
    },
  },
});
</script>