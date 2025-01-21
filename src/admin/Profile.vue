<template>
  <div class="view">
    <template v-if="!o">No se pudo recuperar informacion</template>
    <template v-if="o">
      <div class="center" style="padding: 20px; border-radius: 10px">
        <div
          style="
            overflow-y: hidden;
            width: calc(100vw - 90px);
            height: calc(100vw - 90px);
            border-radius: 50%;
          "
        >
          <img
            :key="img"
            style="width: 100%"
            onerror="this.src=window.logo;this.className='error'"
            :src="baseURL + '/thumb/160/profile/' + app.profileImg"
          />
        </div>
        <div>{{ o.fullName }}</div>
        <label>Usuario</label>
        <div>{{ session.usuario }}</div>
        <div class="right" style="margin-top: 10px">
          <v-uploader
            icon="image"
            value=""
            :click="test"
            @input="changeImage($event.tempFile)"
          />
        </div>
      </div>
      <v-fieldset legend="Informaci&oacute;n de contacto">
        <div class="right">
          <span v-show="!editContact" class="v-controls">
            <span @click="editContact = 1"><i class="fa fa-edit"></i></span>
          </span>
          <span v-show="editContact" class="v-controls">
            <span @click="saveContact"><i class="fa fa-save"></i></span>
            <span @click="editContact = 0"><i class="fa fa-times"></i></span>
          </span>
        </div>
        <div class="v-form">
          <label>Nombres:</label>
          <div v-if="!editContact">{{ o.names ? o.names : "---" }}</div>
          <input v-if="editContact" required="true" v-model="o.names" />
          <label>Apellido Paterno:</label>
          <div v-if="!editContact">
            {{ o.firstSurname ? o.firstSurname : "---" }}
          </div>
          <input v-if="editContact" v-model="o.apPaterno" />
          <label>Apellido Materno:</label>
          <div v-if="!editContact">
            {{ o.lastSurname ? o.lastSurname : "---" }}
          </div>
          <input v-if="editContact" v-model="o.apMaterno" />
          <label>Correo:</label>
          <div v-if="!editContact" required="true">
            {{ o.mail ? o.mail : "---" }}
          </div>
          <input v-if="editContact" v-model="o.mail" />
          <label>Sexo:</label>
          <div v-if="!editContact">
            {{ o.sex ? (o.sex == "M" ? "Masculino" : "Femenino") : "---" }}
          </div>
          <v-radio-group v-if="editContact" v-model="o.sex">
            <v-radio value="M" label="Masculino"></v-radio>
            <v-radio value="F" label="Femenino"></v-radio>
          </v-radio-group>
          <label>Celular:</label>
          <div v-if="!editContact">{{ o.phone ? o.phone : "---" }}</div>
          <input v-if="editContact" v-model="o.phone" />
        </div>
      </v-fieldset>
      <v-fieldset legend="Direcci&oacute;n de env&iacute;o">
        <div class="right">
          <span class="v-controls" v-show="!editAddress">
            <span @click="editAddress = 1"><i class="fa fa-edit"></i></span>
          </span>
          <span class="v-controls" v-show="editAddress">
            <span @click="saveAddress"><i class="fa fa-save"></i></span>
            <span @click="editAddress = 0"><i class="fa fa-times"></i></span>
          </span>
        </div>
        <div class="v-form">
          <label>Departamento:</label>
          <div v-if="!editAddress" :title="o.idDep">
            {{ o.departamento ? o.departamento : "---" }}
          </div>
          <v-select
            v-model="o.ext.region"
            v-if="editAddress"
            @input="$refs.provinceSelect.load({ regionId: o.ext.region.code })"
          >
            <option value="">Seleccionar Opci&oacute;n</option>
            <v-options
              url="/api/directory/region/0/0"
              display-field="name"
            />
          </v-select>
          <label>Provincia:</label>
          <div v-if="!editAddress" :title="o.idProv">
            {{ o.provincia ? o.provincia : "---" }}
          </div>
          <v-select
            :disabled="!o.ext.region"
            ref="provinceSelect"
            v-if="editAddress"
            v-model="o.ext.province"
            @input="
              $refs.districtSelect.load({ provinceId: o.ext.province.code })
            "
          >
            <option value="">Seleccionar Opci&oacute;n</option>
            <v-options
              url="/api/directory/province/0/0"
              display-field="name"
            />
          </v-select>
          <label>Distrito:</label>
          <div v-if="!editAddress" :title="o.idDist">
            {{ o.distrito ? o.distrito : "---" }}
          </div>
          <v-select
            :disabled="!o.ext.province"
            ref="districtSelect"
            v-if="editAddress"
            v-model="o.ext.district"
          >
            <option value="">Seleccionar Opci&oacute;n</option>
            <v-options
              url="/api/directory/district/0/0"
              display-field="name"
            />
          </v-select>
          <label>Direcci&oacute;n:</label>
          <div v-if="!editAddress">{{ o.address ? o.address : "---" }}</div>
          <input v-if="editAddress" v-model="o.address" maxlength="10" />
        </div>
      </v-fieldset>
      <v-fieldset legend="Cambio de clave">
        <div class="controls right">
          <i @click="changePassword" class="fa fa-save"></i>
        </div>
        <div class="v-form">
          <label>Contraseña actual:</label>
          <input type="password" v-model="o.pass" />
          <label>Contraseña nueva:</label>
          <input type="password" v-model="o.newPass" />
          <label>Repetir contraseña nueva:</label>
          <input type="password" v-model="o.confirm" />
        </div>
      </v-fieldset>
    </template>
  </div>
</template>
  <script>
import { Camera, CameraResultType } from '@capacitor/camera';
var {_,axios} = window;
export default _.ui({
  data () {
    return {
      o: null,
      count: 0,
      tab: 0,
      editContact: 0,
      editAddress: 0,
      img: 0,
    };
  },
  created() {
    var me=this;
    me.app.title = "Cuenta";
    window.logo = require("@/cdn/images/No_image.svg");
    axios.get("/api/user/" + (me.session.uid || "me")).then((d) => {
      var o = d.data;
      o.ext = {};
      if (!o.people) o.people = {};
      me.o = o;
    });
  },
  methods: {
    changeImage(url) {
      var me = this;
      axios
        .post("/api/user/image", {
          image: url
        })
        .then((result) => {
          me.urlPerfil = result.data.trim();
          me.img++;
        });
    },
    saveContact() {
      var me = this;
      var o = JSON.clone(me.o);
      delete o.ext;
      axios.put("/api/user/profile", o).then(function () {
        me.editContact = 0;
      });
    },
    saveAddress() {
      var me = this;
      axios.put("/api/user/save-address", JSON.clone(me.o)).then(function () {
        me.editAddress = 0;
      });
    },
    changePassword() {
      var me = this;
      axios
        .put("/api/user/change-password", {
          svdUsuarios: { usuario: me.session.usuario, clave: me.o.pass },
          claveNueva: me.o.newPass,
        })
        .then(function () {
          _.MsgBox("Contraseña actualizada.");
        });
    },
    test(u) {
      var me = this;
      me.count++;
      Camera.getPhoto({
        quality: 100,
        allowEditing: true,
        //source: CameraSource.Prompt,
        resultType: CameraResultType.Uri,
      }).then(function (result) {
        me.count--;
        if (me.count == 0) {
          fetch(result.webPath)
            .then((r) => r.blob())
            .then(function (b) {
              u.submitFile(b, "name." + result.format);
            });
        }
      });
    },
  },
});
</script>
  <style scope>
img.error {
  padding: 30% !important;
  width: 40% !important;
  background-color: transparent;
}
.cart-control > * {
  display: block;
  width: 90%;
}
.cart-control > *:not(:last-child) {
  margin-bottom: 10px;
}
.controls a:not(:last-child) {
  display: inline-block;
  margin-right: 10px;
}
.controls {
  position: relative;
}
.controls > *:not(:last-child) {
  margin-right: 10px;
}
fieldset > div {
  padding: 10px;
}
.view {
  padding: 15px;
}
</style>