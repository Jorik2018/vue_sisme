<template>
    <v-form action="/api/desarrollo-social/sivico" :title="o.synchronized" header="Ver MCI" store="pool"
        :class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')"> 
        <div class="v-form"> <label>ID:</label> 
            <div>
                {{pad(o.id,4)}}
            </div> 
            <label>DIRESA:</label> 
            <div>ANCASH</div>
            <label>Red:</label>
            <div>{{o.red}}<template v-if="o.ext.redName">: {{o.ext.redName}}</template></div>
            <label>Microred:</label>
            <div>{{o.microred?o.microred:'---'}}</div>
            <label>Establecimiento:</label>
            <div>{{o.establishment?o.establishment:'---'}}<template v-if="o.ext.establishmentName">: {{o.ext.establishmentName}}</template></div>
            <v-fieldset legend="LOCALIZACION DE LA VIVIENDA Y DATOS SOCIODEMOGRAFICOS" closable="true" class="v-form"> 
                <label>Provincia:</label> 
                <div>{{o.province?o.province:'---'}}</div>
                <label>Distrito:</label> 
                <div>{{o.district?o.district:'---'}}</div>
                <label>Sector:</label> 
                <div>{{o.sector?o.sector:'---'}}</div>
                <label>Area de Residencia:</label> 
                <div>{{o.areaResidencia?o.areaResidencia:'---'}}</div>
                <label>Telefono:</label> 
                <div>{{o.phone?o.phone:'---'}}</div>
                <label>Dirección:</label> 
                <div>{{o.address?o.address:'---'}}</div>
            </v-fieldset>
            <v-fieldset legend="Coordenadas" style="width: auto"> 
				<div class="center" v-if="o.lat&&o.lat!=0||o.lon&&o.lon!=0" 
style="margin-top:10px;border:1px solid #ffcf00;background-color:#ffff80;padding:10px;">
<a :href="'https://www.google.com/maps/search/?api=1&query='+o.lat+','+o.lon" target="_blank">({{o.lat?o.lat:'---'}},{{o.lon}})</a>
</div>
            </v-fieldset> 
            <v-fieldset legend="VISITA DE SALUD FAMILIAR" closable="true" class="v-form"> 
                <label>Fecha:</label> 
                <div>{{o.fecha?o.fecha:'---'}}</div>
                <label>Responsable Visita:</label> 
                <div>{{o.responsableVisita?o.responsableVisita:'---'}}</div>
            </v-fieldset>
            <v-fieldset legend="Integrantes"> 
                <v-table autoload="false"
                    store="people" src="/api/desarrollo-social/sivico/people/0/0" 
                    row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')" 
                    ref="people" :filters="filters" @row-select="peopleSelected=$event.current"> 
                    <template v-slot:default="{row}"> 
                        <td header="DNI" class="center" width="80"> {{row.code}} </td> 
                        <td header="Nombre Completo"> {{row.surnames}} {{row.names}} </td> 
                    </template>
                </v-table> 
                <div class="right" style="margin-top: 10px"> 
                    <v-button icon="fa-trash" :disabled="!peopleSelected" 
                        @click="destroy($refs.people)"></v-button>
                    <v-button icon="fa-pen" :disabled="!peopleSelected" 
                        @click="edit($refs.people)"></v-button>
                    <v-button icon="fa-plus" @click="addPeople(o)"></v-button> 
                </div> 
            </v-fieldset> 
            <v-fieldset legend="Acuerdos"> 
                <v-table store="agreement" autoload="false" :value="o.agreements" 
                    src="/api/desarrollo-social/sivico/agreement/0/0" ref="agreement" 
                    row-style-class="row.synchronized?'green':(row.tmpId>0?'yellow':'')" 
                    :filters="filters" @row-select="agreementSelected=$event.current"> 
                    <template v-slot="{row}">
                        <td width="40%" header="Tipo"> {{agreementType[row.type]}} 
                            <div v-if="row.sivicoPeople"> 
                                <b>
                                    {{row.sivicoPeople.code}}: {{row.sivicoPeople.surnames}} {{row.sivicoPeople.names}}
                                </b> 
                            </div>
                        </td> 
                        <td header="Acuerdo"> {{row.agreement}} </td> 
                    </template>
                </v-table> 
                <div class="right" style="margin-top: 10px"> 
                    <v-button icon="fa-trash" :disabled="!agreementSelected" 
                        @click="destroy($refs.agreement)"></v-button> 
                    <v-button icon="fa-pen" :disabled="!agreementSelected" 
                        @click="edit($refs.agreement)"></v-button>
                    <v-button icon="fa-plus" @click="addAgreement(o)"></v-button> 
                </div> 
            </v-fieldset> 
        </div>
        <center style="margin-bottom:10px;"> 
            <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
            <v-button style="margin-left:10px;" value="Editar" :disabled="!o.id" icon="fa-eye" class="blue" 
                @click.prevent="$router.replace('/admin/desarrollo-social/sivico/'+(o.tmpId?(-o.tmpId):o.id)+'/edit')"></v-button>
        </center> 
    </v-form>
</template>
<script>
	var axios=window.axios;
        var Vue=window.Vue;
        var _=window._;
        export default _.ui({
            props: ['id'],
            watch: {
                $route() {
                    this.render();
                }
            },
            created(){
                var me=this;
                this.$on('destroyed',(o)=>{
                    console.log(o);
                });
                this.$on('sync',(o)=>{
                    me.getStoredList('pool').then((pools)=>{
                        pools.forEach(e =>{
                            if(e.tmpId==Math.abs(o.tmpId)){
                                e.peoples.forEach(e=>{
                                    if(o.peoples)
                                        o.peoples.forEach(o=>{
                                            if(o.tmpId==e.tmpId){
                                                e.id=o.id;
                                                e.synchronized=o.synchronized;
                                            }
                                        });
                                    e.masterId=o.id;
                                });
                                e.agreements.forEach(e=>{
                                    if(o.agreements)
                                        o.agreements.forEach(o=>{
                                            if(o.tmpId==e.tmpId){
                                                e.id=o.id;
                                                e.synchronized=o.synchronized;
                                            }
                                        });
                                    e.masterId=o.id;
                                });
                                window._.db.transaction(['pool'], "readwrite").objectStore('pool').put(e);
                            }
                        });
                    });
                });
            },
            data() {
                return {
                    ddq:[
                        [1,'INSTRUMENTOS DE EVALUACIóN FAMILIAR','frame'],
                        [2,'CICLO VITAL FAMILIAR','radio_group'],
                        [3,'Familia en formación','radio'],
                        [4,'Familia en expansión','radio'],
                        [5,'Con nacimiento del primer hijo/a','checkbox'],
                        [6,'Con hija/o en edad pre-escolar','checkbox'],
                        [7,'Con hija/o en edad escolar','checkbox'],
                        [8,'Con hija/o adolescente','checkbox'],
                        [9,'Con hija/o en edad adulta','checkbox'],
                        [10,'Familia en dispersión','radio'],
                        [11,'Familia en contraccion','radio'],
                        [12,'TIPO DE FAMILIA','radio_group'],
                        [13,'Nuclear','radio'],
                        [14,'Extendida','radio'],
                        [15,'Ampliada','radio'],
                        [16,'Monoparental','radio'],
                        [17,'Reconstituida','radio'],
                        [18,'Equivalente familiar','radio'],
                        [19,'Otro','radio'],
                        [20,'Otro','varchar(100)'],
                        [21,'ECOMAPA','image'],
                        [22,'FAMILIOGRAMA','image'],
                        [23,'Fecha(s) de elaboración','datetime'],
                        [24,'Realizado por','label'],
                        [123,'CARACTERISTICAS DE LA FAMILIA Y LA VIVIENDA',''],
                        [124,'Material del Piso','group'],
                        [125,'Madera','checkbox'],
                        [126,'Parquel','checkbox'],
                        [127,'Losetas','checkbox'],
                        [128,'Cemento/ladrillo','checkbox'],
                        [129,'Tierra','checkbox'],
                        [130,'Otros','checkbox'],
                        [131,'Material de las paredes','group'],
                        [132,'Madera, estera','checkbox'],
                        [133,'Adobe o tapia','checkbox'],
                        [134,'Cemento/ladrillo','checkbox'],
                        [135,'Quincha (caña de barro), piedra con barro','checkbox'],
                        [136,'Otros','checkbox'],
                        [137,'Material de techo','group'],
                        [138,'Calamina','checkbox'],
                        [139,'Madera, tejas','checkbox'],
                        [140,'Noble','checkbox'],
                        [141,'Eternit o fibra de cemento','checkbox'],
                        [142,'Paja, hojas','checkbox'],
                        [143,'Caña o esteras con barro','checkbox'],
                        [144,'Eliminación de excretas','group'],
                        [145,'Aire libre','checkbox'],
                        [146,'Acequia, canal','checkbox'],
                        [147,'Red pública (*)','checkbox'],
                        [148,'Letrina','checkbox'],
                        [149,'Pozo séptico','checkbox'],
                        [150,'Otros','checkbox'],
                        [151,'Disposición de basura','group'],
                        [152,'Carro recolector (Frecuencia)','checkbox'],
                        [153,'A campo abierto','checkbox'],
                        [154,'Al rio','checkbox'],
                        [155,'Se entierra, quema','checkbox'],
                        [156,'En un pozo','checkbox'],
                        [157,'Otros','checkbox'],
                        [158,'Servicios en el domicilio','group'],
                        [159,'Telefono','checkbox'],
                        [160,'Internet','checkbox'],
                        [161,'Cable','checkbox'],
                        [162,'Electricidad','checkbox'],
                        [163,'Agua, desague','checkbox'],
                        [164,'Otros','checkbox'],
                        [165,'Combustible para cocinar','group'],
                        [166,'Leña','checkbox'],
                        [167,'Carbón','checkbox'],
                        [168,'Bosta','checkbox'],
                        [169,'Gas, electricidad','checkbox'],
                        [170,'Conservación de alimentos','group'],
                        [171,'A temperatura ambiente','checkbox'],
                        [172,'Refrigerio','checkbox'],
                        [173,'En recipiente sin tapa','checkbox'],
                        [174,'En recipiente con tapa','checkbox'],
                        [175,'N° de personas x habitacion','radio_group'],
                        [176,'De 1 a 3 miembros','radio'],
                        [177,'De 4 miembros a mas','radio'],
                        [178,'Disponibilidad de Transporte Propio','radio_group'],
                        [179,'Automovil','radio'],
                        [180,'Bicicleta','radio'],
                        [181,'Motocicleta','radio'],
                        [182,'Otro','radio'],
                        [183,'Agua de consumo','radio_group'],
                        [184,'Agua con tratamiento','radio'],
                        [185,'Agua sin tratamiento','radio'],
                        [186,'Abastecimiento de agua','group'],
                        [187,'Red pública dentro de la vivienda','checkbox'],
                        [188,'Red pública fuera de la vivienda','checkbox'],
                        [189,'Pozo, cisterna','checkbox'],
                        [190,'Rio, acequia','checkbox'],
                        [191,'Familia cuenta con mochila de emergencia','checkbox'],
                        [192,'Familia cuenta con botiquén de emergencia','checkbox'],
                        [193,'Su vivienda ¿cuenta con espacios destinados al almacenamiento, conservación, manipulación y consumo de alimentos?','checkbox'],
                        [194,'Su cocina ¿cuenta con sistema de eliminación del humo de cocina o ventilación?','checkbox'],
                        [195,'TENENCIA DE ANIMALES',''],
                        [196,'Mascota: perro, gato','checkbox'],
                        [197,'Vacunas','checkbox'],
                        [198,'De importancia económica: cabras, cameros, cerdos, vaca, aves de corral','checkbox'],
                        [199,'Vacunas','checkbox'],
                        [200,'Convive con los animales dentro de la vivienda','checkbox'],
                        [201,'Riesgos del Entorno','group'],
                        [202,'Lluvias, inundaciones','checkbox'],
                        [203,'Basural junto a la vivienda','checkbox'],
                        [204,'Inservibles junto a la vivienda','checkbox'],
                        [205,'Humos o vapores de productos quimicos de fabr�cas, industrias o mineria','checkbox'],
                        [206,'Riesgo de derrumbes, huaycos','checkbox'],
                        [207,'Pandillaje, delincuencia','checkbox'],
                        [208,'Alcoholismo, drogadicción','checkbox'],
                        [209,'Sin alumbrado público','checkbox'],
                        [210,'Pistas no asfaltadas','checkbox'],
                        [211,'Vectores (mosquitos, zancudo, roedores, etc)','checkbox']
                    ],
                    peopleSelected:null,
                    agreementSelected:null,
                    k:0,
                    dd:[],
                    agreementType:{
                        P:'SALUD INDIVIDUAL',
                        F:'FUNCIONES DE LA FAMILIA',
                        V:'CODICIONES MATERIALES DE VIDA Y ENTORNO'
                    },
                    relationship: [
                        {id: 'P', name: 'PADRE', sex: 'M'},
                        {id: 'M', name: 'MADRE', sex: 'F'},
                        {id: 'H', name: 'HIJA/O', sex: 'X'},
                        {id: 'HA', name: 'HIJA/O ADOPTIVA/O', sex: 'X'},
                        {id: 'A', name: 'ABUELA/O', sex: 'X'},
                        {id: 'T', name: 'TIA/O', sex: 'X'},
                        {id: 'N', name: 'NIETA/O', sex: 'X'},
                        {id: 'PA', name: 'PADASTRO', sex: 'M'},
                        {id: 'MA', name: 'MADASTRA', sex: 'F'},
                        {id: 'S', name: 'SOBRINA/O', sex: 'X'},
                        {id: 'PR', name: 'PRIMA/O', sex: 'X'},
                        {id: 'BA', name: 'BIS-ABUELA/O', sex: 'X'},
                        {id: 'AMG', name: 'AMIGA/O', sex: 'X'},
                        {id: 'HM', name: 'HERMANA/O', sex: 'X'},
                        {id: 'Y', name: 'YERNO', sex: 'M'},
                        {id: 'N', name: 'NUERA', sex: 'F'}
                    ],
                    civilStatus: [
                        {id: 'S', name: 'SOLTERA/O'},
                        {id: 'CO', name: 'CONVIVIENTE'},
                        {id: 'C', name: 'CASADA/O'},
                        {id: 'SP', name: 'SEPARADA/O'},
                        {id: 'D', name: 'DIVORCIADA/O'},
                        {id: 'V', name: 'VIUDA/O'},
                        {id: 'O', name: 'OTROS'}
                    ],
                    degreeInstruction: [
                        {id: 'SI', name: 'SIN INSTRUCCION'},
                        {id: 'I', name: 'INICIAL'},
                        {id: 'PC', name: 'PRIMARIA COMPLETA'},
                        {id: 'PI', name: 'PRIMARIA INCOMPLETA'},
                        {id: 'SC', name: 'SECUNDARIA COMPLETA'},
                        {id: 'SI', name: 'SECUNDARIA INCOMPLETO'},
                        {id: 'SUC', name: 'SUPERIOR COMPLETO'},
                        {id: 'SUI', name: 'SUPERIOR INCOMPLETO'}
                    ],
                    occupationCondition: [
                        {id: 'S', name: 'TRABAJADOR ESTABLE'},
                        {id: 'V', name: 'EVENTUAL'},
                        {id: 'SO', name: 'SIN OCUPACION'},
                        {id: 'J', name: 'JUBILADA/O'},
                        {id: 'E', name: 'ESTUDIANTE'}
                    ],
                    relation: [
                        [0, 27, 0, 11, 'X'],
                        [0, 28, 0, 11, 'X'],
                        [0, 29, 0, 11, 'X'],
                        [0, 30, 0, 11, 'X'],
                        [0, 31, 0, 11, 'X'],
                        [0, 32, 0, 11, 'X'],
                        [0, 33, 0, 200, 'X'],
                        [0, 34, 0, 11, 'X'],
                        [0, 35, 0, 11, 'X'],
                        [0, 36, 0, 11, 'X'],
                        [0, 37, 0, 11, 'X'],
                        [0, 38, 0, 17, 'X'],
                        [0, 39, 0, 11, 'X'],
                        [0, 40, 0, 200, 'X'],
                        [0, 41, 12, 17, 'X'],
                        [0, 42, 12, 29, 'X'],
                        [0, 43, 12, 17, 'X'],
                        [0, 44, 12, 17, 'X'],
                        [0, 45, 12, 17, 'X'],
                        [0, 46, 12, 17, 'X'],
                        [0, 47, 12, 29, 'X'],
                        [0, 48, 12, 17, 'X'],
                        [0, 49, 12, 59, 'X'],
                        [0, 50, 18, 29, 'X'],
                        [0, 51, 18, 200, 'X'],
                        [0, 52, 18, 200, 'X'],
                        [0, 53, 18, 29, 'X'],
                        [0, 54, 18, 29, 'X'],
                        [0, 55, 18, 65, 'F'],
                        [0, 56, 18, 59, 'X'],
                        [0, 57, 30, 200, 'X'],
                        [0, 58, 30, 59, 'X'],
                        [0, 59, 35, 200, 'M'],
                        [0, 60, 45, 200, 'F'],
                        [0, 61, 50, 69, 'F'],
                        [0, 62, 50, 200, 'M'],
                        [0, 63, 60, 200, 'X'],
                        [0, 64, 60, 200, 'X'],
                        [0, 65, 60, 200, 'X'],
                        [0, 66, 60, 200, 'X']
                    ],
                    o: {synchronized:null,ext:{}}
                }
            },
            computed: {
                relationshipFiltered() {
                    var me = this;
                    return me.o.sex ? me.relationship.filter(function (el) {
                        return (el.sex == me.o.sex || el.sex == 'X');
                    }) : [];
                },
                vif() {
                    var d = this.diff, v, r = this.relation;
                    for (var i = 0; r.length > i; i++){
                    v = r[i];
                            v[0] = 0;
                            if (d && d.ans >= v[2] && v[3] >= d.ans &&
                                    (v[4] == this.o.sex || v[4] == 'X'))
                    v[0] = 1;
                    }
                    return r;
                },
                currentLifeStage() {
                    var d = this.diff;
                    var e = 1;
                    if (d) {
                        e = 0;
                        if (18 > d.ans) {
                            e = 1;
                        } else if (30 > d.ans) {
                            e = 2;
                        } else if (60 > d.ans) {
                            e = 3;
                        } else {
                            e = 4;
                        }
                        return this.lifeStage[e];
                    }
                    return null;
                },
                diff() {
                    var d;
                    if (this.o.birthdate) {
                        if (this.o.birthdate.split) {
                            d = this.o.birthdate.split('-');
                            d = new Date(d[0], d[1] - 1, d[2]);
                        } else {
                            d = new Date(this.o.birthdate);
                        }
                        d = Vue.dateDiff(d, new Date());
                    }
                    return d;
                },
                dateDiff() {
                    var s = '', d = this.diff;
                    if (d) {
                        if (d.ans > 0)
                            s += 'AÑOS=' + d.ans;
                        if (d.meses > 0)
                            s += ' MESES=' + d.meses;
                        if (d.dias > 0)
                            s += ' DIAS=' + d.dias;
                    }
                    return s;
                }
            },
            methods: {
                close(){},
                addPeople(o){
                    console.log(this);
                    this.open('/admin/desarrollo-social/sivico/'+o.id+'/add/people',this.$refs.people.load);
                },
                addAgreement(o){
                    this.open('/admin/desarrollo-social/sivico/'+o.id+'/add/agreement',this.$refs.agreement.load);
                },
                loadTables(){
                    var refs=this.$refs;
                    refs.people.load();
                    refs.agreement.load();
                },
                render() {
                    var me = this, id = me.id;
                    
                    if(id<0){
                        me.getStoredList('pool').then((pool)=>{
                            pool.forEach(e =>{
                                if(e.tmpId==Math.abs(me.id)){
                                    
                                    
                                    me.o=e;
                                    me.trayLocation=e.lat&&e.lon;
                                    console.log('ooooooooooooooooooooo');
                                    console.log(me.o);
                                    me.setStoredList('people',me.o.peoples);
                                    me.setStoredList('agreement',me.o.agreements);

                                    me.filters.masterId=e.id;
                                    me.loadTables();
                                    me.k++;
                                }
                            });
                        });
                    }else if (Number(id)) {
                        me.filters.masterId=me.id;
                        var loaded=0;
                        me.getStoredList('pool').then((pool)=>{
                            pool.forEach(e =>{
                                if(e.id==me.id){
                                    me.o=e;
                                    me.trayLocation=e.lat&&e.lon;
                                    me.setStoredList('people',me.o.peoples);
                                    me.setStoredList('agreement',me.o.agreements);
                                    me.loadTables();
                                    loaded=1;
                                }
                            });
                        });
                        axios.get('/api/desarrollo-social/sivico/' + id).then(function (response) {
                            me.o = response.data;
                            if(!loaded)me.loadTables();
                        });
                    }
                },
                process(o) {
                    var user = this.user;
                    if (user)
                        o.user = user.id;
                    return o;
                }
            },
            mounted() {
                var me=this;
                if(me.$children[0])me.app.title=me.$children[0].header;
                me.render();
            }
        })
</script>
<style scoped>
	#dateDiff:empty,#msg:empty{
            display:none;
        }
        #dateDiff{
            border-radius:4px;background-color:#fdfad9;border:1px solid #dddddd;padding:5px 10px;margin-top:10px;
        }
</style>