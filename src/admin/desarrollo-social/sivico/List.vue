<template>
    <ion-content :scroll-events="true">
        <v-form header="Registro MCI" action="/admin/desarrollo-social/sivico"> 
            <v-table :selectable="true" 
            row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')" 
            store="pool" @loaded="ll"
            :scrollable="true" rowKey="id" :pagination="20" 
            v-on:updated="app.bindLinks($el)"
                :filters="filters" src="/api/desarrollo-social/sivico"> 
            <template v-slot:header> 
                <v-button value="Enviar" v-if="app.connected"  icon="fa-save" 
                    :disabled="!rowSelectedCount" v-on:click.prevent="sync"></v-button>
                <v-button value="Crear" v-if="1||can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-plus" 
                    class="on" v-on:click.prevent="create"></v-button>
                <v-button value="Editar" v-if="1||can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-pen" 
                    v-on:click.prevent="edit" :disabled="!rowSelectedCount"></v-button>
                <v-button value="Ver" icon="fa-search" v-on:click.prevent="view(getSelected()[0])" 
                    :disabled="!rowSelectedCount"></v-button>
                <v-button value="Eliminar" v-if="1||can(perms.DESARROLLO_SOCIAL_REGISTER_SIVICO)" icon="fa-trash"
                    v-on:click.prevent="destroy" :disabled="!rowSelectedCount"></v-button>
                <v-button title="Refrescar" icon="fa-sync" v-on:click.prevent="refresh"></v-button> 
            </template> 
            <template v-slot="{row}"> 
                <td width="80" class="center" header="ID">
                    <v-filter>
                        <input v-model="filters.id"/>
                    </v-filter>
                    {{pad(row.id,4)}}
                </td> 
                <td width="120" sorter="row.peoples" class="center" header="Integrantes">  {{toInt(row.peoples)}} </td> 
                <td width="120" class="center" header="Acuerdos">  {{toInt(row.agreements)}} </td> 
                <td width="80" class="center" header="DIRESA">  {{row.diresa}} </td> 
                <td width="100" class="center" header="Red">  {{pad(row.red,2)}} </td> 
                <td width="90" class="center" header="MicroRed">  {{row.microred}} </td> 
                <td width="90" class="center" header="Provincia">
                    <v-filter>
                        <input v-model="filters.province"/>
                    </v-filter>
                    {{row.province}}
                </td> 
                <td width="90" class="center" header="Distrito">
                    <v-filter>
                        <input v-model="filters.district"/>
                    </v-filter>
                    {{row.district}}
                </td> 
                <td width="100" header="Sector">
                    <v-filter>
                        <input v-model="filters.sector"/>
                    </v-filter>
                    {{row.sector}}
                </td> 
                <td width="200" header="Dirección">
                    <v-filter>
                        <input v-model="filters.direccion"/>
                    </v-filter>
                    {{row.address}}
                </td> 
                <td width="200" h-class="hr" header="Informante">
                    <v-filter>
                        <input v-model="filters.informante"/>
                    </v-filter>
                    {{row.informante}}
                </td> 
                <td width="200" h-class="hr" header="Telefono">
                    <v-filter>
                        <input/>
                    </v-filter>
                    {{row.phone}}
                </td> 
                <td width="200" h-class="hr" header="Mail">
                    <v-filter>
                        <input/>
                    </v-filter>
                    {{row.mail}}
                </td> 
                <td width="200" h-class="hg" header="Responsable Visita">
                    <v-filter>
                        <input/>
                    </v-filter>
                    {{row.responsableVisita}}
                </td> 
                

                <td width="160" class="center" header="Tiempo que Demora en Llegar a E.E.S.S.">  {{row.tiempoAEess}} </td> 
                <td width="120" class="center" header="Fecha">  {{row.fecha|date}} </td> 
                <td width="200" h-class="hg" header="Resultado Visita">  {{row.resultadoVisita}} </td> 
                <td width="120" class="center" h-class="hg" header="Proxima Visita">  {{row.proximaVisita|date}} </td> 
                <td width="100" class="center" header="Etnia">  {{row.etnia}} </td> 
                <td width="100" class="center" header="Idioma">  {{row.idioma}} </td> 
                <td width="100" class="center" header="Religión">  {{row.religion}} </td> 
                <td width="100" class="center" h-class="hg" header="CICLO VITAL FAMILIAR">  {{row.c2}} </td> 
                <td width="150" class="center" h-class="hgd" header="Con nacimiento del primer hijo/a">  {{row.c5}} </td> 
                <td width="100" class="center" h-class="hgd" header="Con hija/o en edad pre-escolar">  {{row.c6}} </td> 
                <td width="100" class="center" h-class="hgd" header="Con hija/o en edad escolar">  {{row.c7}} </td> 
                <td width="100" class="center" h-class="hgd" header="Con hija/o adolescente">  {{row.c8}} </td> 
                <td width="100" class="center" h-class="hgd" header="Con hija/o en edad adulta">  {{row.c9}} </td> 
                <td width="100" class="center" header="TIPO DE FAMILIA">  {{row.c12}} </td> 
                <td width="200" header="Otro">  {{row.c20}} </td> 
                <td width="200" header="ECOMAPA">  {{row.c21}} </td> 
                <td width="160" class="center" header="FAMILIOGRAMA">
                    <a target="_new" class="_" :href="row.ext&&row.ext.src&&row.ext.pending?row.ext.src:('/fs/desarrollo-social/sivico/familiograma/'+row.id+'.jpeg')" 
                    v-if="(row.ext&&row.ext.src)||row.c22">VER</a> 
                </td> 
                <td width="120" class="center" header="Fecha elaboración">  {{row.c23|date}} </td> 
                <td width="100" class="center" h-class="hg" header="PISO / Madera">  {{row.c125}} </td> 
                <td width="100" class="center" h-class="hg" header="Parquel">  {{row.c126}} </td> 
                <td width="100" class="center" h-class="hg" header="Losetas">  {{row.c127}} </td> 
                <td width="100" class="center" h-class="hg" header="Cemento / ladrillo">  {{row.c128}} </td> 
                <td width="100" class="center" h-class="hg" header="Tierra">  {{row.c129}} </td> 
                <td width="100" class="center" h-class="hg" header="Otros">  {{row.c130}} </td> 
                <td width="120" class="center" header="PAREDES / Madera, estera">  {{row.c132}} </td> 
                <td width="100" class="center" header="Adobe o tapia">  {{row.c133}} </td> 
                <td width="100" class="center" header="Cemento / ladrillo">  {{row.c134}} </td> 
                <td width="150" class="center" header="Quincha (ca&ntilde;a de barro), piedra con barro">  {{row.c135}} </td> 
                <td width="100" class="center" header="Otros">  {{row.c136}} </td> 
                <td width="100" class="center" h-class="hg" header="TECHO / Calamina">  {{row.c138}} </td> 
                <td width="100" class="center" h-class="hg" header="Madera, tejas">  {{row.c139}} </td> 
                <td width="100" class="center" h-class="hg" header="Noble">  {{row.c140}} </td> 
                <td width="100" class="center" h-class="hg" header="Eternit o fibra de cemento">  {{row.c141}} </td> 
                <td width="100" class="center" h-class="hg" header="Paja, hojas">  {{row.c142}} </td> 
                <td width="100" class="center" h-class="hg" header="Caña o esteras con barro">  {{row.c143}} </td> 
                <td width="150" class="center" header="ELIMINACION EXCRETAS / Aire libre">  {{row.c145}} </td> 
                <td width="100" class="center" header="Acequia, canal">  {{row.c146}} </td> 
                <td width="100" class="center" header="Red p&uacute;blica (*)">  {{row.c147}} </td> 
                <td width="100" class="center" header="Letrina">  {{row.c148}} </td> 
                <td width="100" class="center" header="Pozo séptico">  {{row.c149}} </td> 
                <td width="100" class="center" header="Otros">  {{row.c150}} </td> 
                <td width="200" class="center" h-class="hg" header="DISPOSICION BASURA / Carro recolector (Frecuencia)">  {{row.c152}} </td> 
                <td width="100" class="center" h-class="hg" header="A campo abierto">  {{row.c153}} </td> 
                <td width="100" class="center" h-class="hg" header="Al rio">  {{row.c154}} </td> 
                <td width="100" class="center" h-class="hg" header="Se entierra, quema">  {{row.c155}} </td> 
                <td width="100" class="center" h-class="hg" header="En un pozo">  {{row.c156}} </td> 
                <td width="100" class="center" h-class="hg" header="Otros">  {{row.c157}} </td> 
                <td width="100" class="center" header="SERVICIOS DOMICILIO / Telefono">  {{row.c159}} </td> 
                <td width="100" class="center" header="Internet">  {{row.c160}} </td> 
                <td width="100" class="center" header="Cable">  {{row.c161}} </td> 
                <td width="120" class="center" header="Electricidad">  {{row.c162}} </td> 
                <td width="100" class="center" header="Agua, desague">  {{row.c163}} </td> 
                <td width="100" class="center" header="Otros">  {{row.c164}} </td> 
                <td width="140" class="center" h-class="hg" header="COMBUSTIBLE COCINA / Le&ntilde;a">  {{row.c166}} </td> 
                <td width="100" class="center" h-class="hg" header="Carb&oacute;n">  {{row.c167}} </td> 
                <td width="100" class="center" h-class="hg" header="Bosta">  {{row.c168}} </td> 
                <td width="120" class="center" h-class="hg" header="Gas, electricidad">  {{row.c169}} </td> 
                <td width="120" class="center" h-class="hg" header="A temperatura ambiente">  {{row.c171}} </td> 
                <td width="150" class="center" header="CONSERVACION ALIMENTO / Refrigerio">  {{row.c172}} </td> 
                <td width="100" class="center" header="En recipiente sin tapa">  {{row.c173}} </td> 
                <td width="100" class="center" header="En recipiente con tapa">  {{row.c174}} </td> 
                <td width="100" class="center" h-class="hg" header="Nº de personas x habitacion">  {{row.c175}} </td> 
                <td width="140" class="center" header="Disponibilidad de Transporte Propio">  {{row.c178}} </td> 
                <td width="100" class="center" h-class="hg" header="Agua de consumo">  {{row.c183}} </td> 
                <td width="180" class="center" header="ABASTECIMIENTO AGUA / Red p&uacute;blica dentro de la vivienda">  {{row.c187}} </td> 
                <td width="140" class="center" header="Red p&uacute;blica fuera de la vivienda">  {{row.c188}} </td> 
                <td width="100" class="center" header="Pozo, cisterna">  {{row.c189}} </td> 
                <td width="100" class="center" header="Rio, acequia">  {{row.c190}} </td> 
                <td width="140" class="center" h-class="hg" header="Familia cuenta con mochila de emergencia">  {{row.c191}} </td> 
                <td width="140" class="center" header="Familia cuenta con botiqu&iacute;n de emergencia">  {{row.c192}} </td> 
                <td width="380" class="center" h-class="hg" header="Su vivienda ¿cuenta con espacios destinados al almacenamiento, conservaci&oacute;n, manipulaci&oacute;n y consumo de alimentos?">  {{row.c193}} </td> 
                <td width="270" class="center" header="Su cocina ¿cuenta con sistema de eliminaci&oacute;n del humo de cocina o ventilaci&oacute;n?">  {{row.c194}} </td> 
                <td width="100" class="center" h-class="hg" header="Mascota: perro, gato">  {{row.c196}} </td> 
                <td width="100" class="center" h-class="hgd" header="Vacunas">  {{row.c197}} </td> 
                <td width="250" class="center" header="ANIMALES: De importancia econ&oacute;mica: cabras, cameros, cerdos, vaca, aves de corral">  {{row.c198}} </td> 
                <td width="100" class="center" h-class="hbd" header="Vacunas">  {{row.c199}} </td> 
                <td width="180" class="center" header="Convive con los animales dentro de la vivienda">  {{row.c200}} </td> 
                <td width="200" class="center" h-class="hr" header="RIESGOS ENTORNO / Lluvias, inundaciones">  {{row.c202}} </td> 
                <td width="100" class="center" h-class="hr" header="Basural junto a la vivienda">  {{row.c203}} </td> 
                <td width="100" class="center" h-class="hr" header="Inservibles junto a la vivienda">  {{row.c204}} </td> 
                <td width="280" class="center" h-class="hr" header="Humos o vapores de productos quimicos de fabr&iacute;cas, industrias o mineria">  {{row.c205}} </td> 
                <td width="100" class="center" h-class="hr" header="Riesgo de derrumbes, huaycos">  {{row.c206}} </td> 
                <td width="140" class="center" h-class="hr" header="Pandillaje, delincuencia">  {{row.c207}} </td> 
                <td width="140" class="center" h-class="hr" header="Alcoholismo, drogadicci&oacute;n">  {{row.c208}} </td> 
                <td width="100" class="center" h-class="hr" header="Sin alumbrado p&uacute;blico">  {{row.c209}} </td> 
                <td width="100" class="center" h-class="hr" header="Pistas no asfaltadas">  {{row.c210}} </td> 
                <td width="180" class="center" h-class="hr" header="Vectores (mosquitos, zancudo, roedores, etc)">  {{row.c211}} </td> 
                <td width="80" class="center" header="Usuario">  {{row.user}} </td> 
                <td width="120" class="center" header="Fecha Actualizaci&oacute;n">  {{row.updatedDate|date}} </td> 
            </template>
            </v-table>
        </v-form>
    </ion-content>
</template>
<script>
var _=window._;
export default _.ui({
    data(){
        return {rowSelectedCount2:0,page:0,data:[],mode:0,query:null}
    },
    created(){
        this.filters.uid=this.user.uid;
        this.$on('sync',function(dr,dl){//data remote -> data local
            if(dr.people&&dl.people){
                dr.people.forEach(pr=>{
                    dl.people.forEach(pl=>{
                        if(pl.tmpId==pr.tmpId){
                            if(pr.id){
                                pl.id=pr.id;
                                pl.tmpSynchronized=1;
                            }
                            if(pr.encuesta_id){
                                pl.encuesta_id=pr.encuesta_id;
                                pl.parent=pr.encuesta_id;
                            }
                            console.log(pl);
                        }
                    });
                });
            }
        });
    },
    updated(){
        this.app.bindLinks(this.$el);
    },
    methods: {
        ll(e){console.log(e)},
        rss(e){
            e=e.selection;
            this.rowSelectedCount2=e?e.length:0;
        },
        can(o) {
            var m = this, u = m.user;
            return o||u.uid==1;
            /*return u.uid == 1 || p.REGISTER_DESARROLLO_SOCIAL_SIVICO &&
            !o || o.user == u.id;*/
        },
        view(o) {
            this.open('/admin/desarrollo-social/sivico/' + (o.tmpId?(-o.tmpId):o.id));
        },
        toInt(o){
            return Array.isArray(o)?o.length:o;
        }
    }
});
</script>
<style scoped>
	.hg{
            background-color:green !important; 
        }
        .hgd{
            background-color:#005d00 !important; 
        }
        .hr{
            background-color:#bf0000 !important; 
        }
        .hbd{
            background-color:#033d71 !important; 
        }
</style>