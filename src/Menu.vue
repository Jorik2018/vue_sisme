<template>
  <div>
    <ion-menu
      :key="'menu-' + counter"
      side="start"
      menu-id="menuprincipal"
      content-id="main"
      ref="menu"
      swipe-gesture="false"
      mode="md"
      style="z-index: 9999999"
    >
      <ion-header mode="md">
        <ion-toolbar mode="md">
          <ion-title v-if="session && session.people">
            <div
              class="center"
              v-for="(o, i) in [session.people]"
              v-bind:key="i"
              style="
                color: white;
                text-align: center;
                white-space: normal;
                padding: 20px;
              "
            >
              <table align="center">
                <tr>
                  <td style="width: 50%">
                    <div
                      style="
                        border: 1px solid gray;
                        overflow-y: hidden;
                        width: 140px;
                        height: 140px;
                        border-radius: 50%;
                      "
                    >
                      <img v-bind:key="'men-'+app.ki" style="width: 100%;object-fit: cover;height: 100%;" v-bind:src="baseURL+'/fs/profile/'+app.profileImg" 
												v-on:error="$event.target.src=imgError">
                    </div>
                  </td>
                  <td style="text-align: left; padding-left: 10px">
                    <div style="color: blue">
                      Hola,<br />{{ o.display_name }}
                    </div>
                  </td>
                </tr>
              </table>
            </div>
            <span
              style="right: 0px; position: absolute; top: 10px"
              v-on:click="$ionic.menuController.close('menuprincipal')"
              ><i class="fa fa-times"></i
            ></span>
          </ion-title>
          <ion-title v-if="false">
            <div
              class="center"
              v-for="(o, i) in [session.people]"
              v-bind:key="i"
              style="
                color: white;
                padding: 20px 0px;
                background-color: #0f62ac;
                border-bottom-right-radius: 60%;
              "
            >
              <div
                v-if="o.urlPerfil"
                style="
                  margin-left: 23%;
                  overflow-y: hidden;
                  width: 170px;
                  height: 140px;
                  border-radius: 50%;
                "
              >
                <img
                  style="width: 100%"
                  v-bind:src="baseURL + '/fs/shami/profile/' + app.profileImg"
                />
              </div>
              <div style="margin-top: 10px">
                {{ o.nombres }} {{ o.apPaterno }} {{ o.apMaterno }}
              </div>
              <div>{{ session.user }}</div>
            </div>
          </ion-title>
        </ion-toolbar>
      </ion-header>
      <ion-content>
        <ion-item href="/admin">
          <i class="fa fa-home"></i>Inicio
        </ion-item>
        <ion-item href="/admin/profile">
          <i class="fa fa-user"></i>Mi Cuenta
        </ion-item>
        <ion-item href="/admin/setting">
          <i class="fa fa-sliders-h"></i>Configuración
        </ion-item>
        <ion-item v-if="perms.MCI_READ" href="/admin/desarrollo-social/sivico">
          <i class="fa fa-table"></i>MCI
        </ion-item>
        <ion-item v-if="perms.DESARROLLO_SOCIAL_ADULTO_MAYOR_READ" href="/admin/desarrollo-social/adulto-mayor">
          <i class="fa fa-table"></i>Adulto Mayor
        </ion-item>
        <ion-item v-if="perms.EMED_READ" href="/admin/desarrollo-social/emed">
          <i class="fa fa-table"></i>EMED
        </ion-item>
        <ion-item v-if="perms.VEA_MATERNO_READ" href="/admin/desarrollo-social/vea-materno">
          <i class="fa fa-table"></i>VEA Materno
        </ion-item>
        <ion-item v-if="perms.CANCER_READ" href="/admin/desarrollo-social/cancer">
          <i class="fa fa-table"></i>Cancer
        </ion-item>
        <ion-item v-if="perms.INVENTORY_ADMIN" href="/admin/inventory/item">
          <i class="fa fa-table"></i>Inventario
        </ion-item>
        <ion-item
          v-if="perms.PREGNANT_READ"
          href="/admin/desarrollo-social/pregnant"
        >
          <i class="fa fa-person-pregnant"></i>Gestantes
        </ion-item>



        <ion-item v-if="perms.PAYROLL_READ" href="/admin/hr/employee">
        <i class="fa fa-table"></i>Empleados
      </ion-item>
      <ion-item  v-if="perms.PAYROLL_READ" href="/admin/payroll/chd">
        <i class="fa fa-table"></i>Constancia de Pago de Haberes y Descuentos
      </ion-item>
      <ion-item  v-if="perms.PAYROLL_READ" href="/admin/payroll/people">
        <i class="fa fa-table"></i>Registrar Montos Anuales
      </ion-item>
        <!--ion-item v-if="session.perms.supervise" href="/shami/supervise">
					<i class="fa fa-users"></i>Monitores
				</ion-item-->
        <ion-item class="_" v-show="online">
          <i class="fa fa-exclamation-triangle"></i>
          <v-checkbox 
            v-model="app.connected"
            label="Connectado"
          />
        </ion-item>
        <ion-item class="_" v-show="!online">
          <i class="fa fa-exclamation-triangle"></i>
          Sin Conección 
        </ion-item>
        <hr
          style="background: #d5d5d5; margin-top: 10px; margin-bottom: 10px"
        />
        <ion-item href="/logout" class="_" v-on:click.prevent="app.logout">
          <i class="fa fa-sign-out-alt"></i>Cerrar Sessión
        </ion-item>
      </ion-content>
    </ion-menu>
  </div>
</template>
<script>
import { IonMenu } from "@ionic/vue";
import { useCounterStore } from "./store/counter";
import { storeToRefs } from "pinia";
import { defineComponent } from "vue";
//import { defineComponent } from '@vue/composition-api';

export default defineComponent(
  window.ui({
    setup() {
      const { counter } = storeToRefs(useCounterStore());
      return { counter, imgError: null };
    },
    /*data() {
    return { imgError: null };
  },*/
    components: { IonMenu },
    created() {
      var me = this;
      this.imgError = require("@/cdn/images/smile.png");
      if (me.session.people) me.app.profile = me.session.people.urlPerfil;
    },
    mounted() {
      this.app.bindLinks(this.$el, this.hide);
    },
    update() {
      this.app.bindLinks(this.$el, this.hide);
    },

    methods: {
      hide() {
        this.$ionic.menuController.close("menuprincipal");
      }
    },
  })
);
</script>
<style scope>
a {
  display: inline-block;
}
.controls a:not(:last-child) {
  display: inline-block;
  margin-right: 10px;
}
.alert {
  padding: 20px;
  background-color: #fff7a8;
  font-size: 20px;
  border: 1px solid #ffca69;
  border-radius: 5px;
  color: black;
}
.v-main {
  padding: 0px;
  background-color: #fff;
}
.contact svg {
  margin-right: 10px;
  color: orange;
  font-size: 25px;
}
.v-ss {
  background-color: #ffecbd;
  border-radius: 35px 35px 0 0;
  float: left;
}
li > .v-primary-dark {
  width: calc(100% - 20px) !important;
  margin: 0px;
}
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s;
}
.fade-enter, .fade-leave-to /* .fade-leave-active below version 2.1.8 */ {
  opacity: 0;
}
.v-input-field svg {
  margin: 5px;
  opacity: 0.5;
}
.v-form input,
.v-form select,
.v-form textarea {
  border-radius: 8px !important;
}
.v-input-field input {
  width: calc(100% - 31px) !important;
  border-radius: 8px !important;
  padding-left: 26px !important;
}
.v-tab-content > span {
  text-align: justify;
  padding: 5px 0px;
}
.v-accordion > div:not(:last-child) > .v-tab-content {
  padding-bottom: 20px;
}
.v-accordion > div:not(:last-child) {
  border-bottom: 1px solid gray;
}
.v-accordion > * > .expanded {
  font-weight: bolder;
}
.category2 {
  display: inline-block;
}

#page-header > * {
  min-height: unset;
}
.tre a > svg {
  width: 25px !important;
}
.item.md.in-list {
  border-bottom: 1px solid #bfbfbf !important;
}
ion-menu.item {
  top: 0px;
  -border-bottom: 1px solid #bfbfbf !important;
}
.item-inner {
  border-bottom-width: 0px !important;
}
.item-inner,
:host,
ion-item .item-inner,
.item-inner,
.item-native.item-inner,
.item-inner:host {
  --inner-border-width: 0 0 0px 0 !important;
}
ion-menu svg {
  color: #36569e;
  width: 20px !important;
  margin-bottom: 2px;
  margin-right: 10px;
}
</style>