<template>
    <v-form v-bind:header="(o.id ? 'Editar ' : 'Crear ') + ' Control Anemia'"
        action="/api/desarrollo-social/hemoglobin">
        <div class="v-form"> <label for="dni">DNI / CUI:</label>
            <input type="tel" pattern="[0-9]{8}" class="center" maxlength="9" id="dni" v-model="o.ext.peopleId"
                required="required" />
            <div id="msg"></div>
            <div class="right" style="margin-top:10px">
                <v-button icon="fa-sync" v-on:click="recoverData" id="recover"
                    value="Recuperar Datos"></v-button>
            </div>
            <label>Sexo:</label>
            <v-radio-group required="true" v-model="o.sex">
                <v-radio label="Masculino" value="M"></v-radio>
                <v-radio label="Femenino" value="F"></v-radio>
            </v-radio-group>
            <label for="birthDate">Fecha de Nacimiento:</label>
            <v-calendar v-model="o.birthDate" name="birthDate" required="required"/>
            <div id="dateDiff" v-if="dateDiff" style="width:unset">
                {{ dateDiff }}
            </div> 
            <v-fieldset>
                <small class="form-text text-muted block">Registrar datos del carnet del niño.</small>
                <label>Peso (Kg.):</label>
                <input type="number" v-model="o.weight" required="true" min="0" />
                <label>Altura (Cm):</label>
                <input type="number" v-model="o.height" min="0" required="true" step="1" />
            </v-fieldset>
            <v-fieldset legend="LABORATORIO (Hb OBSERVADA) *">
                <small class="form-text text-muted block">Registrar la HEMOGLOBINA OBSERVADA, ya que el sistema realiza
                    el ajuste autom&aacute;tico. Si se registra la Hemoglobina ajustada ser&aacute; otra vez
                    ajustada.</small>
                <label>Fecha de Resultado Hemoglobina:</label>
                <v-calendar required="required" v-model="o.pk.resultDate"></v-calendar>
                <label>Hemoglobina (gr/dl):</label>
                <input type="number" required="required" v-model="o.hemoglobin" />
            </v-fieldset> <label>N&deg; de controles CRED seg&uacute;n la edad:</label>
            <input type="number" v-model="o.controls" min="0" /> <v-fieldset legend="DESDE LA CONSULTA ANTERIOR">
                <label>Numero de Micronutrientes (SF):</label>
                <v-number v-model="o.nSachet" decimal="0" max="10" min="0"></v-number>
                <label>Numero sesiones demostrativas:</label>
                <v-number v-model="o.nSession" decimal="0" max="10" min="0"></v-number>
                <label>Numero visitas domiciliaria:</label>
                <v-number v-model="o.nVisit" decimal="0" max="10" min="0"></v-number>
            </v-fieldset> <v-fieldset legend="DESDE LA CONSULTA ANTERIOR" class="v-form" v-if="false">
                <label>Provincia:</label>
                <v-select v-model="o.province" name="sidProvincia" required="required"
                    v-on:input="$refs.districtSelect.load({ provinceId: parseInt(o.province) });">
                    <option value="">Select One...</option>
                    <v-options url="/api/directory/province/0/0?regionId=2" value-field="code"
                        display-field="name"></v-options>
                </v-select>
                <label>Distrito:</label>
                <v-select v-bind:disabled="!o.province" name="sidDistrito" v-model="o.district" required="required"
                    v-on:input="$refs.establishmentSelect.load({ location: o.sidDistrito + '%' })">
                    <option value="">Select One...</option>
                    <v-options ref="districtSelect" url="/api/directory/district/0/0" value-field="code"
                        display-field="name"></v-options>
                </v-select>
                <label>Localidad:</label>
                <v-select v-bind:disabled="!o.province" name="sidDistrito" v-model="o.district" required="required"
                    v-on:input="$refs.establishmentSelect.load({ location: o.sidDistrito + '%' })">
                    <option value="">Select One...</option>
                    <v-options ref="districtSelect" url="/api/directory/district/0/0" value-field="code"
                        display-field="name"></v-options>
                </v-select>
                <label>Altitud de la Localidad (msnm):</label>
                <input type="number" v-model="o.altitude" />
            </v-fieldset> <v-fieldset legend="Coordenadas">
                <template v-if="o.lat">
                    ({{ o.lat }},{{ o.lon }})
                </template>
                <div class="alert yellow" v-if="!o.lat">
                    No se pudo obtener las coordenadas actuales
                </div>
                <div class="right" style="margin-top:10px">
                    <v-button icon="fa-compass" value="Obtener coordenadas actuales" v-on:click.prevent="getCoordinates"/>
                </div>
            </v-fieldset> <v-fieldset id="media" legend="MULTIMEDIA">
                <div id="gallery">
                    <img v-for="(file, i) in o.ext.files" v-bind:key="i" v-bind:id="file.id" v-bind:src="file.src"
                        v-bind:class="{ synced: file.synced }" v-on:click="sync(file)" />
                </div>
                <div class="right">
                    <div style="overflow:hidden;width:0px;height:0px">
                        <input type="file" id="mypic" accept="image/*" capture="camera" />
                        <video id="player" controls="controls" autoplay="autoplay"></video>
                        <canvas id="snapshot" width="320" height="240"></canvas>
                    </div> <v-button icon="fa-camera" v-on:click.prevent="camera" value="Capturar Imagen"></v-button>
                </div>
            </v-fieldset>
        </div>
        <center> <v-button value="Grabar" icon="fa-save" v-on:click.prevent="save"></v-button> <v-button
                value="Cancelar" icon="fa-ban" v-on:click.prevent="close"></v-button>
        </center>
    </v-form>
</template>
<script>
var { _, axios } = window._;
var MsgBox = _.MsgBox;
/*
function numDayInDates(dateStart, dateEnd) {
    var arrayDateStart = dateStart.split('/');
    var arrayDateEnd = dateEnd.split('/');
    var msegDateStart = Date.UTC(arrayDateStart[2], arrayDateStart[1] - 1, arrayDateStart[0]);
    var msegDateEnd = Date.UTC(arrayDateEnd[2], arrayDateEnd[1] - 1, arrayDateEnd[0]);
    var diff = msegDateEnd - msegDateStart;
    var days = Math.floor(diff / (1000 * 60 * 60 * 24));
    return days;
}
function daysInMonth(month, year) {
    return new Date(year, month, 0).getDate();
}
function sumDaysToDate(numDays, date) {
    var arrayDate = date.split('/');
    var newDate = new Date(arrayDate[2] + '/' + arrayDate[1] + '/' + arrayDate[0]);
    newDate.setDate(newDate.getDate() + parseInt(numDays));
    return newDate.getDate() + '/' + (newDate.getMonth() + 1) + '/' + newDate.getFullYear();
}
*/
/*function daysMonthsYearsInDates(dateStart, dateEnd) {
        var daysTotals = numDayInDates(dateStart, dateEnd);
        var daysCal = 0;
        var cantDays = 0;
        var cantMonths = 0;
        var cantYears = 0;
        while (daysTotals > daysCal) {
            var arrayDateStart = dateStart.split('/');
            var daysOfMonth = daysInMonth(arrayDateStart[1], arrayDateStart[2]);
            daysCal = daysCal + daysOfMonth;
            if (daysTotals >= daysCal) {
                cantMonths++;
                if (cantMonths == 12) {
                    cantYears++;
                    cantMonths = cantMonths - 12;
                }
            } else {
                cantDays = Math.abs(numDayInDates(dateStart, dateEnd));
            }
            dateStart = sumDaysToDate(daysOfMonth, dateStart);
        }
        var msg = {};
        msg.year = cantYears;
        msg.month = cantMonths;
        msg.days = cantDays;
        return msg;
    }
    */
function diferenciafechas(fa, fb) {  //fa y fb dos fechas
    var totdias = fa - fb;
    totdias /= 3600000;
    totdias /= 24;
    totdias = Math.floor(totdias);
    totdias = Math.abs(totdias);

    var ans, meses, dias, m2, m1, d3, d2, d1;
    var f2 = new Date();
    var f1 = new Date();

    if (fa > fb) {
        f2 = fa;
        f1 = fb;
    } else {
        f2 = fb;
        f1 = fa;
    }  //Siempre f2 > f1
    ans = f2.getFullYear() - f1.getFullYear(); // dif de a�os inicial
    m2 = f2.getMonth();
    m1 = f1.getMonth();
    meses = m2 - m1;
    if (0 > meses) {
        meses += 12;
        --ans;
    }

    d2 = f2.getDate();
    d1 = f1.getDate();
    dias = d2 - d1;

    var f3 = new Date(f2.getFullYear(), m2, 1);
    f3.setDate(f3.getDate() - 1);
    d3 = f3.getDate();

    if (d1 > d2) {
        dias += d3;
        --meses;
        if (0 > meses) {
            meses += 12;
            --ans;
        }
        if (fa > fb) {  //correcci�n por febrero y meses de 30 d�as
            f3 = new Date(f1.getFullYear(), m1 + 1, 1);
            f3.setDate(f3.getDate() - 1);
            d3 = f3.getDate();
            if (d3 == 30)
                dias -= 1;
            if (d3 == 29)
                dias -= 2;
            if (d3 == 28)
                dias -= 3;
        }
    }

    return { ans: ans, meses: meses, dias: dias, Tdias: totdias };
}
export default {
    watch: {
        $route() {
            var me = this;
            setTimeout(function () { me.render() }, 200);
        }
    },
    extends: _.extends,
    props: ['id'],
    data() {
        return {
            o: {
                pk: {},
                ext: { files: [] },
                birthDate: null,
                lat: null,
                lon: null
            }
        }
    },
    mounted() {
        this.render();
    },
    computed: {
        dateDiff() {
            var s = '';
            if (this.o.birthDate) {
                var d;
                if (this.o.birthDate.split) {
                    d = this.o.birthDate.split('-');
                    d = new Date(d[0], d[1] - 1, d[2]);
                } else {
                    d = new Date(this.o.birthDate);
                }
                d = diferenciafechas(d, new Date());
                if (d.ans > 0)
                    s += 'A�OS=' + d.ans;
                if (d.meses > 0)
                    s += ' MESES=' + d.meses;
                if (d.dias > 0)
                    s += ' DIAS=' + d.dias;
            }
            return s;
        }
    },
    methods: {
        render() {
            var me = this, id = me.id;
            var path = me.$el.parentNode.getAttribute('path');
            if (path) {
                var action = path.split('/')[4].split('?')[0];
                id = action == 'create' ? 0 : action;
            }
            if (id) {
                axios.get('/api/desarrollo-social/hemoglobin/' + id).then(function (r) {
                    me.o = r.data;
                    me.o.ext = { peopleId: me.o.pk.peopleId };
                });
            } else {
                me.o = {
                    pk: {},
                    ext: { files: [] },
                    birthDate: null,
                    lat: null,
                    lon: null
                };
                me.getCoordinates();
            }
            setTimeout(() => { me.app.title = me.$children[0].header; }, 200);
        },
        close(r) { if (r === true) { this.$router.back(); } },
        camera() {
            var me = this;
            _.getCamera().then((r) => {
                //{src:?,name:?}
                if (r.src)
                    r.src = 'file://' + r.src;
                me.o.ext.files.push(r);
            });
        },
        process(o) {
            if (_.session)
                o.user = _.session.id;
            return o;
        },
        addFile(f) {
            MsgBox('this.code=' + this.code);
            if (this.code) {
                this.files.push(f);
                _.syncFile('file://' + f.src, this.code);
            } else
                MsgBox('Se requiere un identificador de monitoreado valido');
        },
        recoverData() {
            var me = this;
            if (me.o.ext.peopleId) {
                axios.error = function () { MsgBox('No se encontro datos') };
                axios.get('/api/desarrollo-social/hemoglobin/last-control/' + me.o.ext.peopleId, { ee: 777 }).then(function (r) {
                    var d = r.data;
                    me.o.sex = d.sex;
                    me.o.birthDate = d.birthDate;
                });
            }
        },
        sync(f) {
            if (!f.synced) {
                if (this.code)
                    _.syncFile('file://' + f.src, this.code);
                else
                    MsgBox('Se requiere un identificador de monitoreado valido');
            }
        },
        updateSync(id) {
            for (var i = 0; this.files.lengt > i; i++) {
                if (id == this.files[i].id) {
                    this.files[i].synced = true;
                    //Vue.set(this.files, i, this.files[i]);
                }

            }
        },
        removeRow(index) {
            this.rows.splice(index, 1); // why is this removing only the last row?
        },
        getCoordinates() {
            var me = this;
            _.getLocation().then(function (c) {
                me.o.lat = c.coords.latitude;
                me.o.lon = c.coords.longitude;
            });
        }
    }
}
</script>
<style scoped>
#dateDiff:empty,
#msg:empty {
    display: none;
}

#dateDiff {
    border-radius: 4px;
    background-color: #fdfad9;
    border: 1px solid #dddddd;
    padding: 5px 10px;
    margin-top: 10px;
}

#msg {
    border-radius: 4px;
    background-color: #ffd2d2;
    border: 1px solid #dddddd;
    padding: 5px 10px;
    margin-top: 10px;
}

.i-coords {
    display: none !important;
}

#gallery>img {
    border: 3px solid #61ff5f;
    max-width: 100%;
}

#gallery>.synced {
    border: 3px solid #dddddd !important;
}

#gallery {
    margin-bottom: 18px;
}
</style>