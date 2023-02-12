<template>
  <v-form action="/admin/desarrollo-social/api/cancer" :header="(o.id ? 'Editar' : 'Crear') + '  Registro Cancer'"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
          ? 'green'
          : ''
    " store="cancer">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset legend="Datos generales" class="v-form">


        <label>Red:</label>
        <v-select v-model="o.red" autoload="false" ref="red"
          v-on:input="$refs.microredSelect.load({ Codigo_Red: o.red })" :required="true">
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

        <label>Provincia:</label>
        <div v-if="!o.region" class="alert">No hay una región por defecto</div>
        <v-select ref="province" :disabled="!o.region" storage="province_selected" v-model="o.province" :required="true"
          @input="$refs.district.load({ code: o.province })">
          <option>Select One...</option>
          <v-options store="province" display-field="name" value-field="code" />
        </v-select>
        <label>Distrito:</label>
        <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province"
          v-model="o.district" name="district" required="true" @input="$refs.cpSelect.load({ id: o.district })">
          <option value="">Select One...</option>
          <v-options store="district" value-field="code" display-field="name" />
        </v-select>

        <label>Centro Poblado:</label>
        <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.district"
          required="required" ref="cpSelect" v-model="o.codigoCCPP" @input="inputCCPP">
          <option value="">Seleccionar Opción</option>
          <v-options store="town" display-field="name" value-field="id" />
        </v-select>
      </v-fieldset>

      <v-fieldset legend="Ubicación" class="v-form">
        <label>DIRESA:</label>
        <div>ANCASH</div>
        <label>Provincia:</label>
        <v-select ref="province" storage="province_selected" v-model="o.province" :required="true"
          @input="$refs.district.load({ code: o.province })">
          <option>Select One...</option>
          <v-options store="province" display-field="name" value-field="code" />
        </v-select>
        <label>Distrito:</label>
        <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province"
          v-model="o.district" name="district" required="true" @input="$refs.cpSelect.load({ id: o.district })">
          <option value="">Select One...</option>
          <v-options store="district" value-field="code" display-field="name" />
        </v-select>

        <label>Centro Poblado:</label>
        <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.district"
          required="required" ref="cpSelect" v-model="o.codigo_ccpp" @input="inputCCPP">
          <option value="">Seleccionar Opción</option>
          <v-options store="town" display-field="name" value-field="id" />
        </v-select>

        <label>Dirección:</label>
        <v-textarea v-model="o.direccion" />
        <label>Refencia:</label>
        <v-textarea v-model="o.refencia" />
        <label>Sector:</label>
        <v-textarea v-model="o.sector" />
        <label>HC:</label>
        <input v-model="o.hc" />
        <label>DNI:</label>
        <input v-model="o.dni" />
        <label>Apellidos y Nombres:</label>
        <input v-model="o.apellidos_nombres" />
        <label>Fecha Nacimiento:</label>
        <v-calendar v-model="o.fecha_nacimiento" />
        <label>Financiador:</label>
        <input v-model="o.financiador" />
        <label>Telefono:</label>
        <input v-model="o.telefono" />
        <label>Sexo:</label>
        <v-radio-group required="true" v-model="o.sexo">
          <v-radio label="Masculino" value="M"></v-radio>
          <v-radio label="Femenino" value="F"></v-radio>
        </v-radio-group>
        <label>Menarquia:</label>
        <input v-model="o.menarquia" />
        <label>IRS:</label>
        <input v-model="o.irs" />
        <label>Andria:</label>
        <input v-model="o.andria" />
        <label>Paridad:</label>
        <input v-model="o.paridad" />
        <label>FUR:</label>
        <input v-model="o.fur" />
        <label>Telefono Contacto:</label>
        <input v-model="o.telefono_contacto" />
      </v-fieldset>


      <label>Coordenadas:</label>
      <v-map ref="map" v-on:build="mapBuild" style="height: 400px; border: 1px solid lightgrey"
        v-on:translateend="translateend">
        <v-layer-control />
        <v-map-control v-on:click="addMarker" style="bottom: 30px; right: 10px" icon="fa-map-marker" />
      </v-map>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
      <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
  $router.replace(
    '/admin/desarrollo-social/cancer/' + (o.tmpId ? -o.tmpId : o.id)
  )
      "></v-button>
    </center>
  </v-form>
</template>
<script>
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Geolocation } from "@capacitor/geolocation";
import "ol/ol.css";
import Feature from "ol/Feature";
import Icon from "ol/style/Icon";
var ol = window.ol;
ol.style.Icon = Icon;
ol.style.Feature = Feature;
var { _, axios } = window;
export default _.ui({
  props: ["id"],
  data() {
    return {
      count: 0,
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
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        synchronized: null,
        lat: null,
        tmpId: null,
        lon: null,
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
      me.getStoredList("cancer").then((cancers) => {
        cancers.forEach((e) => {
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
              .transaction(["cancer"], "readwrite")
              .objectStore("cancer")
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
      this.o.ccpp = b ? b.object.name || "" : "";
    },
    inputEstablishment(a, b) {
      this.o.establecimientoSalud = b ? b.object.name : "";
    },
    process(o) {
      if (!this.trayLocation) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    changeImage(result) {
      var me = this,
        o = me.o;
      o.tempFile = result.tempFile;
      if (o.id > 0) {
        result.id = o.id;
        axios
          .post("/admin/desarrollo-social/api/cancer/attach-image", result)
          .then(() => {
            if (o.tmpId) {
              var objectStore = _.db.transaction(["cancer"], "readwrite")
                .objectStore("cancer");
              var item = objectStore.get(o.tmpId);
              item.onsuccess = () => {
                objectStore.put(o);
              };
            }
            me.app.toast("Imagen adjuntada!");
          });
      }
    },
    mapBuild() {
      var o = this.o;
      if (0 > o.lon) {
        alert(o.lon + '  ' + o.lat);
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
        m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
      } else
        m.map.getView().animate({
          center: m.collection.item(0).getGeometry().getCoordinates(),
          zoom: 17,
          duration: 500,
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
                  var src = Capacitor.convertFileSrc(s.uri);
                  if (me.online) {
                    fetch(src)
                      .then((r) => r.blob())
                      .then((b) => {
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
                if (me.online)
                  uploader.submitFile(b, "name." + result.format);
              });
          }
        }
      });
    },
    async changeRoute() {
      var me = this,
        id = me.id, m = me.$refs.map;
      me.trayLocation = 0;
      /*me.$refs.red.load();
      me.$refs.emergencyRed.load();
      me.$refs.migra_red.load();*/
      if (id < 0) {
        me.getStoredList("cancer").then((cancer) => {
          cancer.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              me.$refs.province.load({ code: me.o.region || "02" });
              me.trayLocation = e.lat && e.lon;
              alert(me.trayLocation);
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/admin/desarrollo-social/api/cancer/" + id)
          .then((response) => {
            var o = response.data;
            if (o.province) {
              o.province = me.pad(o.province, 4);
              o.region = o.province.substring(0, 2);
            }
            if (o.district) o.district = me.pad(o.district, 6);
            me.trayLocation = 1;
            me.o = o;
            m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
            me.$refs.province.load({ code: me.o && me.o.region || '02' });
          });
      } else {
        try {
          var s = localStorage.getItem("setting");
          if (s) {
            s = JSON.parse(s);
            var o = this.o;
            if (s.region) o.region = s.region.code;
            if (s.province) o.province = s.province.code;
            if (s.district) o.district = s.district.code;
            if (s.town) o.codigoCCPP = s.town.id;
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
        me.$router.replace("/admin/desarrollo-social/cancer/" + nid);
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