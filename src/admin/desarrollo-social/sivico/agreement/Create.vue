<template>
    <v-form action="/api/desarrollo-social/sivico/agreement" store="agreement"
        :class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')"
        v-bind:header="(o.id?'Editar':'Crear')+' Acuerdo'"> 
        <div class="v-form">
            <label>MCI:</label>
            <div>{{pad(o.masterId,4)}}</div>
            <label>EJE INTERVENCIÓN:</label>
            <v-select v-model="o.type" :autoload="false" v-bind:required="true"  > 
                <option>Select One...</option> 
                <option v-for="(item,i) in type" v-bind:value="item.id" v-bind:key="i">{{item.name}}</option> 
            </v-select> 
            <template v-if="o.type=='P'"> 
                <label>Persona:</label>
                <v-select v-model="o.peopleId" ref="people" :required="true" > 
                    <option>Select One...</option> 
                    <v-options value-field="id" :data="peoples" src="/api/desarrollo-social/sivico/people/0/0"
                        :filters="filters"> 
                        <template v-slot="{item}">
                        {{item.code}}: {{item.surnames}} {{item.names}} 
                        </template> 
                    </v-options> 
                </v-select> 
            </template>
            <label>Acuerdo:</label>
            <v-textarea required="true" v-model="o.agreement"></v-textarea>
            <label>Responsable:</label> 
            <input type="text" required="true" v-model="o.responsable" title="Responsable" />
            <label>Visita 1:</label>
            <v-calendar v-model="o.visit1"></v-calendar>
            <label>Visita 2:</label>
            <v-calendar v-model="o.visit2"></v-calendar>
            <label>Visita 3:</label>
            <v-calendar v-model="o.visit3"></v-calendar>
            <label>Visita 4:</label>
            <v-calendar v-model="o.visit4"></v-calendar>
            <label>Observación:</label>
            <v-textarea v-model="o.remark"></v-textarea> 
        </div> 
        <center>
            <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
        </center> 
    </v-form>
</template>
<script>
    var axios=window.axios;
    var _=window._;
    export default _.ui({
        props:['id','action'],
        data(){return {
                type:[
                    {id:'P',name:'SALUD INDIVIDUAL',decription:'Comprende los paquetes de atención integral por etapas de vida'},
                    {id:'F',name:'FUNCIONES DE LA FAMILIA',decription:'Comprende las funciones básicas: cuidado, afecto, expresi�n de sexualidad, socializaci�n estatus social y las funciones seg�n seg�n sus relaciones internas: comunicaci�n, cohesi�n, permeabilidad, rol, adaptabilidad y armon�a)'},
                    {id:'V',name:'CODICIONES MATERIALES DE VIDA Y ENTORNO',decription:'Comprende las caracteristicas de la vivienda, eliminaci�n de excretas, tenencia de animales, aguas estancadas, vectores, pandillaje y otros alrededor de la vivienda'}
                ],
                o:{type:null,ext:{}},
                peoples:[]
        }},
        methods:{
            render(){
                var me = this, id = me.id, action = me.action,master;
                if (Number(id)){
                    if (action == 'add') {
                        me.o = {masterId: id, ext: {}};
                        me.filters.masterId=id;
                        me.getStoredList('pool').then((pool)=>{
                            pool.forEach(e =>{
                                if(e.tmpId==Math.abs(me.id)){
                                    me.peoples=e.peoples;
                                }
                            });
                        });
                    } else 
                        axios.get('/api/desarrollo-social/sivico/agreement/' + id).then(function (response) {
                            me.filters.masterId=response.data.masterId;
                            me.o = response.data;
                        });
                }else if(action == 'add'){
                    me.o = {masterId: master, ext: {}};
                    me.filters.masterId=master;
                }
            },
            close(r){
                var me=this;
                if(r.success===true){
                    me.o.id=r.data.id;
                    me.o.tmpId=r.data.tmpId;
                }
                me.$router.back();
            }
        },
        created(){
            var me=this;
            this.$on('sync',(data,o)=>{
                me.getStoredList('pool').then((pools)=>{
                    pools.forEach(e =>{
                        if(o.masterId<0&&e.tmpId==Math.abs(o.masterId)||e.id==o.masterId){
                            e.agreements.forEach((e2,i)=>{
                                if(e2.tmpId==o.tmpId)e.agreement[i]=o;
                            });
                            window._.db.transaction(['pool'], "readwrite").objectStore('pool').put(e);
                        }
                    });
                });
            });
            this.$on('stored',(o,data)=>{
                
                me.getStoredList('pool').then((pools)=>{
                    pools.forEach(e =>{
                        if(o.masterId<0&&e.tmpId==Math.abs(o.masterId)||e.id==o.masterId){
                            e.agreements=data;
                            delete e.synchronized;
                            window._.db.transaction(['pool'], "readwrite").objectStore('pool').put(e);
                        }
                    });
                });
            });
        },
        mounted() {
            var me=this;
            if(me.$children[0])me.app.title=me.$children[0].header;
            me.render();
        }
    })
</script>