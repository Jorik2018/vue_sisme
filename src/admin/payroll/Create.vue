<template>
  <v-form header="Registrar Montos Anuales" action="/api/hr/employee">
    <div class="v-form" style="display: flex;flex-direction: column;">
      <label>Empleado:</label>
      <v-autocomplete placeholder="Ingrese mas de 2 letras y presione ENTER" src="api/hr/employee" v-model="o.employee">
        <template v-slot:label="{ selected }">
          {{ selected.code }}: {{ selected.fullName }}
        </template>
        <template v-slot="{ row }">
          <a v-bind:href="'/admin/directorio/' + row.id" onclick="return false">
            <span>{{ row.code }}</span>:
            {{ row.fullName ? row.fullName.toUpperCase() : null }}
          </a>
        </template>
      </v-autocomplete>
      <v-autocomplete v-show="current" :keySet="keySet" pagination="20" ref="concept" src="api/hr/concept"
        :params="{ type: current ? current.type : '0' }" @input="selectConcept" @escape="escape" style="color:black"
        v-model="o.data" id="concepto">
        <template v-slot:label="{ selected }">
          {{ selected.name }}
        </template>
        <template v-slot="{ row }">
          {{ row.name }}
        </template>
      </v-autocomplete>
      <div style="display: flex;flex-direction: row;">
        <div style="width: 100px;padding-right: 10px;">
          <label>Año:</label>
          <v-number v-model="o.year" required="true" class="center" type="number" />
        </div>
        <div
          style="display: flex; flex-grow: 1; margin-bottom: 3px; justify-content: space-between; align-items: flex-end;">
          <v-button icon="fa fa-refresh" @click="refresh" :disabled="!(o.employee && o.year)" />
          <div>
            <v-button icon="fa fa-download" @click="download" style="margin-right: 10px;"
              :disabled="!(o.employee && o.year)" />
            <v-button icon="fa fa-save" @click="save" :disabled="!(o.employee && o.year)" />
          </div>
        </div>
      </div>
      <v-table :value="items" ref="table" :key="tableKey"
        style="flex: 1;width: 100%;margin-top: 10px;height: 0px;" selectable="false" v-on:updated="tableUpdated"
        groups="type" scrollable="true" height="100">
        <template v-slot="{ row }">
          <td header="Concepto" :key="tk" width="160" :style="{ color: row.conceptId ? '' : 'red' }" :type="row.type"
            :flag="row.flag" @click="sele($event, row)">
            <span style="padding: 5px;" v-if="!(current === row)">{{ row.concept }}</span>
          </td>
          <td header="ENE" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[1]" />
          </td>
          <td header="FEB" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[2]" />
          </td>
          <td header="MAR" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[3]" />
          </td>
          <td header="ABR" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[4]" />
          </td>
          <td header="MAY" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[5]" />
          </td>
          <td header="JUN" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[6]" />
          </td>
          <td header="JUL" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[7]" />
          </td>
          <td header="AGO" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[8]" />
          </td>
          <td header="SEP" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[9]" />
          </td>
          <td header="OCT" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[10]" />
          </td>
          <td header="NOV" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[11]" />
          </td>
          <td header="DIC" width="130">
            <v-number v-if="row.concept" placeholder="-" v-model.number="row[12]" />
          </td>
        </template>
        <template v-slot:footer-group="{ group }">
          <td :type="group.name" style="text-align: left;padding: 0px 5px;background-color: #b31111;color:white">

            <div style="display:flex;align-items:center;">
              {{ groups[group.name] }}
              <span style="margin-left:auto" @click="addItem(group)">
                <i class="fa fa-plus"
                  style="cursor:pointer;border-radius:50%;background-color:#e7e7e7;color:#000000;padding:3px"></i>
              </span>
            </div>

          </td>
          <td v-for="n in 12" :key="n" style="padding: 0px 20px ">{{ group.values.sum(n).toFixed(2) }}</td>



        </template>
        <template v-slot:extra-group="{ group, groups }">
          <tr v-if="group.name == 2 || group.name == 5"
            style="background-color: #585858 !important;color:white;font-weight: bolder; text-align: right;">
            <td :type="group.name" class="center">TOTAL PAGO</td>
            <td v-for="n in 12" :key="n" style="padding: 0px 20px ">
              {{ (findGroup(groups, group.name - 1).values.sum(n) - group.values.sum(n)).toFixed(2) }}</td>
          </tr>
        </template>

      </v-table>
    </div>

  </v-form>
</template>
<script>
var { _, axios } = window;
const groups = {
  1: "INGRESOS",
  2: "EGRESOS",
  3: "APORTACIONES",
  4: "INGRESOS",
  5: "EGRESOS",
  6: "APORTACIONES"
};
export default _.ui({
  props: ["id"],
  data() {
    return {
      tk: 0,
      keySet: 0,
      current: null,
      groups: groups,
      tableKey: 0,
      items: this.completedata([]),
      o: {
        data: null,
        id: null,
        employee: null,
        year: new Date().getFullYear()
      },
    };
  },
  mounted() {
    const me = this;
    me.$el.addEventListener('click', (event) => {
      if (!me.$refs.concept.$el.contains(event.target)) {
        me.current = null
      }
    });
  },
  methods: {
    escape() {
      const me = this;
      const concepto = this.$refs.concept.$el.querySelector('input');
      me.current.concept = concepto.value
      me.current = null;
      me.tk++;
    },
    selectConcept(e) {
      this.current.concept = e.name;
      this.current.conceptId = e.id;
      this.current.name = e.name;
      this.current = null;

    },
    sele(e, row) {
      const concepto = this.$refs.concept.$el;
      if (e.target.tagName === 'TD') {
        e.stopPropagation();
        if (row.concept) {
          this.o.data = { name: row.concept, conceptId: row.conceptId }
        } else {
          this.$refs.concept.query = '';
          this.o.data = null;
        }
        this.current = row;
        this.keySet = row.type;
        if (!e.target.contains(concepto)) {
          e.target.appendChild(concepto);
        }
      }
    },
    download() {
      const me = this;
      //me.saveAs('/api/payroll/chd', me.o);
      
      axios.post('/api/payroll/chd', me.o).then(({ data }) => {
        const fo = new FormData();
        fo.append(
          "file",
          new Blob([JSON.stringify(data)], { type: "text/plain" }),
          "data.json"
        );
        fo.append("filename", "data.json");
        fo.append("template", "hc");
        fo.append("original", "1");
        //me.saveAs(process.env.VUE_APP_REPORT_URL + "/api/jreport/", fo);

      });
    },
    findGroup(data, id) {
      return data.find((e) => e.name == id);
    },
    completedata(data) {
      let result = [];
      Object.entries(groups).forEach(([groupType]) => {
        const groupTypeInt = parseInt(groupType);
        let groupHasData = false;
        // Procesar los elementos de la data original que pertenezcan al grupo
        data.forEach(item => {
          if (item.type === groupTypeInt) {
            groupHasData = true;
            result.push(item);
          }
        });
        // Si no hay elementos del grupo, agregar un objeto vacío con el tipo del grupo
        if (!groupHasData) {
          result.push({ type: groupTypeInt });
        }
      });
      return result;
    },
    refresh() {
      const me = this;
      axios.post('/api/payroll/people', { ...this.o }).then(({ data }) => {
        me.items = me.completedata(data);
        me.tableKey++;
      });
    },
    save() {
      const me=this;
      console.log(this.o);
      console.log(this.items);
      axios.post('/api/payroll/people', { ...this.o, items: this.items }).then(({ data }) => {
        console.log(data);
        me.refresh();
      });
    },
    tableUpdated(datatable) {
      datatable.$el.querySelector('.v-widget-header').style.minHeight = '30px';
      datatable.$el.querySelector('.v-datatable-scrollable-body').style.height = '-webkit-fill-available';
    },
    addItem(item) {
      item = { type: Number(item.name) };
      const lastIndex = this.items.length - 1 - this.items.slice().reverse().findIndex(el => (el.type) == item.type);
      if (lastIndex >= 0) {
        this.items.splice(lastIndex + 1, 0, item);
      } else {
        this.items.push(item);
      }
    },
  },
});
</script>
<style scoped>
.xyz {
  padding: 0px !important;
}

.v-selected input {
  color: black;
}

.xyz>a {
  padding: 10px;
  background-color: #e1f8ff;
  border: 1px solid gray;
  margin-top: 10px;
  display: block;
}

.v-datatable /deep/ .v-header-group {
  background-color: #b31111;
  padding: 0px 10px;
  color: #ffffff;
  font-weight: bolder;
  cursor: default;
}

.v-datatable /deep/ .v-footer-group {

  background-color: #ffffa8;
  font-weight: bolder;
  text-align: right;
}

.v-datatable /deep/ .v-footer-group /deep/ td {
  padding: 0px 20px !important;
  text-align: right;
}

.v-footer-group /deep/ td {
  padding: 0px 20px !important;
  text-align: right;
}

.v-datatable ::v-deep(.v-footer-group > td) {
  padding: 0px 20px !important;
  text-align: right;
}

.v-datatable /deep/ input {
  border: none !important;
  border-radius: 0px !important;
}

.v-datatable /deep/ td {
  padding: 0px;
}

.v-datatable input[type="number"] {
  --width: 160px;
}

.v-datatable {
  display: flex;
  flex-direction: column;
}

.v-datatable>.v-datatable-scrollable-body {
  flex: 1 !important;
}

.v-datatable>.v-widget-header {
  height: 70px !important;
}

.v-datatable>.v-datatable-scrollable-body {
  height: -webkit-fill-available !important;
}

.v-datatable .v-row {
  background-color: red !important;
}
</style>