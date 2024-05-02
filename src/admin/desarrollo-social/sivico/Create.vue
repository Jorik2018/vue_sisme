<template>
    <v-form action="/api/desarrollo-social/sivico" :header="(o.id?'Editar':'Crear')+' MCI'" 
        :class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')"  store="pool" > 
        <div class="v-form">
            <label>ID:</label> 
            <div>{{pad(o.id?o.id:0,4)}}</div>
            <label>DIRESA:</label> 
            <div>ANCASH</div>
            <label>Red:</label>
            <v-select v-model="o.red" autoload="false" ref="red"
                v-on:input="$refs.microredSelect.load({Codigo_Red:o.red})" :required="true"> 
                <option>Select One...</option> 
                <v-options store="red" display-field="name" value-field="code"/>
            </v-select> 
            <label>Microred:</label>
            <v-select autoload="false" :disabled="!o.red" store="microred" ref="microredSelect" v-model="o.microred" 
					:required="true" @input="$refs.establishment.load({Codigo_Cocadenado:o.microred})"> 
                <option>Select One...</option> 
                <v-options store="microred" display-field="name" value-field="code"/>
            </v-select> 
            <label>Establecimiento:</label>
            <v-select ref="establishment" v-model="o.establishment" :autoload="false" :disabled="!o.microred" :required="true"> 
                <option>Select One...</option> 
                <v-options store="establishment" display-field="name" value-field="code"/>
            </v-select> 
            <v-fieldset legend="LOCALIZACION DE LA VIVIENDA Y DATOS SOCIODEMOGRAFICOS" closable="true" class="v-form"> 
                <label>Provincia:</label> 
                <v-select ref="province" storage="province_selected" v-model="o.province" :required="true" 
                    @input="$refs.district.load({code:o.province})"> 
                    <option>Select One...</option>
                    <v-options store="province" display-field="name" value-field="code"/>
                </v-select> 
                <label>Distrito:</label> 
                <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province" v-model="o.district" name="district" required="required"> 
                    <option value="">Select One...</option> 
                    <v-options store="district" value-field="code" display-field="name"/> 
                </v-select> 
                <label>Sector:</label> 
                <input type="text" v-model="o.sector" /> 
                <label>Area de Residencia:</label> 
                <v-select v-model="o.areaResidencia" :required="true"> 
                    <option>Select One...</option> 
                    <option v-for="v in areaResidencia" :key="v.id" :value="v.name">{{v.name}}</option> 
                </v-select> 
                <label>Telefono:</label> 
                <input type="text" v-model="o.phone" title="Telefono" /> 
                <label>Dirección:</label> 
                <input type="text" v-model="o.address" required="required" title="Dirección" /> 
                <v-fieldset legend="Coordenadas" style="width: auto"> 
                    <div class="right">
                    <v-button icon="fa-compass" 
value="Obtener Geolocalización" v-on:click="printCurrentPosition"/>
</div>
				<div class="center" v-if="o.lat&&o.lat!=0||o.lon&&o.lon!=0||trayLocation" 

style="margin-top:10px;border:1px solid #ffcf00;background-color:#ffff80;padding:10px;">({{o.lat}},{{o.lon}})</div>
                </v-fieldset> 
                <label>Tiempo que Demora en Llegar a E.E.S.S.:</label> 
                <input type="text" v-model="o.tiempoAEess" /> 
                <label>Medio de Transporte de Mayor Uso:</label> 
                <v-textarea type="text" v-model="o.medioTransporte" maxlength="100"/> 
                <label>Tiempo Residencia en Domicilio Actual:</label> 
                <input type="text" v-model="o.tiempoDomicilio" /> 
                <label>Residencias Anteriores:</label> 
                <v-textarea type="text" v-model="o.residenciasAnteriores" maxlength="200" /> 
                <label>Mail:</label> 
                <input type="text" v-model="o.mail" maxlength="100"/> 
            </v-fieldset> 
            <v-fieldset legend="VISITA DE SALUD FAMILIAR" closable="true" class="v-form"> 
                <label>Fecha:</label> 
                <v-calendar v-model="o.fecha"></v-calendar> 
                <label>Responsable Visita:</label> 
                <input type="text" v-model="o.responsableVisita" title="Responsable Visita" /> 
                <label>Resultado de Visita:</label> 
                <v-select v-model="o.resultadoVisita" :required="true"> 
                    <option>Select One...</option> 
                    <option v-for="v in resultadoVisita" :key="v" :value="v">{{v}}</option> 
                </v-select> 
                <label>Disponibilidad para Prox. Visita:</label> 
                <v-switch v-model="o.disponibilidadProxVisita"></v-switch> 
                <template v-if="o.disponibilidadProxVisita"> 
                    <label>Proxima Visita:</label> 
                    <v-calendar v-model="o.proximaVisita"></v-calendar> 
                </template> 
            </v-fieldset> 
            <label>Informante:</label> 
            <input type="text" v-model="o.informante" required="required" /> 
            <v-fieldset legend="CARACTERISTICAS DE LOS MIEMBROS DE LA FAMILIA"> 
                <label>Etnia:</label> 
                <input type="text" v-model="o.etnia" title="Etnia" /> 
                <label>Idioma:</label> 
                <input type="text" v-model="o.idioma" title="Idioma" /> 
                <label>Religión:</label> 
                <input type="text" v-model="o.religion" title="Religión" /> 
            </v-fieldset> 
            <v-fieldset legend="INSTRUMENTOS DE EVALUACIÓN FAMILIAR"> 
                <label>CICLO VITAL FAMILIAR</label> 
                <v-group v-model="o.c2" required="required"> 
                    <v-radio value="3" label="Familia en formación"></v-radio> 
                    <v-radio value="4" label="Familia en expansión"></v-radio> 
                    <v-fieldset v-if="o.c2==4" class="v-group" style="margin-bottom: 10px;padding-top: 0px"> 
                        
                            <v-checkbox v-model="o.c5" :value-false="0" :value="1" label="Con nacimiento del primer hijo/a"></v-checkbox> 
                            <v-checkbox v-model="o.c6" :value-false="0" :value="1" label="Con hija/o en edad pre-escolar"></v-checkbox> 
                            <v-checkbox v-model="o.c7" :value-false="0" :value="1" label="Con hija/o en edad escolar"></v-checkbox> 
                            <v-checkbox v-model="o.c8" :value-false="0" :value="1" label="Con hija/o adolescente"></v-checkbox> 
                            <v-checkbox v-model="o.c9" :value-false="0" :value="1" label="Con hija/o en edad adulta"></v-checkbox> 
                        
                    </v-fieldset> 
                    <v-radio value="10" label="Familia en dispersión"></v-radio> 
                    <v-radio value="11" label="Familia en contraccion"></v-radio> 
                </v-group> 
                <label>TIPO DE FAMILIA</label> 
                <v-group v-model="o.c12" required="required"> 
                    <v-radio value="13" label="Nuclear"></v-radio> 
                    <v-radio value="14" label="Extendida"></v-radio> 
                    <v-radio value="15" label="Ampliada"></v-radio> 
                    <v-radio value="16" label="Monoparental"></v-radio> 
                    <v-radio value="17" label="Reconstituida"></v-radio> 
                    <v-radio value="18" label="Equivalente familiar"></v-radio> 
                    <v-radio value="19" label="Otro"></v-radio> 
                    <input v-if="o.c12==19" v-model="o.c20" /> 
                </v-group> 
                <label>FAMILIOGRAMA</label> 
                <div class="right">
                    <v-uploader icon="fa-camera" style="margin-top:10px" value="Obtener Imagen" ref="uploader"
                        :click="uploaderClick" @input="changeImage($event)">
                    </v-uploader>
                    <a class="_" v-if="o.ext.src||o.c22" :style="{borderColor:o.ext.pending?'yellow':''}"
                        :href="!o.id?(o.ext.src?o.ext.src:'#'):(baseURL+'/fs/desarrollo-social/sivico/familiograma/'+o.id+'.jpeg')"
                        style="display:block;border:2px solid gray;margin-top:10px"> 
                        <img @error="errorImg"
                        style="width:-webkit-fill-available;display:block;" 
                        :src="o.ext.src?o.ext.src:(baseURL+'/fs/desarrollo-social/sivico/familiograma/'+o.id+'.jpeg')" /> 
                    </a> 
                    <v-button icon="fa-paper-plane" v-if="app.connected&&o.ext.src>0" style="margin-top:10px"  @click="syncImage" value="Enviar imagen"/>
                </div> 
                <label>Fecha(s) de elaboración</label> 
                <v-calendar v-model="o.c23"></v-calendar> 
                <label>Realizado por</label> 
                <input v-model="o.c24" /> 
            </v-fieldset>
            <v-fieldset legend="CARACTERISTICAS DE LA FAMILIA Y LA VIVIENDA" closable="true"> 
                <label>Material del Piso</label> 
                <v-checkbox v-model="o.c125" :value-false="0" :value="1" label="Madera"></v-checkbox> 
                <v-checkbox v-model="o.c126" :value-false="0" :value="1" label="Parquel"></v-checkbox> 
                <v-checkbox v-model="o.c127" :value-false="0" :value="1" label="Losetas"></v-checkbox> 
                <v-checkbox v-model="o.c128" :value-false="0" :value="1" label="Cemento/ladrillo"></v-checkbox> 
                <v-checkbox v-model="o.c129" :value-false="0" :value="1" label="Tierra"></v-checkbox> 
                <v-checkbox v-model="o.c130" :value-false="0" :value="1" label="Otros"></v-checkbox> 
                <label>Material de las paredes</label> 
                <v-checkbox v-model="o.c132" :value-false="0" :value="1" label="Madera, estera"></v-checkbox> 
                <v-checkbox v-model="o.c133" :value-false="0" :value="1" label="Adobe o tapia"></v-checkbox> 
                <v-checkbox v-model="o.c134" :value-false="0" :value="1" label="Cemento/ladrillo"></v-checkbox> 
                <v-checkbox v-model="o.c135" :value-false="0" :value="1" label="Quincha (ca&ntilde;a de barro), piedra con barro"></v-checkbox> 
                <v-checkbox v-model="o.c136" :value-false="0" :value="1" label="Otros"></v-checkbox> 
                <label>Material de techo</label> 
                <v-checkbox v-model="o.c138" :value-false="0" :value="1" label="Calamina"></v-checkbox> 
                <v-checkbox v-model="o.c139" :value-false="0" :value="1" label="Madera, tejas"></v-checkbox> 
                <v-checkbox v-model="o.c140" :value-false="0" :value="1" label="Noble"></v-checkbox> 
                <v-checkbox v-model="o.c141" :value-false="0" :value="1" label="Eternit o fibra de cemento"></v-checkbox> 
                <v-checkbox v-model="o.c142" :value-false="0" :value="1" label="Paja, hojas"></v-checkbox> 
                <v-checkbox v-model="o.c143" :value-false="0" :value="1" label="Ca&ntilde;a o esteras con barro"></v-checkbox> 
                <label>Eliminación de excretas</label> 
                <v-checkbox v-model="o.c145" :value-false="0" :value="1" label="Aire libre"></v-checkbox> 
                <v-checkbox v-model="o.c146" :value-false="0" :value="1" label="Acequia, canal"></v-checkbox> 
                <v-checkbox v-model="o.c147" :value-false="0" :value="1" label="Red pública (*)"></v-checkbox> 
                <v-checkbox v-model="o.c148" :value-false="0" :value="1" label="Letrina"></v-checkbox> 
                <v-checkbox v-model="o.c149" :value-false="0" :value="1" label="Pozo séptico"></v-checkbox> 
                <v-checkbox v-model="o.c150" :value-false="0" :value="1" label="Otros"></v-checkbox> 
                <label>Disposición de basura</label> 
                <v-checkbox v-model="o.c152" :value-false="0" :value="1" label="Carro recolector (Frecuencia)"></v-checkbox> 
                <v-checkbox v-model="o.c153" :value-false="0" :value="1" label="A campo abierto"></v-checkbox> 
                <v-checkbox v-model="o.c154" :value-false="0" :value="1" label="Al rio"></v-checkbox> 
                <v-checkbox v-model="o.c155" :value-false="0" :value="1" label="Se entierra, quema"></v-checkbox> 
                <v-checkbox v-model="o.c156" :value-false="0" :value="1" label="En un pozo"></v-checkbox> 
                <v-checkbox v-model="o.c157" :value-false="0" :value="1" label="Otros"></v-checkbox> 
                <label>Servicios en el domicilio</label> 
                <v-checkbox v-model="o.c159" :value-false="0" :value="1" label="Telefono"></v-checkbox> 
                <v-checkbox v-model="o.c160" :value-false="0" :value="1" label="Internet"></v-checkbox> 
                <v-checkbox v-model="o.c161" :value-false="0" :value="1" label="Cable"></v-checkbox> 
                <v-checkbox v-model="o.c162" :value-false="0" :value="1" label="Electricidad"></v-checkbox> 
                <v-checkbox v-model="o.c163" :value-false="0" :value="1" label="Agua, desague"></v-checkbox> 
                <v-checkbox v-model="o.c164" :value-false="0" :value="1" label="Otros"></v-checkbox> 
                <label>Combustible para cocinar</label> 
                <v-checkbox v-model="o.c166" :value-false="0" :value="1" label="Le&ntilde;a"></v-checkbox> 
                <v-checkbox v-model="o.c167" :value-false="0" :value="1" label="Carbón"></v-checkbox> 
                <v-checkbox v-model="o.c168" :value-false="0" :value="1" label="Bosta"></v-checkbox> 
                <v-checkbox v-model="o.c169" :value-false="0" :value="1" label="Gas, electricidad"></v-checkbox> 
                <label>Conservación de alimentos</label> 
                <v-checkbox v-model="o.c171" :value-false="0" :value="1" label="A temperatura ambiente"></v-checkbox> 
                <v-checkbox v-model="o.c172" :value-false="0" :value="1" label="Refrigerio"></v-checkbox> 
                <v-checkbox v-model="o.c173" :value-false="0" :value="1" label="En recipiente sin tapa"></v-checkbox> 
                <v-checkbox v-model="o.c174" :value-false="0" :value="1" label="En recipiente con tapa"></v-checkbox> 
                <label>Nº de personas x habitacion</label> 
                <v-group v-model="o.c175" required="required"> 
                    <v-radio value="176" label="De 1 a 3 miembros"></v-radio> 
                    <v-radio value="177" label="De 4 miembros a mas"></v-radio> 
                </v-group> 
                <label>Disponibilidad de Transporte Propio</label> 
                <v-group v-model="o.c178" required="required"> 
                    <v-radio value="179" label="Automovil"></v-radio> 
                    <v-radio value="180" label="Bicicleta"></v-radio> 
                    <v-radio value="181" label="Motocicleta"></v-radio> 
                    <v-radio value="182" label="Otro"></v-radio> 
                </v-group> 
                <label>Agua de consumo</label> 
                <v-group v-model="o.c183" required="required"> 
                    <v-radio value="184" label="Agua con tratamiento"></v-radio> 
                    <v-radio value="185" label="Agua sin tratamiento"></v-radio> 
                </v-group> 
                <label>Abastecimiento de agua</label> 
                <v-checkbox v-model="o.c187" :value-false="0" :value="1" label="Red pública dentro de la vivienda"></v-checkbox> 
                <v-checkbox v-model="o.c188" :value-false="0" :value="1" label="Red pública fuera de la vivienda"></v-checkbox> 
                <v-checkbox v-model="o.c189" :value-false="0" :value="1" label="Pozo, cisterna"></v-checkbox> 
                <v-checkbox v-model="o.c190" :value-false="0" :value="1" label="Rio, acequia"></v-checkbox> 
                <v-checkbox v-model="o.c191" :value-false="0" :value="1" label="Familia cuenta con mochila de emergencia"></v-checkbox> 
                <v-checkbox v-model="o.c192" :value-false="0" :value="1" label="Familia cuenta con botiquín de emergencia"></v-checkbox> 
                <v-checkbox v-model="o.c193" :value-false="0" :value="1" label="Su vivienda cuenta con espacios destinados al almacenamiento, conservación, manipulación y consumo de alimentos?"></v-checkbox> 
                <v-checkbox v-model="o.c194" :value-false="0" :value="1" label="Su cocina cuenta con sistema de eliminación del humo de cocina o ventilación?"></v-checkbox> 
                <label>TENENCIA DE ANIMALES</label> 
                <v-checkbox v-model="o.c196" :value-false="0" :value="1" label="Mascota: perro, gato"></v-checkbox> 
                <v-checkbox v-model="o.c197" v-if="o.c196" :value-false="0" :value="1" label="Vacunas"></v-checkbox> 
                <v-checkbox v-model="o.c198" :value-false="0" :value="1" label="De importancia económica: cabras, cameros, cerdos, vaca, aves de corral"></v-checkbox> 
                <v-checkbox v-model="o.c199" v-if="o.c198" :value-false="0" :value="1" label="Vacunas"></v-checkbox> 
                <v-checkbox v-model="o.c200" :value-false="0" :value="1" label="Convive con los animales dentro de la vivienda"></v-checkbox> 
            </v-fieldset> 
            <v-fieldset legend="Riesgos del Entorno" closable="true"> 
                <v-checkbox v-model="o.c202" :value-false="0" :value="1" label="Lluvias, inundaciones"></v-checkbox> 
                <v-checkbox v-model="o.c203" :value-false="0" :value="1" label="Basural junto a la vivienda"></v-checkbox> 
                <v-checkbox v-model="o.c204" :value-false="0" :value="1" label="Inservibles junto a la vivienda"></v-checkbox> 
                <v-checkbox v-model="o.c205" :value-false="0" :value="1" label="Humos o vapores de productos quimicos de fabrícas, industrias o mineria"></v-checkbox> 
                <v-checkbox v-model="o.c206" :value-false="0" :value="1" label="Riesgo de derrumbes, huaycos"></v-checkbox> 
                <v-checkbox v-model="o.c207" :value-false="0" :value="1" label="Pandillaje, delincuencia"></v-checkbox> 
                <v-checkbox v-model="o.c208" :value-false="0" :value="1" label="Alcoholismo, drogadicción"></v-checkbox> 
                <v-checkbox v-model="o.c209" :value-false="0" :value="1" label="Sin alumbrado público"></v-checkbox> 
                <v-checkbox v-model="o.c210" :value-false="0" :value="1" label="Pistas no asfaltadas"></v-checkbox> 
                <v-checkbox v-model="o.c211" :value-false="0" :value="1" label="Vectores (mosquitos, zancudo, roedores, etc)"></v-checkbox> 
            </v-fieldset> 
        </div> 
        <center style="margin-bottom:10px;"> 
            <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
            <v-button style="margin-left:10px;" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" 
                @click.prevent="$router.replace('/admin/desarrollo-social/sivico/'+(o.tmpId?(-o.tmpId):o.id))"></v-button>
        </center> 
    </v-form>
</template>
<script>
	import { Capacitor } from '@capacitor/core';
    import { Camera, CameraResultType } from '@capacitor/camera';
    import { Filesystem,Directory} from '@capacitor/filesystem';
    import { Geolocation } from '@capacitor/geolocation';
        import 'ol/ol.css';
        var axios=window.axios;
        var _=window._;
        export default _.ui({
            props: ['id'],
            data() {
                return {
                    count:0,
                    red: [],
                    areaResidencia: [
                        {id: 'U', name: 'URBANO'},
                        {id: 'M', name: 'URBANO MARGINAL'},
                        {id: 'R', name: 'RURAL'}
                    ],
                    resultadoVisita: [
                        'EJECUTADO',
                        'RECHAZADO',
                        'ABANDONADO'
                    ],trayLocation:null,
                    o: {
                        id:null,
                        synchronized:null,
                        lat:null,
                        tmpId:null,
                        lon:null,
                        red:'02',
                        microred:null,
                        ext:{src:null},agreements:[],peoples:[]}
                }
            },
            created(){
                var me=this;
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
            mounted() {
                var me=this;
                me.changeRoute();
            },
            methods: {
                process(o){
                    if(!this.trayLocation){
                        this.MsgBox('Debe tratar de obtener la geolocalización.');
                        return false;
                    }
                    return o;
                },
                errorImg(){},
                changeImage(result) {
                    var me=this,o=me.o;
                    o.tempFile=result.tempFile;
                    if(o.id>0){
                        result.id=o.id;
                        axios.post('/api/desarrollo-social/sivico/attach-image',result).then(()=>{
                            delete o.ext.pending;
                            delete o.tempFile;
                            if(o.tmpId){
                                var objectStore =window._.db.transaction(["pool"], "readwrite").objectStore("pool");
                                var item = objectStore.get(o.tmpId);
                                item.onsuccess = function() {objectStore.put(o);};
                            }
                            me.app.toast('Imagen adjuntada!');
                        });
                    }
                },
                syncImage(){
                    var me=this;
                    fetch(me.o.ext.src).then(r=>r.blob()).then(function(b){
                        me.$refs.uploader.submitFile(b,'name.jpg');
                    });
                },
                uploaderClick(uploader){
                    var me = this,o=me.o;
                    me.count++;
                    Camera.getPhoto({
                        quality: 100,
                        resultType: CameraResultType.Uri
                    }).then(function (result) {
                        me.count--;
                        if (me.count == 0) {
                            var fs = Filesystem;
                            if (result.path){
                                o.ext.path=result.path;
                                fs.readFile({
                                    path: result.path
                                }).then(function (r) {
                                    var filename = new Date().getTime() + '.jpeg';
                                    //Aqui se guarda una copia del archivo
                                    fs.writeFile({
                                        data: r.data,
                                        path: filename,
                                        directory:Directory.Data
                                    }).then(function() {
                                        fs.getUri({
                                            path:filename,
                                            directory:Directory.Data
                                        }).then(function(s){
                                            //incluso si se envia la imagen es mejor tener una referencia local
                                            me.o.ext.src=Capacitor.convertFileSrc(s.uri);
                                            me.o.ext.pending=true;
                                            if(me.app.connected){
                                                fetch(me.o.ext.src).then(r=>r.blob()).then(function(b) {
                                                    uploader.submitFile(b,'name.'+result.format);
                                                });
                                            }
                                        });
                                    });
                                });
                            }else{
                                fetch(result.webPath).then(r=>r.blob()).then(function(b) {
                                    o.ext.src=result.webPath;
                                    o.ext.pending=1;
                                    if(me.app.connected)
                                        uploader.submitFile(b,'name.'+result.format);
                                });

                            }
                        }
                    });
                },
                async printCurrentPosition(){
                    this.trayLocation=1;
                    const coordinates = await Geolocation.getCurrentPosition();
                    var c=coordinates.coords;
                    this.o.lat=c.latitude;
                    this.o.lon=c.longitude;
                },
                async changeRoute() {
                    var me = this, id = me.id;
                    me.trayLocation=0;
                    me.$refs.red.load();


                    


                    
                    if(id<0){
                        console.log(me.getStoredList('pool'));
                        me.getStoredList('pool').then((pool)=>{
                            pool.forEach(e =>{
                                if(e.tmpId==Math.abs(me.id)){
                                    me.o=e;
                                    me.$refs.province.load({code:me.o.region||'02'});
                                    me.trayLocation=e.lat&&e.lon;
                                }
                            });
                        });
                    }else if (Number(id)){
                        axios.get('/api/desarrollo-social/sivico/' + id).then(function (response) {
                            var o = response.data;
                            if(o.red)o.red=me.pad(o.red,2);
                            
                            if(o.province){
                                o.province=me.pad(o.province,4);
                                o.region=o.province.substring(0, 2);
                            }
                            if(o.district)o.district=me.pad(o.district,6);
                            o.ext.src=null;
                            o.ext.tempFile=null;
                            me.trayLocation=1;
                            me.o=o;
                            me.$refs.province.load({code:me.o.region});
                        });
                    }else{
                        try {
                            var s = localStorage.getItem("setting");
                            if (s) {
                                s = JSON.parse(s);
                                var o = this.o;
                                o.red = s.red;
                                o.microred = s.microred;
                                o.establishment = s.establishment;
                                if(s.region){
                                    o.region = s.region.code;
                                }
                                if(s.province)o.province = s.province.code;
                                if(s.district)o.district = s.district.code;
                                
                                /*o.town = s.town;*/
                            }
                        } catch (e) {
                            console.log(e);
                        }
                        me.$refs.province.load({code:me.o.region});
                    }
                },
                close(r){
                    var me=this;
                    if(r.success===true){
                        me.o.id=r.data.id;
                        me.o.tmpId=r.data.tmpId;
                        if(r.data.uploaded){
                            delete o.tempFile;
                            delete o.ext.pending;
                        }
                    }
                    var o=me.o;
                    me.$router.replace('/admin/desarrollo-social/sivico/'+(o.tmpId?(-o.tmpId):o.id))
                },
                async getCurrentPosition() {
                    var me = this;
                    //const {Geolocation} = Plugins;
                    const c = await Geolocation.getCurrentPosition();
                    me.o.lat = c.coords.latitude;
                    me.o.lon = c.coords.longitude;
                },
                getCoordinates() {
                    var me = this;
                    if(me.getCurrentPosition){me.getCurrentPosition()}else
                    _.getLocation().then(function (c) {
                        me.o.lat = c.coords.latitude;
                        me.o.lon = c.coords.longitude;
                    });
                }
            }
        })
</script>