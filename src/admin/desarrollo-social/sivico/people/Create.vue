<template>
    <v-form action="/api/desarrollo-social/sivico/people" 
        :class="o.id<0||(o.tmpId&&!o.synchronized)?'yellow':(o.tmpId?'green':'')"
        store="people" :header="(o.id?'Editar':'Crear')+' Persona'"> 
        <div class="v-form"> 
        <label>ID:</label> 
        <div>{{pad(o.id?o.id:0,4)}}</div>  
        <label>MCI:</label> 
        <div>{{pad(o.masterId?o.masterId:0,4)}}</div>
        <label>DNI:</label> 
        <input type="tel" v-model="o.code" required="true" class="numeric center" style="text-align:center !important;" maxlength="12" pattern="[0-9]*" /> <label>Nombres:</label> 
        <input type="text" required="true" v-model="o.names" title="Nombres" /> <label>Apellidos:</label> 
        <input type="text" required="true" v-model="o.surnames" title="Apellidos" /> <label>Sexo:</label> <v-radio-group required="true" v-model="o.sex"> 
        <v-radio label="Masculino" value="M"></v-radio> 
        <v-radio label="Femenino" value="F"></v-radio> 
        </v-radio-group> <label>Fecha Nacimiento:</label> <v-calendar required="true" v-model="o.birthdate"></v-calendar> 
        <div id="dateDiff" v-if="dateDiff" style="width:unset">
        {{dateDiff}}
        </div>
        <label>Parentesco:</label>
        <v-select v-model="o.relationship" :disabled="!o.sex" :autoload="false" :required="true"> 
        <option>Select One...</option> 
        <option v-for="(item,i) in relationshipFiltered" :value="item.id" :key="i">{{item.name}}</option> 
        </v-select> <label>Estado Civil:</label>
        <v-select v-model="o.civilStatus" :autoload="false" :required="true"> 
        <option>Select One...</option> 
        <option v-for="(item,i) in civilStatus" :value="item.id" :key="i">{{item.name}}</option> 
        </v-select> <label>Grado de Instrucción:</label> <v-select v-model="o.degreeInstruction" :autoload="false" :required="true"> 
        <option>Select One...</option> 
        <option v-for="(item,i) in degreeInstruction" :value="item.id" :key="i">{{item.name}}</option> 
        </v-select> 
        <label>Ocupación:</label> 
        <input type="text" required="true" v-model="o.occupation" title="Ocupación" /> <label>Condición de Ocupación:</label> <v-select v-model="o.occupationCondition" :autoload="false" :required="true"> 
        <option>Select One...</option> 
        <option v-for="(item,i) in occupationCondition" :value="item.id" :key="i">{{item.name}}</option> 
        </v-select> <label>Seguros de Salud:</label> <v-select v-model="o.healthInsurance" :autoload="false" :required="true"> 
        <option>Select One...</option> 
        <option v-for="(item,i) in healthInsurance" :value="item" :key="i">{{item}}</option> 
        </v-select> 
        <v-fieldset v-if="currentLifeStage" legend="RIESGOS A IDENTIFICAR DE ACUERDO A LA ETAPA DE VIDA Y COMO FAMILIA" class="v-form"> 
            <label title="???C26???">ETAPA DE VIDA: {{currentLifeStage.name}}</label> 
            <v-checkbox v-model="o.c27" v-if="vif[0][0]" :value-false="0" :value="1" label="Niña/o nacido prematuro"></v-checkbox> 
            <v-checkbox v-model="o.c28" v-if="vif[1][0]" :value-false="0" :value="1" label="Recien nacido/a (hasta los 28 días)"></v-checkbox> 
            <v-checkbox v-model="o.c29" v-if="vif[2][0]" :value-false="0" :value="1" label="Sin identificación de problemas visuales y auditivos"></v-checkbox> 
            <v-checkbox v-model="o.c30" v-if="vif[3][0]" :value-false="0" :value="1" label="Recien nacida/o sin documento nacional de identidad"></v-checkbox> 
            <v-checkbox v-model="o.c31" v-if="vif[4][0]" :value-false="0" :value="1" label="Niña/o con vacunas incompletas"></v-checkbox> 
            <v-checkbox v-model="o.c32" v-if="vif[5][0]" :value-false="0" :value="1" label="Niña/o menor de 6 meses sin lactancia materna exclusiva"></v-checkbox> 
            <v-checkbox v-model="o.c33" v-if="vif[6][0]" :value-false="0" :value="1" label="Sin evaluación de la cavidad bucal"></v-checkbox> 
            <v-checkbox v-model="o.c34" v-if="vif[7][0]" :value-false="0" :value="1" label="Sin sesiones de estimulación temprana"></v-checkbox> 
            <v-checkbox v-model="o.c35" v-if="vif[8][0]" :value-false="0" :value="1" label="Niña/o sin exámenes: Parasitos, RPR, Hb, GyF, TSH"></v-checkbox> 
            <v-checkbox v-model="o.c36" v-if="vif[9][0]" :value-false="0" :value="1" label="Niña/o menor hasta 36 meses sin suplemento de multinutrientes y hierro."></v-checkbox> 
            <v-checkbox v-model="o.c37" v-if="vif[10][0]" :value-false="0" :value="1" label="Niña/o sin control de crecimiento y desarrollo"></v-checkbox> 
            <v-checkbox v-model="o.c38" v-if="vif[11][0]" :value-false="0" :value="1" label="Deserción escolar/bajo rendimiento escolar"></v-checkbox> 
            <v-checkbox v-model="o.c39" v-if="vif[12][0]" :value-false="0" :value="1" label="Recién nacida/o de parto domiciliario"></v-checkbox> 
            <v-checkbox v-model="o.c40" v-if="vif[13][0]" :value-false="0" :value="1" label="Sin evaluación nutricional"></v-checkbox> 
            <v-checkbox v-model="o.c41" v-if="vif[14][0]" :value-false="0" :value="1" label="Sin evaluacion de riesgo cardivascular"></v-checkbox> 
            <v-checkbox v-model="o.c42" v-if="vif[15][0]" :value-false="0" :value="1" label="Sin evaluación del desarrollo psicosocial"></v-checkbox> 
            <v-checkbox v-model="o.c43" v-if="vif[16][0]" :value-false="0" :value="1" label="Sin evaluación de la agudeza visual y auditiva"></v-checkbox> 
            <v-checkbox v-model="o.c44" v-if="vif[17][0]" :value-false="0" :value="1" label="Sin evaluacion del desarrollo sexual"></v-checkbox> 
            <v-checkbox v-model="o.c45" v-if="vif[18][0]" :value-false="0" :value="1" label="Sin evaluación fisica postural"></v-checkbox> 
            <v-checkbox v-model="o.c46" v-if="vif[19][0]" :value-false="0" :value="1" label="Adolescente con vacunas incompletas"></v-checkbox> 
            <v-checkbox v-model="o.c47" v-if="vif[20][0]" :value-false="0" :value="1" label="Participación en pandillas/delincuencia"></v-checkbox> 
            <v-checkbox v-model="o.c48" v-if="vif[21][0]" :value-false="0" :value="1" label="Problemas de conducta y/o alimentación"></v-checkbox> 
            <v-checkbox v-model="o.c49" v-if="vif[22][0]" :value-false="0" :value="1" label="Conducta sexual de riesgo"></v-checkbox> 
            <v-checkbox v-model="o.c50" v-if="vif[23][0]" :value-false="0" :value="1" label="Joven con vacunas incompletas"></v-checkbox> 
            <v-checkbox v-model="o.c51" v-if="vif[24][0]" :value-false="0" :value="1" label="Sin identificación de factores de riesgo de enfermedades no transmitibles"></v-checkbox> 
            <v-checkbox v-model="o.c52" v-if="vif[25][0]" :value-false="0" :value="1" label="Sin identificación de factores de riesgo de enfermedades transmitibles"></v-checkbox> 
            <v-checkbox v-model="o.c53" v-if="vif[26][0]" :value-false="0" :value="1" label="Sin identificacion de problemas renales"></v-checkbox> 
            <v-checkbox v-model="o.c54" v-if="vif[27][0]" :value-false="0" :value="1" label="Sin evaluación de riesgo cardiovascular"></v-checkbox> 
            <v-checkbox v-model="o.c55" v-if="vif[28][0]" :value-false="0" :value="1" label="Mujer sexualmente activa sin papanicolau anual."></v-checkbox> 
            <v-checkbox v-model="o.c56" v-if="vif[29][0]" :value-false="0" :value="1" label="Mujer/Hombre en edad reproductiva sin planificacion familiar"></v-checkbox> 
            <v-checkbox v-model="o.c57" v-if="vif[30][0]" :value-false="0" :value="1" label="Vacunas incompletas"></v-checkbox> 
            <v-checkbox v-model="o.c58" v-if="vif[31][0]" :value-false="0" :value="1" label="Sin identificación de factores de riesgo de enfermedades ocupacionales"></v-checkbox> 
            <v-checkbox v-model="o.c59" v-if="vif[32][0]" :value-false="0" :value="1" label="Sin examen de coresterol"></v-checkbox> 
            <v-checkbox v-model="o.c60" v-if="vif[33][0]" :value-false="0" :value="1" label="Sin examen de coresterol"></v-checkbox> 
            <v-checkbox v-model="o.c61" v-if="vif[34][0]" :value-false="0" :value="1" label="Sin mamografía bianual"></v-checkbox> 
            <v-checkbox v-model="o.c62" v-if="vif[35][0]" :value-false="0" :value="1" label="Sin evaluación de próstata"></v-checkbox> 
            <v-checkbox v-model="o.c63" v-if="vif[36][0]" :value-false="0" :value="1" label="Sin evaluación mental"></v-checkbox> 
            <v-checkbox v-model="o.c64" v-if="vif[37][0]" :value-false="0" :value="1" label="Sin evaluacion funcional"></v-checkbox> 
            <v-checkbox v-model="o.c65" v-if="vif[38][0]" :value-false="0" :value="1" label="Déficit visual y/o auditivo"></v-checkbox> 
            <v-checkbox v-model="o.c66" v-if="vif[39][0]" :value-false="0" :value="1" label="Mujer/Hombre sin prueba de sangre oculta en heces"></v-checkbox> 
            <v-fieldset legend="DISCAPACIDAD"> 
            <label>En sus actividades diarias tiene limitaciones de forma permanente para?</label> 
            <v-checkbox v-model="o.c69" :value-false="0" :value="1" label="Moverse o caminar para usar brazos o piernas"></v-checkbox> 
            <v-checkbox v-model="o.c70" :value-false="0" :value="1" label="Entender o aprender"></v-checkbox> 
            <v-checkbox v-model="o.c71" :value-false="0" :value="1" label="Ver, aun usando anteojos"></v-checkbox> 
            <v-checkbox v-model="o.c72" :value-false="0" :value="1" label="Oir, aun usando audifonos"></v-checkbox> 
            <v-checkbox v-model="o.c73" :value-false="0" :value="1" label="Hablar o comunicarse, aun usando el lenguaje de señas u otros"></v-checkbox> 
            <v-checkbox v-model="o.c74" :value-false="0" :value="1" label="Relacionarse con los demás x sus pensamientos, sentimientos o conductas"></v-checkbox> 
            <label>¿Cuál es el origen de esta(s) limitacion(es)?</label> 
            <v-radio-group v-model="o.c75" required="required"> 
            <v-radio value="76" label="Enfermedad laboral"></v-radio> 
            <v-radio value="77" label="Genetico / congínito / de nacimiento"></v-radio> 
            <v-radio value="78" label="Enfermedad crónico"></v-radio> 
            <v-radio value="79" label="Accidente laboral"></v-radio> 
            <v-radio value="80" label="Accidente de transito"></v-radio> 
            <v-radio value="81" label="Violencia familiar o politica"></v-radio> 
            <v-radio value="82" label="Accidente común en el o fuera del hogar"></v-radio> 
            </v-radio-group> 
            </v-fieldset> 
            <v-fieldset legend="GESTANTE" v-if="o.sex=='F'"> 
                <v-checkbox v-model="o.c84" :value-false="0" :value="1" label="Sin plan de parto"></v-checkbox> 
                <v-checkbox v-model="o.c85" :value-false="0" :value="1" label="Vacunas incompletas"></v-checkbox> 
                <v-checkbox v-model="o.c86" :value-false="0" :value="1" label="Sin psicoprofilaxis"></v-checkbox> 
                <v-checkbox v-model="o.c87" :value-false="0" :value="1" label="Sin vigilancia nutricional"></v-checkbox> 
                <v-checkbox v-model="o.c88" :value-false="0" :value="1" label="Sin / Incompleto CPN"></v-checkbox> 
                <v-checkbox v-model="o.c89" :value-false="0" :value="1" label="Sin evaluacion de la cavidad bucal"></v-checkbox> 
                <v-checkbox v-model="o.c90" :value-false="0" :value="1" label="Sin administración de suplemento (hierro, ácido fólico)"></v-checkbox> 
            </v-fieldset> 
            <v-fieldset legend="PUERPERA" v-if="o.sex=='F'"> 
                <v-checkbox v-model="o.c92" :value-false="0" :value="1" label="Sangrado vaginal abundante"></v-checkbox> 
                <v-checkbox v-model="o.c93" :value-false="0" :value="1" label="Sangrado vaginal con mal olor"></v-checkbox> 
                <v-checkbox v-model="o.c94" :value-false="0" :value="1" label="Fiebre, escalofrios"></v-checkbox> 
                <v-checkbox v-model="o.c95" :value-false="0" :value="1" label="Molestias para orinar"></v-checkbox> 
                <v-checkbox v-model="o.c96" :value-false="0" :value="1" label="Dolor y calor en mamas"></v-checkbox> 
            </v-fieldset> 
            <v-fieldset legend="OTROS RIESGOS"> 
                <v-checkbox v-model="o.c98" :value-false="0" :value="1" label="Riesgos de exposición solar"></v-checkbox> 
                <v-checkbox v-model="o.c99" :value-false="0" :value="1" label="Riesgos en el trabajo"></v-checkbox> 
                <v-checkbox v-model="o.c100" :value-false="0" :value="1" label="Riesgos de consumo de tabaco"></v-checkbox> 
                <v-checkbox v-model="o.c101" :value-false="0" :value="1" label="Tos y flema más de 14 días"></v-checkbox> 
                <v-checkbox v-model="o.c102" :value-false="0" :value="1" label="Alergía a medicamentos"></v-checkbox> 
            </v-fieldset> 
            <v-fieldset legend="FAMILIA"> 
                <v-checkbox v-model="o.c104" :value-false="0" :value="1" label="¿Ud. Y su pareja han recibido información sobre como educar a sus hijos?"></v-checkbox> 
                <v-checkbox v-model="o.c105" :value-false="0" :value="1" label="¿Su hijo/a le hace preguntas o pide ayuda cuando lo necesita?"></v-checkbox> 
                <v-checkbox v-model="o.c106" :value-false="0" :value="1" label="En los ultimos 12 meses ¿Ud. o algún miembro de su familia comió menos o dejo de comer porque no habia suficiente dinero para la comida?"></v-checkbox> 
                <v-checkbox v-model="o.c107" :value-false="0" :value="1" label="¿Ud. Y su pareja han recibido consejeria de suplementos con micronutrientes y hierro?"></v-checkbox> 
                <v-checkbox v-model="o.c108" :value-false="0" :value="1" label="¿Su hijo/a tiene metas, objetivos claros y sabe cómo lograrlos?"></v-checkbox> 
                <v-checkbox v-model="o.c109" :value-false="0" :value="1" label="Los intereses y necesidades de cada miembro son respetados por la familia"></v-checkbox> 
                <v-checkbox v-model="o.c110" :value-false="0" :value="1" label="En su familia, ¿Se promueve la transmisión de experiencias y conocimientos en forma clara y directa?"></v-checkbox> 
                <v-checkbox v-model="o.c111" :value-false="0" :value="1" label="En su familia, ¿Se hace difícil demostrar cariño los uno a los otros?"></v-checkbox> 
                <v-checkbox v-model="o.c112" :value-false="0" :value="1" label="¿En su familia se promueve la unión entre sus miembros?"></v-checkbox> 
                <v-checkbox v-model="o.c113" :value-false="0" :value="1" label="Ante situaciones dificiles su familia busca ayuda en otras personas o instituciones."></v-checkbox> 
                <v-checkbox v-model="o.c114" :value-false="0" :value="1" label="¿Las costumbres, relaciones, normas pueden modificarse ante determinadas situaciones?"></v-checkbox> 
                <v-checkbox v-model="o.c115" :value-false="0" :value="1" label="¿Se acostumbra en la familia que los varones ayuden en las labores de la casa?"></v-checkbox> 
                <v-checkbox v-model="o.c116" :value-false="0" :value="1" label="Alguna vez a ud. O algún miembros de su familia le han hecho sentir como quien no encaja por causa de su vestido, lengua, etnicidad o cultura?"></v-checkbox> 
                <v-checkbox v-model="o.c117" :value-false="0" :value="1" label="¿En su familia se promueve la disciplina y el cumplimiento de las tareas asignadas?"></v-checkbox> 
                <v-checkbox v-model="o.c118" :value-false="0" :value="1" label="¿Su familia cuenta con espacios en la vivienda que garanticen la privacidad y la intimidad en las expresiones sexuales?"></v-checkbox> 
                <v-checkbox v-model="o.c119" :value-false="0" :value="1" label="¿En su familia se resuelven los conflictos con participación de sus miembros?"></v-checkbox> 
                <v-checkbox v-model="o.c120" :value-false="0" :value="1" label="¿Algun miembro de su familia ha intentado suicidarse?"></v-checkbox> 
                <v-checkbox v-model="o.c121" :value-false="0" :value="1" label="En la familia, el padre o la madre hablan libremente de la sexualidad con los hijos(as)?"></v-checkbox> 
            </v-fieldset  > 
            <label>OBSERVACIONES</label> 
            <v-textarea v-model="o.c122"></v-textarea> 
        </v-fieldset> 
        </div> 
        <center> 
            <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button>
            <v-button value="Cancelar" icon="fa-ban" v-on:click.prevent="close"></v-button> 
        </center> 
    </v-form>
</template>
<script>
	var _=window._;
    var Vue=window.Vue;
    var axios=window.axios;
    export default _.ui({
        props: ['id','action'],
        data() {
            return {
                relationship:[
                    {id:'P',name:'PADRE',sex:'M'},
                    {id:'M',name:'MADRE',sex:'F'},
                    {id:'H',name:'HIJA/O',sex:'X'},
                    {id:'HA',name:'HIJA/O ADOPTIVA/O',sex:'X'},
                    {id:'A',name:'ABUELA/O',sex:'X'},
                    {id:'T',name:'TIA/O',sex:'X'},
                    {id:'N',name:'NIETA/O',sex:'X'},
                    {id:'PA',name:'PADASTRO',sex:'M'},
                    {id:'MA',name:'MADASTRA',sex:'F'},
                    {id:'S',name:'SOBRINA/O',sex:'X'},
                    {id:'PR',name:'PRIMA/O',sex:'X'},
                    {id:'BA',name:'BIS-ABUELA/O',sex:'X'},
                    {id:'AMG',name:'AMIGA/O',sex:'X'},
                    {id:'HM',name:'HERMANA/O',sex:'X'},
                    {id:'Y',name:'YERNO',sex:'M'},
                    {id:'N',name:'NUERA',sex:'F'}
                ],
                civilStatus:[
                    {id:'S',name:'SOLTERA/O'},
                    {id:'CO',name:'CONVIVIENTE'},
                    {id:'C',name:'CASADA/O'},
                    {id:'SP',name:'SEPARADA/O'},
                    {id:'D',name:'DIVORCIADA/O'},
                    {id:'V',name:'VIUDA/O'},
                    {id:'O',name:'OTROS'}
                ],
                degreeInstruction:[
                    {id:'SI',name:'SIN INSTRUCCION'},
                    {id:'I',name:'INICIAL'},
                    {id:'PC',name:'PRIMARIA COMPLETA'},
                    {id:'PI',name:'PRIMARIA INCOMPLETA'},
                    {id:'SC',name:'SECUNDARIA COMPLETA'},
                    {id:'SI',name:'SECUNDARIA INCOMPLETO'},
                    {id:'SUC',name:'SUPERIOR COMPLETO'},
                    {id:'SUI',name:'SUPERIOR INCOMPLETO'}
                ],
                occupationCondition:[
                    {id:'S',name:'TRABAJADOR ESTABLE'},
                    {id:'V',name:'EVENTUAL'},
                    {id:'SO',name:'SIN OCUPACION'},
                    {id:'J',name:'JUBILADA/O'},
                    {id:'E',name:'ESTUDIANTE'}
                ],
                lifeStage:[
                    {id:1,name:'NI�O',min:0,max:11},
                    {id:2,name:'ADOLESCENTE',min:12,max:17},
                    {id:3,name:'JOVEN',min:18,max:29},
                    {id:4,name:'ADULTO',min:30,max:59},
                    {id:5,name:'ADULTO MAYOR',min:60},
                ],
                healthInsurance:[
                    'SIS',
                    'ESSALUD/FFAA/PNP',
                    'PRIVADO',
                    'SIN SEGURO'
                ],
                relation:[
                    [0,27,0,11,'X'],
                    [0,28,0,11,'X'],
                    [0,29,0,11,'X'],
                    [0,30,0,11,'X'],
                    [0,31,0,11,'X'],
                    [0,32,0,11,'X'],
                    [0,33,0,200,'X'],
                    [0,34,0,11,'X'],
                    [0,35,0,11,'X'],
                    [0,36,0,11,'X'],
                    [0,37,0,11,'X'],
                    [0,38,0,17,'X'],
                    [0,39,0,11,'X'],
                    [0,40,0,200,'X'],
                    [0,41,12,17,'X'],
                    [0,42,12,29,'X'],
                    [0,43,12,17,'X'],
                    [0,44,12,17,'X'],
                    [0,45,12,17,'X'],
                    [0,46,12,17,'X'],
                    [0,47,12,29,'X'],
                    [0,48,12,17,'X'],
                    [0,49,12,59,'X'],
                    [0,50,18,29,'X'],
                    [0,51,18,200,'X'],
                    [0,52,18,200,'X'],
                    [0,53,18,29,'X'],
                    [0,54,18,29,'X'],
                    [0,55,18,65,'F'],
                    [0,56,18,59,'X'],
                    [0,57,30,200,'X'],
                    [0,58,30,59,'X'],
                    [0,59,35,200,'M'],
                    [0,60,45,200,'F'],
                    [0,61,50,69,'F'],
                    [0,62,50,200,'M'],
                    [0,63,60,200,'X'],
                    [0,64,60,200,'X'],
                    [0,65,60,200,'X'],
                    [0,66,60,200,'X']
                ],
                o: {fecha:new Date()}
            }
        },
        computed: {
            relationshipFiltered(){
                var me=this;
                return me.o.sex?me.relationship.filter(function(el) {
                    return (el.sex==me.o.sex||el.sex=='X');
                }):[];
            },
            vif(){
                var d=this.diff,v,r=this.relation;
                for(var i=0;r.length>i;i++){
                    v=r[i];
                    v[0]=0;
                    if(d&&d.ans>=v[2]&&v[3]>=d.ans&&
                            (v[4]==this.o.sex||v[4]=='X'))
                        v[0]=1;
                }
                return r; 
            },
            currentLifeStage(){
                var d=this.diff;
                if(d){
                    var e=0;
                    if(18>d.ans){
                        e=1;
                    }else if(30>d.ans){
                        e=2;
                    }else if(60>d.ans){
                        e=3;
                    }else{
                        e=4;
                    }
                    return this.lifeStage[e];
                }
                return null;
            },
            diff(){
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
            dateDiff(){
                var s = '',d = this.diff;
                if (d) {
                    if (d.ans > 0)
                        s += 'ANIOS=' + d.ans;
                    if (d.meses > 0)
                        s += ' MESES=' + d.meses;
                    if (d.dias > 0)
                        s += ' DIAS=' + d.dias;
                }
                return s;
            }
        },
        methods:{
            changeRoute() {
                var me = this, id = me.id, action = me.action;
                if (Number(id)){
                    if (action == 'add') {
                        var o = {masterId: id, ext: {}};
                        me.o = o;
                    } else if(id<0){
                        var item=window._.db.transaction(["people"], "readwrite").objectStore("people").get(-id);
						item.onsuccess = function() {
                            if(item.result){
								me.o=item.result;
                            }
                        };
                    }else
                        axios.get('/api/desarrollo-social/sivico/people/' + id).then(function (response) {
                            me.o = response.data;
                        });
                }
            },
            process(o) {
                var user = this.user;
                if (user)
                    o.user = user.id;
                return o;
            },
            close(r){
                var me=this;
                
                if(r.success===true){
                    me.o.id=r.data.id;
                    me.o.tmpId=r.data.tmpId;
                }
                //alert(12);
                me.$router.back();
            }
        },
        created(){
            var me=this;
            this.$on('sync',(data,o)=>{
                me.getStoredList('pool').then((pools)=>{
                    pools.forEach(e =>{
                        if(o.masterId<0&&e.tmpId==Math.abs(o.masterId)||e.id==o.masterId){
                            e.peoples.forEach((e2,i)=>{
                                if(e2.tmpId==o.tmpId)e.peoples[i]=o;
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
                            delete e.synchronized;
                            e.peoples=data;
                            window._.db.transaction(['pool'], "readwrite").objectStore('pool').put(e);
                        }
                    });
                });
            });
        },
        mounted() {
            this.changeRoute();
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