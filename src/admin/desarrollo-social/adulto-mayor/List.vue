<template>
    <ion-content :scroll-events="true">
        <v-form header="Adulto Mayor" action="/admin/desarrollo-social/adulto-mayor">
            <v-table :selectable="true" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
                store="adulto-mayor" @loaded="ll" :scrollable="true" rowKey="id" :pagination="20"
                @updated="app.bindLinks($el)" :filters="filters" src="/api/desarrollo-social/adulto-mayor">
                <template v-slot:header>
                    <v-button value="Enviar" v-if="app.connected" icon="fa-save" :disabled="!rowSelectedCount"
                        @click.prevent="sync"></v-button>
                    <v-button value="Crear" v-if="1 || can(perms.DESARROLLO_SOCIAL_ADULTO_MAYOR)" icon="fa-plus"
                        class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" v-if="1 || can(perms.DESARROLLO_SOCIAL_ADULTO_MAYOR)" icon="fa-pen"
                        @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" v-if="1 || can(perms.DESARROLLO_SOCIAL_ADULTO_MAYOR)" icon="fa-trash"
                        @click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
                    <v-button title="Refrescar" icon="fa-sync" @click.prevent="refresh"></v-button>
                </template>
                <template v-slot="{ row }">
                    <td width="80" class="center" header="ID">
                        <v-filter>
                            <input disabled />
                        </v-filter>
                        {{ pad(row.id, 4) }}
                    </td>
                    <td width="120" header="DNI" class="center">
                        <v-filter>
                            <input v-model="filters.dni" />
                        </v-filter>
                        {{ row.dni }}
                    </td>
                    <td width="220" header="Nombre">
                        <v-filter>
                            <input v-model="filters.apellidos_nombres" />
                        </v-filter>
                        {{ row.apellidos_nombres }}
                    </td>
                    <td width="220" header="Fecha Nacimiento" class="center">
                        <v-filter>
                            <input v-model="filters.fecha_nacimiento" />
                        </v-filter>
                        {{ row.fecha_nacimiento | date }}
                    </td>
                    <td width="100" header="Edad" class="center">
                        <v-filter>
                            <input v-model="filters.edad" />
                        </v-filter>
                        {{ row.edad }}
                    </td>
                    <td width="100" header="Sexo" class="center">
                        <v-filter>
                            <input v-model="filters.sexo" />
                        </v-filter>
                        {{ row.sexo }}
                    </td>
                    <td width="220" header="Seguro Médico" class="center">
                        <v-filter>
                            <input v-model="filters.tipo_seguro_medico" />
                        </v-filter>
                        {{ row.tipo_seguro_medico }}
                    </td>
                    <td width="220" header="Teléfono" class="center">
                        <v-filter>
                            <input v-model="filters.telefono_contacto" />
                        </v-filter>
                        {{ row.telefono_contacto }}
                    </td>
                    <td width="220" header="Dirección" class="center">
                        <v-filter>
                            <input v-model="filters.direccion_habitual" />
                        </v-filter>
                        {{ row.direccion_habitual }}
                    </td>
                    <td width="220" header="Observaciones Médicas" class="center">
                        <v-filter>
                            <input v-model="filters.observaciones_medicas" />
                        </v-filter>
                        {{ row.observaciones_medicas }}
                    </td>
                    <td width="220" header="Chequeo Médico Anual" class="center">
                        <v-filter>
                            <input v-model="filters.chequeo_medico_anual" />
                        </v-filter>
                        {{ row.chequeo_medico_anual }}
                    </td>
                    <td width="220" header="Actividad Física" class="center">
                        <v-filter>
                            <input v-model="filters.actividad_fisica_diaria" />
                        </v-filter>
                        {{ row.actividad_fisica_diaria }}
                    </td>
                    <td width="220" header="Sueño Continuo" class="center">
                        <v-filter>
                            <input v-model="filters.sueño_continuo" />
                        </v-filter>
                        {{ row.sueño_continuo }}
                    </td>
                    <td width="220" header="Agua Diaria" class="center">
                        <v-filter>
                            <input v-model="filters.agua_diaria" />
                        </v-filter>
                        {{ row.agua_diaria }}
                    </td>
                    <td width="220" header="Comentarios">
                        <v-filter>
                            <input v-model="filters.comentarios_observaciones" />
                        </v-filter>
                        {{ row.comentarios_observaciones }}
                    </td>
                    <td width="220" header="Insertado" class="center">
                        <v-filter>
                            <input v-model="filters.insert_date" />
                        </v-filter>
                        {{ row.insert_date | date }}
                    </td>
                    <td width="220" header="Actualizado" class="center">
                        <v-filter>
                            <input v-model="filters.updated_date" />
                        </v-filter>
                        {{ row.updated_date | date }}
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
        return { rowSelectedCount2: 0, page: 0, data: [], mode: 0, query: null }
    },
    created() {
        var me = this;
        me.filters.uid = me.user.uid;
    },
    updated() {
        this.app.bindLinks(this.$el);
    },
    methods: {
        ll(e) { console.log(e) },
        rss(e) {
            e = e.selection;
            this.rowSelectedCount2 = e ? e.length : 0;
        },
        can(o) {
            var m = this, u = m.user;
            return o || u.uid == 1;
            /*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
            !o || o.user == u.id;*/
        },
        toInt(o) {
            return Array.isArray(o) ? o.length : o;
        }
    }
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