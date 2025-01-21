<template>
    <ion-content :scroll-events="true">
        <v-form header="VEA Materno" action="/admin/desarrollo-social/vea-materno">
            <v-table :selectable="true" row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')"
                store="vea-materno" @loaded="ll" :scrollable="true" rowKey="id" :pagination="20" @updated="app.bindLinks($el)"
                :filters="filters" src="/api/desarrollo-social/vea-materno">
                <template v-slot:header>
                    <v-button value="Enviar" v-if="app.connected" icon="fa-save" :disabled="!rowSelectedCount"
                        @click.prevent="sync"></v-button>
                    <v-button value="Crear" v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-plus"
                        class="on" @click.prevent="create"></v-button>
                    <v-button value="Editar" v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-pen"
                        @click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Ver" icon="fa-search" @click.prevent="view(getSelected()[0])"
                        :disabled="!rowSelectedCount"></v-button>
                    <v-button value="Eliminar" v-if="1 || can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-trash"
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
                    <td width="100" header="Semana" class="center">
                        <v-filter>
                            <input v-model="filters.semana" />
                        </v-filter>
                        {{ row.semana }}
                    </td>
                    <td width="220" header="Red" >
                        <v-filter>
                            <input v-model="filters.red" />
                        </v-filter>
                        {{ row.red }}
                    </td>
                    <td width="220" header="Microred" >
                        <v-filter>
                            <input v-model="filters.microred" />
                        </v-filter>
                        {{ row.microred }}
                    </td>
                    <td width="220" header="Establecimiento" >
                        <v-filter>
                            <input v-model="filters.establecimiento" />
                        </v-filter>
                        {{ row.establecimiento }}
                    </td>
                    <td width="220" header="Captadas antes de las 14 semanas de Gestación" class="center">
                        <v-filter>
                            <input v-model="filters.n1" />
                        </v-filter>
                        {{ row.n1 }}
                    </td>
                    <td width="220" header="Inserted" class="center">
                        <v-filter>
                            <input v-model="filters.insert_date" />
                        </v-filter>
                        {{ row.insert_date | date}}
                    </td>
                    <td width="220" header="Updated" class="center">
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
        var me = this;
        me.filters.uid = me.user.uid;
        me.$on('sync', function (dr, dl) {//data remote -> data local
            if (dr.people && dl.people) {
                dr.people.forEach(pr => {
                    dl.people.forEach(pl => {
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
            this.open('/admin/desarrollo-social/vea-materno/' + (o.tmpId ? (-o.tmpId) : o.id));
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