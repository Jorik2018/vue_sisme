<template>
  <v-form
    id="DsPeopleList"
    header="Empadronamiento"
    action="/admin/desarrollo-social/census"
  >
    <v-table
      v-bind:selectable="true"
      v-bind:scrollable="true"
      rowKey="id"
      v-bind:pagination="20"
      row-style-class="row.tmpSynchronized?'green':(row.tmpId>0?'yellow':'')"
      storage="census"
      src="/api/desarrollo-social/census"
      v-bind:filters="filters"
    >
      <template v-slot:header="">
        <!--v-button value="Crear" icon="fa-plus" class="on" v-on:click.prevent="create"/-->
        <v-button
          value="Editar"
          icon="fa-pen"
          v-if="canRegister()"
          v-on:click.prevent="edit"
          v-bind:disabled="
            rowSelectedCount == 0 || !canRegister(getSelected()[0])
          "
        ></v-button>
        <!--v-button value="Agregar Pariente" icon="fa-plus" v-on:click.prevent="add(getSelected())" v-if="canRegister(getSelected())" v-bind:disabled="rowSelectedCount==0||!isBoss(getSelected()[0])"/-->
        <v-button
          icon="fa-search"
          v-on:click.prevent="view(getSelected())"
          v-bind:disabled="rowSelectedCount == 0"
          value="Ver"
        ></v-button>
        <v-button
          value="Eliminar"
          v-if="canRegister()"
          icon="fa-trash"
          v-on:click.prevent="destroy"
          v-bind:disabled="rowSelectedCount == 0"
        ></v-button>
        <v-button
          value="Descargar"
          icon="fa-download"
          v-if="perms.ADMIN_DESARROLLO_SOCIAL || user.uid == 1"
          v-on:click.prevent="download"
        ></v-button>
        <v-button
          title="Refrescar"
          icon="fa-sync"
          v-on:click.prevent="refresh"
        ></v-button>
        <v-button
          title="Enviar al Servidor"
          v-if="online"
          icon="fa-database"
          class="on"
          v-bind:disabled="rowSelectedCount == 0 || !canSync(getSelected()[0])"
          v-on:click.prevent="sync"
        ></v-button>
      </template>
      <template v-slot:default="{ row }">
        <td width="80" class="center" header="ID">
          {{row.id?pad(row.id,6):'?'}}
        </td>
        <td width="80" class="center" header="Familia">
          {{row.masterId?pad(row.masterId,6):'?'}}
        </td>
        <td width="80" class="center" header="Jefe">{{ row.bossId }}</td>
        <td width="160" header="Provincia">
          {{ row.provinceName ? row.provinceName : row.province }}
        </td>
        <td width="160" header="Distrito">
          {{ row.districtName ? row.districtName : row.district }}
        </td>
        <td width="160" header="CCPP">
          {{ row.townName ? row.townName : row.ccpp }}
        </td>
        <td width="80" class="center" header="DNI">{{ row.code }}</td>
        <td width="200" header="ApPaterno">{{ row.apPaterno }}</td>
        <td width="200" header="ApMaterno">{{ row.apMaterno }}</td>
        <td width="200" header="Nombres">{{ row.names }}</td>
        <td width="100" header="Telefono">{{ row.phone }}</td>
        <td width="80" class="center" header="Fecha Nacimiento">
          {{ row.birthdate | date }}
        </td>
        <td width="60" class="center" header="Sexo">{{ row.sex }}</td>
        <td width="80" class="center" header="Parentesco">
          {{ row.relationshipName ? row.relationshipName : row.relationship }}
        </td>
        <td width="100" header="Estado Civil">{{ row.civilStatus }}</td>
        <td width="140" header="Grado de Instrucci&oacute;n">
          {{ row.degreeInstruction }} {{ row.otherDegreeInstruction }}
        </td>
        <td width="120" class="center" header="Ocupaci&oacute;n">
          {{ row.occupationName ? row.occupationName : row.occupation }}
        </td>
        <td width="80" class="center" header="Idioma">
          {{ row.languageName ? row.languageName : row.language }}
        </td>
        <td width="120" header="Religi&oacute;n">
          {{ row.religion }} {{ row.otherReligion }}
        </td>
        <td width="80" class="center" header="Seguro">
          {{ row.assuredName ? row.assuredName : row.assured }}
        </td>
        <td width="160" header="Establecimiento">
          {{ row.establishment }} {{ row.establishmentName }}
        </td>
        <td width="90" class="center" header="Embarazada">
          <i
            style="display: inline-block"
            v-bind:class="row.pregnant ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="90" class="center" header="Discapacitado">
          <i
            style="display: inline-block"
            v-bind:class="row.disability ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="90" class="center" header="Hipertenso">
          <i
            style="display: inline-block"
            v-bind:class="row.hypertensive ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="80" class="center" header="Puerpera">
          <i
            style="display: inline-block"
            v-bind:class="row.puerpera ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="80" class="center" header="Intevenci�n COVID?">
          <i
            style="display: inline-block"
            v-bind:class="row.covid ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="80" class="center" header="Obesidad">
          <i
            style="display: inline-block"
            v-bind:class="row.obesity ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="80" class="center" header="Diabetes">
          <i
            style="display: inline-block"
            v-bind:class="row.diabetes ? 'fa fa-check' : ''"
          ></i>
        </td>
        <td width="90" class="center" header="Coordenadas">
          {{0>row.lat&&0>row.lon?'SI':'NO'}}
        </td>
        <td width="80" class="center" header="Usuario">{{ row.user }}</td>
        <td width="80" class="center" header="Fecha Actualizaci&oacute;n">
          {{ row.updateDate | date }}
        </td>
      </template>
      <template v-slot:filters>
        <v-filter index="0">
          <input v-model="filters.id" /> </v-filter
        ><v-filter index="1">
          <input v-model="filters.masterId" /> </v-filter
        ><v-filter index="2">
          <input v-model="filters.bossId" /> </v-filter
        ><v-filter index="3">
          <input v-model="filters.province" /> </v-filter
        ><v-filter index="4">
          <input v-model="filters.district" /> </v-filter
        ><v-filter index="5">
          <input v-model="filters.ccpp" /> </v-filter
        ><v-filter index="6">
          <input v-model="filters.code" maxlength="8" /> </v-filter
        ><v-filter index="7">
          <input v-model="filters.apPaterno" /> </v-filter
        ><v-filter index="8">
          <input v-model="filters.apMaterno" /> </v-filter
        ><v-filter index="9">
          <input v-model="filters.names" /> </v-filter
        ><v-filter index="10">
          <input v-model="filters.phone" /> </v-filter
        ><v-filter index="11">
          <input v-model="filters.birthdate" /> </v-filter
        ><v-filter index="12">
          <input v-model="filters.sex" /> </v-filter
        ><v-filter index="13">
          <input v-model="filters.relationship" /> </v-filter
        ><v-filter index="14">
          <input v-model="filters.civilStatus" /> </v-filter
        ><v-filter index="15">
          <input v-model="filters.degreeInstruction" /> </v-filter
        ><v-filter index="16">
          <input v-model="filters.occupation" /> </v-filter
        ><v-filter index="17">
          <input v-model="filters.language" /> </v-filter
        ><v-filter index="18">
          <input v-model="filters.religion" /> </v-filter
        ><v-filter index="19">
          <input v-model="filters.assured" /> </v-filter
        ><v-filter index="20">
          <input v-model="filters.establishment" /> </v-filter
        ><v-filter index="21">
          <input v-model="filters.pregnant" /> </v-filter
        ><v-filter index="22">
          <input v-model="filters.disability" /> </v-filter
        ><v-filter index="23">
          <input v-model="filters.hypertensive" /> </v-filter
        ><v-filter index="24">
          <input v-model="filters.puerpera" /> </v-filter
        ><v-filter index="25">
          <input v-model="filters.covid" /> </v-filter
        ><v-filter index="26">
          <input v-model="filters.obesity" /> </v-filter
        ><v-filter index="27">
          <input v-model="filters.diabetes" /> </v-filter
        ><v-filter index="28">
          <input v-model="filters.lat" /> </v-filter
        ><v-filter index="29">
          <input v-model="filters.user" /> </v-filter
        ><v-filter index="30">
          <input v-model="filters.updateDate" />
        </v-filter>
      </template>
      <template v-slot:columns>
        <td width="80" header="ID"></td>
        <td width="80" header="Familia"></td>
        <td width="80" header="Jefe"></td>
        <td width="160" header="Provincia"></td>
        <td width="160" header="Distrito"></td>
        <td width="160" header="CCPP"></td>
        <td width="80" header="DNI"></td>
        <td width="200" header="ApPaterno"></td>
        <td width="200" header="ApMaterno"></td>
        <td width="200" header="Nombres"></td>
        <td width="100" header="Telefono"></td>
        <td width="80" header="Fecha Nacimiento"></td>
        <td width="60" header="Sexo"></td>
        <td width="80" header="Parentesco"></td>
        <td width="100" header="Estado Civil"></td>
        <td width="140" header="Grado de Instrucci&oacute;n"></td>
        <td width="120" header="Ocupaci&oacute;n"></td>
        <td width="80" header="Idioma"></td>
        <td width="120" header="Religi&oacute;n"></td>
        <td width="80" header="Seguro"></td>
        <td width="160" header="Establecimiento"></td>
        <td width="90" header="Embarazada"></td>
        <td width="90" header="Discapacitado"></td>
        <td width="90" header="Hipertenso"></td>
        <td width="80" header="Puerpera"></td>
        <td width="80" header="Intevenci�n COVID?"></td>
        <td width="80" header="Obesidad"></td>
        <td width="80" header="Diabetes"></td>
        <td width="90" header="Coordenadas"></td>
        <td width="80" header="Usuario"></td>
        <td width="80" header="Fecha Actualizaci&oacute;n"></td>
      </template>
    </v-table>
    <div style="display: none; text-align: initial; margin-bottom: 20px">
      <div id="downloadDlg" class="v-form">
        <label>Tipo de Archivo:</label>
        <v-radio-group v-model="option">
          <v-radio value="PDF"></v-radio>
          <v-radio value="XLS"></v-radio>
        </v-radio-group>
      </div>
    </div>
  </v-form>
</template>
<script>
import "ol/ol.css";
import Vue from "vue";
var {_,axios} = window;
var MsgBox = _.MsgBox;
export default _.ui({
  extends: _.extends,
  mounted() {
    this.app.title = this.$children[0].header;
  },
  created() {
    var me = this,
      user = me.user;
    if (!(user.uid == 1 || me.perms.ADMIN_DESARROLLO_SOCIAL)) {
      me.filters.user = user.id;
    }
    me.filters.uid = user.uid;
  },
  methods: {
    pad: Vue.pad,
    download() {
      var me = this,
        o = {
          format: me.option.toLowerCase(),
          filename: "census." + me.option.toLowerCase(),
        };
      MsgBox(
        document.querySelector("#downloadDlg"),
        function (b) {
          if (b == 0) {
            _.download("/api/desarrollo-social/census/download", o);
          }
        },
        ["Descargar", "Cancelar"]
      );
    },
    process(o) {
      if (0 > Number(o.masterId)) {
        MsgBox("Se debe guardar el registro del hogar con DNI=" + o.ext.bossId);
        return false;
      }
    },
    canSync(o) {
      var me = this,
        user = me.user;
      return o && o.user == user.id && o.tmpId;
    },
    canRegister(row) {
      var me = this,
        user = me.user,
        perms = me.perms;
      return (
        user.uid == 1 ||
        (perms.REGISTER_DESARROLLO_SOCIAL && (!row || row.user == user.id)) ||
        perms.ADMIN_DESARROLLO_SOCIAL
      );
    },
    isBoss(row) {
      return row.bossId == row.code;
    },
    add(o) {
      var me = this,
        f = me.$children[0];
      var action = f.action;
      if (!action) action = window.location.pathname;
      if (me.app)
        me.app.$router.push(
          (_.currentPath = action + "/" + o[0].id + "/add")
        );
      else
        axios
          .get(
            (
              (_.currentPath = action + "/" + o[0].id + "/add") + "?modal"
            ).replace(/([^:]\/)\/+/g, "$1")
          )
          .then(me.open)
          .catch(me.error);
    },
    view (o) {
      var me = this;
      var f = me.$children[0];
      var action = f.action;
      if (!action) action = window.location.pathname;
      if (me.app.$router)
        me.app.$router.push(
          (_.currentPath = action + "/" + o[0].id + "/add")
        );
      else
        axios
          .get(
            ((_.currentPath = action + "/" + o[0].id) + "?modal").replace(
              /([^:]\/)\/+/g,
              "$1"
            )
          )
          .then(me.open)
          .catch(me.error);
    },
  },
  data() {
    return { option: "XLS" };
  },
});
</script>