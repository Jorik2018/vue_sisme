<template>
  <v-form
    action="/api/desarrollo-social/emed/damage-ipress"
    store="emed_damage_ipress"
    :class="
      o.id < 0 || (o.tmpId && !o.synchronized)
        ? 'yellow'
        : o.tmpId
        ? 'green'
        : ''
    "
    v-bind:header="(o.id ? 'Editar' : 'Crear') + ' Daño IPRESS'"
  >
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <label>EMED:</label>
      <div>{{ pad(o.emedId || 0, 4) }}</div>
      <label>Red:</label>
        <v-select
          v-model="o.red"
          autoload="true"
          ref="red"
          v-on:input="
            $refs.microred.load({ code: o.red })
          "
        >
          <option>Select One...</option>
          <v-options store="red" display-field="name" value-field="code" />
        </v-select>
        <label>Microred:</label>
      <v-select
        autoload="false"
        :disabled="!o.red"
        store="microred"
        ref="microred"
        v-model="o.microred"
        :required="true"
        @input="$refs.establishment.load({ microredCode:'02'+ o.microred,type:1  })"
      >
        <option>Select One...</option>
        <v-options store="microred" display-field="name" value-field="code" />
      </v-select>
        <label>IPRESS:</label>
        <v-select
          ref="establishment"
          v-model="o.ipress"
          :autoload="false"
          :disabled="!o.microred"
        >
          <option>Select One...</option>
          <v-options
            store="establishment"
            display-field="name"
            value-field="code"
          />
        </v-select>
      <label>Categoria:</label>
      <input maxlength="10" v-model="o.category"/>
      <label>Estado:</label>
      <v-select v-model="o.status" required="required">
          <option value="">Select One...</option>
          <option v-for="type in ['AFECTADO OPERATIVO', 'AFECTADO INOPERATIVO']" :key="type" :value="type">
            {{ type }}
          </option>
        </v-select>
      <label>Observación:</label>
      <v-textarea maxlength="200" v-model="o.remark"/>
    </div>
    <center>
      <v-button
        value="Grabar"
        icon="fa-save"
        v-on:click.prevent="save"
      ></v-button>
    </center>
  </v-form>
</template>
<script>
var {_,axios} = window;
export default _.ui({
  props: ["id", "action"],
  data() {
    return {
      o: { emedId: null,red:null},
    };
  },
  methods: {
    changeRoute() {
      var me = this,
        id = me.id,
        action = me.action;
      if (Number(id)) {
        if (action == "add") {
          me.o = { emedId: id };
        } else {
          if (id < 0) {
            me.getStoredList("emed").then((emeds) => {
              emeds.forEach((p) => {
                p.damage_ipress.forEach((v) => {
                  if (v.tmpId == Math.abs(me.id)) {
                    me.setStoredList("emed_damage_ipress", p.damage_ipress);
                    me.o = v;
                  }
                });
              });
            });
          } else
            axios
              .get("/api/desarrollo-social/emed/damage-ipress/" + id)
              .then((response) => {
                var o = response.data;
                if(o.red)o.red=me.pad(o.red,2);
                if(o.microred)o.microred=me.pad(o.microred,4);
                me.o=o;
              });
        }
      } else if (action == "add") {
        me.o = { emedId: id };
      }
    },
    close(r) {
      var me = this;
      if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
      }
      me.$router.back();
    },
  },
  created() {
    var me = this;
    this.$on("sync", (data, o) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if ((o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||e.id == o.emedId) {
            e.agreements.forEach((e2, i) => {
              if (e2.tmpId == o.tmpId) 
                e.damage_ipress[i] = o;
            });
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
    this.$on("stored", (o, data) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (
            (o.emedId < 0 && e.tmpId == Math.abs(o.emedId)) ||
            e.id == o.emedId
          ) {
            e.damage_ipress = data;
            delete e.synchronized;
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
  },
  mounted() {
    var me=this;
    if (me.$children[0]) me.app.title = me.$children[0].header;
    me.changeRoute();
  },
});
</script>