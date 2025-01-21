<template>
  <v-form action="/api/desarrollo-social/cancer" :header="(o.id ? 'Editar' : 'Crear') + '  Registro Cancer'"
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
        <label>DNI:</label>
        <input v-model="o.dni" class="center"/>
        <label>Apellidos y Nombres:</label>
        <input v-model="o.apellidos_nombres" />
        <label>Fecha Nacimiento:</label>
        <v-calendar v-model="o.fecha_nacimiento" @input="inputEdad"/>
        <label>Edad:</label>
        <div class="readonly">{{ ((age==o.edad?'':( age||age==0?age:'---')+' -> '))+( o.edad||o.edad==0?o.edad:'---')}}</div>
        <label>Sexo:</label>
        <v-radio-group required="true" v-model="o.sexo">
          <v-radio label="Masculino" value="M"></v-radio>
          <v-radio label="Femenino" value="F"></v-radio>
        </v-radio-group>

        <label>Red:</label>
        <v-select v-model="o.red" ref="red"
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
        <v-select ref="establishment" @input="inputEstablishment" v-model="o.eess_code" :autoload="false"
          :disabled="!o.microred" :required="true">
          <option>Select One...</option>
          <v-options store="establishment" display-field="name" value-field="code" />
        </v-select>
        <label>HC:</label>
        <input v-model="o.hc" />
        <label :title="o.financiador">Financiador:</label>
        <v-select v-model="o.financiador" required="required">
          <option v-for="item in financiador" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
        
        <label>Telefono:</label>
        <input v-model="o.telefono" />
        <label>Menarquia:</label>
        <input v-model="o.menarquia" />
        <label>IRS:</label>
        <input v-model="o.irs" />
        <label>Andria:</label>
        <input v-model="o.andria" />
        <label>Paridad:</label>
        <input v-model="o.paridad" />
        <label>FUR:</label>
        <v-calendar v-model="o.fur" />
        <label>Telefono Contacto:</label>
        <input v-model="o.telefono_contacto" />
      </v-fieldset>

      <v-fieldset legend="Ubicación" class="v-form">
        <label>DIRESA:</label>
        <div>ANCASH</div>
        <label>Provincia:</label>
        <v-select ref="province" storage="province_selected" v-model="o.province_code" :required="true"
          @input="inputProvince">
          <option>Select One...</option>
          <v-options store="province" display-field="name" value-field="code" />
        </v-select>
        <label>Distrito:</label>
        <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province_code"
          v-model="o.district_code" name="district" required="true" @input="inputDistrict">
          <option value="">Select One...</option>
          <v-options store="district" value-field="code" display-field="name" />
        </v-select>
        <label>Centro Poblado:</label>
        <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.district_code"
          required="required" ref="ccpp" v-model="o.ccpp_code" @input="inputCCPP">
          <option value="">Seleccionar Opción</option>
          <v-options store="town" display-field="name" value-field="id" />
        </v-select>
        <div>{{o.province}}/{{o.district}}/{{o.ccpp}}</div>
        <label>Dirección:</label>
        <v-textarea v-model="o.direccion" maxlength="255"/>
        <label>Referencia:</label>
        <v-textarea v-model="o.referencia" maxlength="255"/>
        <label>Sector:</label>
        <v-textarea v-model="o.sector" maxlength="255"/>
      </v-fieldset>


      <!--label>Coordenadas:</label>
      <v-map ref="map" v-on:build="mapBuild" style="height: 400px; border: 1px solid lightgrey"
        v-on:translateend="translateend">
        <v-layer-control />
        <v-map-control v-on:click="addMarker" style="bottom: 30px; right: 10px" icon="fa-map-marker" />
      </v-map-->
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
      age:null,
      financiador:[
        "NINGUNA","SIS", "ESSALUD", "PRIVADA", "PNP" 
      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        province_code:null,
        district_code:null,
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
    inputEdad(){
      this.o.edad=this.o.fecha_nacimiento?this.app.getAge(this.o.fecha_nacimiento):null;
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
    inputProvince(a,b){
      var me=this,o=me.o;
      o.province=(b ? b.object.name || "" : "");
      me.$refs.district.load({ code: o.province_code })
    },
    inputDistrict(a,b){
      var me=this,o=me.o;
      o.district=b ? b.object.name || "" : "";
      me.$refs.ccpp.load({ id: o.district_code })
    },
    inputCCPP(a, b) {
      this.o.ccpp = b ? b.object.name || "" : "";
    },
    inputEstablishment(a, b) {
      this.o.establecimiento = b ? b.object.name : "";
    },
    process(o) {
      if (!this.trayLocation) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
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
        if(m)
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
        id = me.id, m = me.$refs.map;me.age=0;
      me.trayLocation = 0;
      if (id < 0) {
        me.getStoredList("cancer").then((cancer) => {
          cancer.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              if(m)
              m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              me.$refs.province.load({ code: me.o.region || "02" });
              me.trayLocation = Number(e.lat) && e.lon;
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/desarrollo-social/cancer/" + id)
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
            if (o.district_code) o.district_code= me.pad(o.district_code, 6);
            if (o.ccpp_code) o.ccpp_code= me.pad(o.ccpp_code, 10);
            me.trayLocation = 0;
            me.o = o;
            me.age=o.edad;
            if(Number(o.lat)&&Number(o.lon)){
              if(m)
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