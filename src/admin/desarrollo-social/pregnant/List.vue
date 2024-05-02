<template>
  <ion-content :scroll-events="true">
    <v-form header="Gestantes" action="/admin/desarrollo-social/pregnant">
      <v-table
        :selectable="true"
        row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
        store="pregnant"
        @loaded="ll"
        :scrollable="true"
        rowKey="id"
        :pagination="20"
        @updated="app.bindLinks($el)"
        :filters="filters"
        src="/api/desarrollo-social/pregnant"
      >
        <template v-slot:header>
          <v-button
            value="Enviar"
            v-if="app.connected"
            icon="fa-save"
            :disabled="!rowSelectedCount"
            @click.prevent="sync"
          ></v-button>
          <v-button
            :title="'Crear '+filters.microredName"
            value="Crear"
            v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)"
            icon="fa-plus"
            class="on"
            @click.prevent="create"
          ></v-button>
          <v-button
            value="Editar"
            v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)"
            icon="fa-pen"
            @click.prevent="edit"
            :disabled="!rowSelectedCount"
          ></v-button>
          <v-button
            value="Ver"
            icon="fa-search"
            @click.prevent="view(getSelected()[0])"
            :disabled="!rowSelectedCount"
          ></v-button>
          <v-button
            value="Eliminar"
            v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)"
            icon="fa-trash"
            @click.prevent="destroy"
            :disabled="!rowSelectedCount"
          ></v-button>
          <v-button
            title="Refrescar"
            icon="fa-sync"
            @click.prevent="refresh"
          ></v-button>
        </template>
        <template v-slot="{ row }">
          <td width="80" class="center" header="ID">
            <v-filter>
              <input v-model="filters.id" />
            </v-filter>
            {{ pad(row.id, 4) }}
          </td>
          <td width="120" sorter="row.visits" class="center" header="Visitas">
            {{ toInt(row.visits) }}
          </td>
          <td width="120" class="center" header="DNI">
            <v-filter>
              <input v-model="filters.numeroDNI" />
            </v-filter>
            {{ toInt(row.numeroDNI) }}
          </td>
          <td width="240" header="Nombre Completo">
            <v-filter>
              <input v-model="filters.fullName" />
            </v-filter>
            {{ row.apellido_paterno }} {{ row.apellido_materno }} {{ row.nombres }}
          </td>
          <td width="120" class="center" header="DIRESA">
            {{ row.diresa }}
          </td>
          <td width="150" class="center" header="Red">
            <v-filter>
              <v-select
                v-model="filters.red"
                ref="red"
                v-on:input="filters.microred=null;filters.microredName=null,$refs.microred.load({ code: filters.red })"
              
              >
                <option value="">Select One...</option>
                <v-options
                  store="red"
                  display-field="name"
                  value-field="code"
                />
              </v-select>
            </v-filter>

            {{ row.red&&row.red.name?row.red.name:pad(row.red, 2) }}
          </td>
          <td width="130" class="center" header="MicroRed">
            <v-filter>
              <div>
              <v-select v-show="filters.red"
                v-model="filters.microred"
                ref="microred"
              >
                <option value="">Select One...</option>
                <v-options
                  store="microred"
                  display-field="name"
                  value-field="code"
                />
              </v-select>
              <input v-show="!filters.red" 
              :title="'microred='+filters.microredName+'-'+filters" v-model="filters.microredName" />
            </div>
            </v-filter>
            {{ row.microred&&row.microred.name?row.microred.name:row.microred }}
          </td>
          <td width="90" class="center" header="Provincia">
            <v-filter>
              <input v-model="filters.province" />
            </v-filter>
            {{ row.province }}
          </td>
          <td width="90" class="center" header="Distrito">
            <v-filter>
              <input v-model="filters.district" />
            </v-filter>
            {{ row.district }}
          </td>
          <td width="100" header="Sector">
            <v-filter>
              <input v-model="filters.sector" />
            </v-filter>
            {{ row.sector }}
          </td>
          <td width="200" header="Dirección">
            <v-filter>
              <input v-model="filters.direccion" />
            </v-filter>
            {{ row.address }}
          </td>
          <td width="200" h-class="hr" header="Informante">
            <v-filter>
              <input v-model="filters.informante" />
            </v-filter>
            {{ row.informante }}
          </td>
          <td width="200" h-class="hr" header="Telefono">
            <v-filter>
              <input />
            </v-filter>
            {{ row.phone }}
          </td>
          <td width="200" h-class="hg" header="Responsable Visita">
            <v-filter>
              <input />
            </v-filter>
            {{ row.responsableVisita }}
          </td>
          <td width="160" class="center" header="Estado Civil">
            {{ row.estadoCivil }}
          </td>
          <td width="240" class="center" header="Grado Instruccion">
            {{ row.gradoInstruccion }}
          </td>
        </template>
      </v-table>
    </v-form>
  </ion-content>
</template>
<script>
var _ = window._;
export default _.ui({
  data() {
    return {t:null ,rowSelectedCount2: 0, page: 0, data: [], mode: 0, query: null ,
    filters:{red:null,microredName:null}
    };
  },
  created() {
    var me=this;
    me.filters.uid = me.user.uid;
    me.filters.fnFullName=(row)=>{
      if(me.filters.fullName){
        let v=(row.apellido_paterno+row.apellido_materno+row.nombres).toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
        if(!v.includes(me.filters.fullName.toUpperCase())){
        return 0;
        }
      }
        /**/
        
        return 1;
    };
    me.$on("sync", function (dr, dl) {
      //data remote -> data local
      if (dr.people && dl.people) {
        dr.people.forEach((pr) => {
          dl.people.forEach((pl) => {
            if (pl.tmpId == pr.tmpId) {
              if (pr.id) {
                pl.id = pr.id;
                pl.tmpSynchronized = 1;
              }
              if (pr.encuesta_id) {
                pl.encuesta_id = pr.encuesta_id;
                pl.parent = pr.encuesta_id;
              }
              console.log(pl);
            }
          });
        });
      }
    });
  },
  updated() {
    this.app.bindLinks(this.$el);
  },
  methods: {
    ll(e) {
      console.log(e);
    },
    /*rss(e) {
      e = e.selection;
      this.rowSelectedCount2 = e ? e.length : 0;
    },*/
    can(o) {
      var m = this,
        u = m.user;
      return o || u.uid == 1;
      /*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
            !o || o.user == u.id;*/
    },
    view(o) {
      console.log(o);
      this.open(
        "/admin/desarrollo-social/pregnant/" + (o.tmpId ? -o.tmpId : o.id)
      );
    },
    toInt(o) {
      return Array.isArray(o) ? o.length : o;
    },
  },
});
</script>
<style scoped>
.hg {
  background-color: green !important;
}
.hgd {
  background-color: #005d00 !important;
}
.hr {
  background-color: #bf0000 !important;
}
.hbd {
  background-color: #033d71 !important;
}
</style>