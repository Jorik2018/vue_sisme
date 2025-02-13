<template>
    <ion-content :scroll-events="true">
        <v-form header="Inventario" action="/admin/inventory/item">
            <v-table :selectable="true" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
                store="cancer" @loaded="ll" :scrollable="true" rowKey="id" :pagination="20" @updated="app.bindLinks($el)"
                :filters="filters" src="/api/inventory/item">
                <template v-slot:header>
                    <v-button value="Crear" icon="fa-plus"
                        class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" icon="fa-pen"
                        @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" icon="fa-trash"
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
                    
                    <td width="220" header="Usuario Responsable" >
                        <v-filter>
                            <input v-model="filters.usuario_responsable" />
                        </v-filter>
                        {{ row.usuario_responsable }}
                    </td>
                    
                    <td width="100" header="Usuario Modalidad" >
                        <v-filter>
                            <input v-model="filters.usuario_modalidad" />
                        </v-filter>
                        {{ row.usuario_modalidad }}
                    </td>
                    <td width="220" header="Departamento/Área" class="center">
                        <v-filter>
                            <input v-model="filters.usuario_area" />
                        </v-filter>
                        {{ row.usuario_area }}
                    </td>
                    <td width="100" header="Ubicación" class="center">
                        <v-filter>
                            <input v-model="filters.usuario_ubicacion" />
                        </v-filter>
                        {{ row.usuario_ubicacion }}
                    </td>

                    <td width="220" header="Código Patrimonial" class="center">
                        <v-filter>
                            <input v-model="filters.codigo_patrimonial" />
                        </v-filter>
                        {{ row.codigo_patrimonial }}
                    </td>
                    <td width="220" header="Código Inventario" class="center">
                        <v-filter>
                            <input v-model="filters.codigo_inventario" />
                        </v-filter>
                        {{ row.codigo_inventario }}
                    </td>
                    <td width="120" header="Tipo de Equipo / Accesorio" >
                        <v-filter>
                            <input v-model="filters.tipo_equipo_accesorio" />
                        </v-filter>
                        {{ row.tipo_equipo_accesorio }}
                    </td>
                    <td width="220" header="Marca" >
                        <v-filter>
                            <input v-model="filters.marca" />
                        </v-filter>
                        {{ row.marca }}
                    </td>
                    <td width="120" header="Modelo" class="center" >
                        <v-filter>
                            <input v-model="filters.modelo" class="center" />
                        </v-filter>
                        {{ row.modelo }}
                    </td>

                    <td width="120" header="Procesador Nombre" >
                        <v-filter>
                            <input v-model="filters.procesador_nombre" />
                        </v-filter>
                        {{ row.procesador_nombre }}
                    </td>
                    <td width="120" header="Procesador Generación" class="center">
                        <v-filter>
                            <input v-model="filters.procesador_generacion" />
                        </v-filter>
                        {{ row.procesador_generacion }}
                    </td>

                    <td width="120" header="Memoria Capacidad" >
                        <v-filter>
                            <input v-model="filters.memoria_capacidad" />
                        </v-filter>
                        {{ row.memoria_capacidad }}
                    </td>
                    <td width="120" header="Memoria Tipo" class="center">
                        <v-filter>
                            <input v-model="filters.memoria_tipo" />
                        </v-filter>
                        {{ row.memoria_tipo }}
                    </td>
                    
                    <td width="120" header="Almacenamiento Capacidad" >
                        <v-filter>
                            <input v-model="filters.almacenamiento_capacidad" />
                        </v-filter>
                        {{ row.almacenamiento_capacidad }}
                    </td>
                    <td width="120" header="Almacenamiento Tipo" class="center">
                        <v-filter>
                            <input v-model="filters.almacenamiento_tipo" />
                        </v-filter>
                        {{ row.almacenamiento_tipo }}
                    </td>

                    <td width="120" header="Multimedia Altavoces" >
                        <v-filter>
                            <input v-model="filters.multimedia_altavoces" />
                        </v-filter>
                        {{ row.multimedia_altavoces }}
                    </td>
                    <td width="120" header="Sistema Operativo Version">
                        <v-filter>
                            <input v-model="filters.sistema_operativo_version" />
                        </v-filter>
                        {{ row.sistema_operativo_version }}
                    </td>
                    <td width="120" header="Monitor Pulgadas">
                        <v-filter>
                            <input v-model="filters.monitor_pulgadas" />
                        </v-filter>
                        {{ row.monitor_pulgadas }}
                    </td>
                    <td width="120" header="Estado">
                        <v-filter>
                            <input v-model="filters.estado" />
                        </v-filter>
                        {{ row.estado }}
                    </td>

                    <td width="120" header="Inserted" class="center">
                        <v-filter>
                            <input v-model="filters.insert_date" />
                        </v-filter>
                        {{ row.insert_date | date}}
                    </td>
                    <td width="120" header="Updated" class="center">
                        <v-filter>
                            <input v-model="filters.updated_date" />
                        </v-filter>
                        {{ row.updated_date |date}}
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
        const me = this;
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
        view(o) {
            this.open('/admin/desarrollo-social/cancer/' + (o.tmpId ? (-o.tmpId) : o.id));
        },
        toInt(o) {
            return Array.isArray(o) ? o.length : o;
        },
        rewrite(url){
            return '/admin'+url;
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