<template>
  <v-form header="Empleados" style="position: relative" action="/admin/hr/employee">
    <v-table store="poll" v-on:row-select="rss" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
      src="/api/hr/employee" pagination="50" scrollable="true" :filters="filters" @updated="app.bindLinks($el)">
      <template v-slot:header>
        <v-button value="Crear" icon="fa-plus" class="on" v-on:click.prevent="create"></v-button>
        <v-button value="Editar" v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-pen"
          v-on:click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
          <v-button value="Ver" icon="fa-search" v-on:click.prevent="view(getSelected()[0])" 
          :disabled="!rowSelectedCount"></v-button>
        <v-button value="Eliminar" icon="fa-trash" v-show="rowSelectedCount2" v-on:click.prevent="destroy"
          :disabled="!rowSelectedCount"></v-button>
        <v-button title="Refrescar" icon="fa-sync" v-on:click.prevent="refresh"></v-button>
      </template>
      <template v-slot:default="{ row }">
        <td header="ID" width="80" class="center">{{ pad(row.id, 4) }}</td>
        <td header="Codigo" width="120" class="center">{{ row.code }}</td>
        <td header="Nombre Completo" width="320">{{ row.fullName }}</td>
      </template>
    </v-table>
  </v-form>
</template>
<script>
export default window.ui({
  props: ["src"],
  computed: {
    filter() {
      console.log(window.app.session.rol);
      var p = {},
        me = this;
      if (me.query) {
        p.query = me.query;
      }
      return p;
    },
  },
  data() {
    return { rowSelectedCount2: 0, page: 0, data: [], mode: 0, query: null };
  },
  updated() {
    window.app.bindLinks(this.$el);
  },
  mounted() {
    var me = this;
    me.changeRoute();
    me.filters.poll = me.app.poll;
    me.$on("sync", function (dr, dl) {
      if (dr.people && dl.people) {
        for (var ki = 0; ki < dr.people.length; ki++) {
          for (var kj = 0; kj < dl.people.length; kj++) {
            if (dl.people[kj].tmpId == dr.people[ki].tmpId) {
              if (dr.people[ki].id) {
                dl.people[kj].id = dr.people[ki].id;
                dl.people[kj].synchronized = 1;
              }
              if (dr.people[ki].encuesta_id) {
                dl.people[kj].encuesta_id = dr.people[ki].encuesta_id;
              }
              console.log(dl.people[kj]);
            }
          }
        }
      }
    });
  },
  methods: {
    rss(e) {
      e = e.selection;
      this.rowSelectedCount2 = e ? e.length : 0;
    },
    changeRoute() {
      this.resize();
    },
    rewrite(url) {
      return '/admin' + url;
    },
    view(o) {
            this.open('/admin/hr/employee/' + (o.tmpId?(-o.tmpId):o.id));
        },
  },
});
</script>
<style scope>
img.error {
  padding: 40px !important;
  width: calc(100% - 80px) !important;
  background-color: transparent;
}

a {
  display: inline-block;
}

.controls a:not(:last-child) {
  display: inline-block;
  margin-right: 0px;
}

.store-list {
  background-color: rgb(240, 240, 240);
  padding: 20px;
}

.store {
  padding: 0px;
  background-color: white;
  position: relative;
  width: calc(100% - 0px);
}

.store:not(:last-child) {
  margin-bottom: 20px;
}

.store img {
  width: 60%;
  margin: 0 auto !important;
  border: 0;
}

.store-info .controls {
  position: absolute;
  top: 0px;
  right: -10px;
}

.v-no-results {
  background: white !important;
}
</style>