<template>
    <v-form class="v-form" header="CONSTANCIA DE PAGO DE HABERES Y DESCUENTOS" store="setting">
        <div class="v-form">
            <label>Empleado:</label>
            <v-autocomplete placeholder="Ingrese mas de 2 letras y presione ENTER" src="api/hr/employee"
                v-model="o.employee">
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
            <v-button :disabled="!o.employee" style="margin-top: 10px;" icon="fa fa-download" value="Generar Constancia" v-on:click="send" />
        </div>
    </v-form>
</template>

<script>
var {_,axios} = window;
export default _.ui({
    data() {
        return {
            o: { id: null, employee: null },
            image: 0,
            base: 'http://web.regionancash.gob.pe/cdn/web/viewer.html?v=1&file=http://web.regionancash.gob.pe/admin/uti/api/document/download/'
        }
    },
    methods: {

        send() {
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
        }
    }
})
</script>