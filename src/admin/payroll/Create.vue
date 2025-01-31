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
      <v-table :value="items" ref="table" :key="tableKey" style="flex: 1;width: 100%;margin-top: 10px;height: 0px;"
        selectable="false" v-on:updated="tableUpdated" groups="type" scrollable="true" height="100">
        <template v-slot:header-group="{ group }">
          
          <td colspan="13">
            <div style="display:flex;align-items:center;">

            {{ groups[group.name] }}
            <span style="margin-left:10px" @click="addItem(group)">
              <i class="fa fa-plus" style="cursor:pointer;border-radius:50%;background-color:#e7e7e7;color:#000000;padding:3px"></i>
            </span>
            

            
          </div></td>
        </template>
        <template v-slot="{ row }">
          <td header="Concepto" width="160" :type="row.type" :flag="row.flag">
            <input placeholder="Ingresar Nombre" v-model="row.concept" class="ucase" required />
          </td>
          <td header="ENE" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[1]" />
          </td>
          <td header="FEB" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[2]" />
          </td>
          <td header="MAR" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[3]" />
          </td>
          <td header="ABR" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[4]" />
          </td>
          <td header="MAY" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[5]" />
          </td>
          <td header="JUN" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[6]" />
          </td>
          <td header="JUL" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[7]" />
          </td>
          <td header="AGO" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[8]" />
          </td>
          <td header="SEP" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[9]" />
          </td>
          <td header="OCT" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[10]" />
          </td>
          <td header="NOV" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[11]" />
          </td>
          <td header="DIC" width="130">
            <v-number :disabled="!row.concept" v-model.number="row[12]" />
          </td>
        </template>
        <template v-slot:footer-group="{ group }">
          <td :type="group.name"></td>
          <td v-for="n in 12" style="padding:0px 24px !important;background-color: #ffffb0;font-weight: bolder;text-align: right;" :key="n" >{{ group.values.sum(n).toFixed(2) }}</td>
        </template>
      </v-table>
    </div>

  </v-form>
</template>
<script>
var { _, axios } = window;
const groups={
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
      groups: groups,
      tableKey: 0,
      items:this.completedata([]),
      o: {
        id: null,
        employee: null,
        year: new Date().getFullYear()
      },
    };
  },
  methods: {
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
        me.saveAs(process.env.VUE_APP_REPORT_URL + "/api/jreport/", fo);

      });
    },
    completedata(data) {
      let result = [];

      console.log('------',this.groups);
      // Iterar por los grupos predefinidos para asegurar que aparezcan en orden
      Object.entries(groups).forEach(([groupType]) => {
        console.log(data,groupType);
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
      axios.post('/api/payroll/people', { ...this.o, items: this.items }).then(({ data }) => {
        console.log(data);
      });
    },
    tableUpdated(datatable) {
      datatable.$el.querySelector('.v-widget-header').style.minHeight = '30px';
      datatable.$el.querySelector('.v-datatable-scrollable-body').style.height = '-webkit-fill-available';
    },
    addItem(item) {
      item={type:Number(item.name)};
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
.v-datatable /deep/ .v-header-group{
  background-color : #b31111;
  color : #ffffff;
  cursor : default;
}
.v-datatable /deep/ input{
  border: none !important;
  border-radius: 0px !important;
}
.v-datatable /deep/ td{
  padding: 0px !important;
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