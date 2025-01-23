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
          <v-button icon="fa fa-save" value="Grabar" @click="save" :disabled="!(o.employee && o.year)" />
        </div>
      </div>
      <v-table :value="items" style="flex: 1;width: 100%;margin-top: 10px;height: 0px;" selectable="false"
        v-on:updated="tableUpdated" scrollable="true" height="100">
        <template v-slot:default="{ row }">
          <td header="Concepto" width="160" :type="row.type">
            <input v-model="row.concept" class="ucase" required />
          </td>
          <td header="ENE" width="130">
            <v-number v-model="row[1]" />
          </td>
          <td header="FEB" width="130">
            <v-number v-model="row[2]" />
          </td>
          <td header="MAR" width="130">
            <v-number v-model="row[3]" />
          </td>
          <td header="ABR" width="130">
            <v-number v-model="row[4]" />
          </td>
          <td header="MAY" width="130">
            <v-number v-model="row[5]" />
          </td>
          <td header="JUN" width="130">
            <v-number v-model="row[6]" />
          </td>
          <td header="JUL" width="130">
            <v-number v-model="row[7]" />
          </td>
          <td header="AGO" width="130">
            <v-number v-model="row[8]" />
          </td>
          <td header="SEP" width="130">
            <v-number v-model="row[9]" />
          </td>
          <td header="OCT" width="130">
            <v-number v-model="row[10]" />
          </td>
          <td header="NOV" width="130">
            <v-number v-model="row[11]" />
          </td>
          <td header="DIC" width="130">
            <v-number v-model="row[12]" />
          </td>
        </template>
      </v-table>
    </div>

  </v-form>
</template>
<script>
var { _, axios } = window;
export default _.ui({
  props: ["id"],
  data() {
    return {
      items:[
        {
          concept:'INGRESOS',
          type:'-1'
        },{
          concept:'DESCUENTOS',
          type:'-1'
        },{
          concept:'APORTACIONES',
          type:'-1'
        }
      ],
      o: {
        id: null,
        employee: null,
        year: new Date().getFullYear()
      },
    };
  },
  methods: {
    refresh() {
      const me=this;
      axios.post('/api/payroll/people', { ...this.o }).then(({ data }) => {
        me.items.length=0;
        me.items.push(...data);
        me.arrange();
      });
    },
    save() {
      axios.post('/api/payroll/people', { ...this.o, items: this.items }).then(({ data }) => {
        console.log(data);
      });
    },
    tableUpdated(datatable) {
      const table = datatable.$el.querySelector('.v-datatable-data');
console.log(table);
      /*item.$el.querySelector('.v-widget-header').style.minHeight = '30px';
      item.$el.querySelector('.v-datatable-scrollable-body').style.height = '-webkit-fill-available';
      this.addRow(table, 'INGRESOS', 1)
      this.addRow(table, 'DESCUENTOS', 2)
      this.addRow(table, 'APORTACIONES', 3)*/
    },
    addItem(item) {

      const lastIndex = this.items.length - 1 - this.items.slice().reverse().findIndex(el => el.type === item.type);
      if (lastIndex >= 0) {
        this.items.splice(lastIndex + 1, 0, item);
      } else {
        this.items.push(item);
      }
this.arrange();

    },
    arrange(){
      setTimeout(() => {
        const t = this.$el.querySelector('.v-datatable-data');
        t.querySelectorAll('.v-group').forEach((group) => {
          const td = t.querySelector('td[type="' + group.id.split('-')[1] + '"]');
          if (td) {
            const tr = td.parentElement;
            tr.parentElement.insertBefore(group, tr);
          }
        })
      }, 1000);
    },
    //addRow(table, name, type) {
      /*const me = this;
      if (table.querySelector('#type-' + type)) return;
      const newRow = document.createElement('tr')
      newRow.className = 'v-group v-row';
      const cell1 = document.createElement('td');
      const button = document.createElement('span');
      const icon = document.createElement('i');
      icon.classList.add('fa', 'fa-plus');
      button.style.cursor = 'pointer';
      button.style.marginRight = '5px';
      button.addEventListener('click', () => {
        me.addItem({ type });
      });
      button.appendChild(icon);
      cell1.appendChild(button);
      const cell = document.createElement('span');
      cell.textContent = name;
      cell1.appendChild(cell);
      cell1.setAttribute('colspan', '13');
      newRow.appendChild(cell1);
      newRow.id = 'type-' + type;
      newRow.group = type;
      table.appendChild(newRow);*/
    //}
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