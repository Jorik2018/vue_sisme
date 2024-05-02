<template>
  <v-form action="/api/desarrollo-social/emed" :header="(o.id ? 'Editar' : 'Crear') + '  Evento'" :class="
    o.id < 0 || (o.tmpId && !o.synchronized)
      ? 'yellow'
      : o.tmpId
        ? 'green'
        : ''
  " store="emed">
    <div class="v-form">
      <label>ID:</label>
      <div>{{ pad(o.id || 0, 4) }}</div>
      <v-fieldset legend="Datos generales" class="v-form">
        <label>Codigo:</label>
        <input v-model="o.code"/>
        <label>Fecha:</label>
        <v-calendar required v-model="o.date" />
        <label>Hora:</label>
        <v-calendar type="time" required v-model="o.time" />
        <label>Tipo:</label>
        <v-select v-model="o.category" required="required">
          <option value="">Select One...</option>
          <option value="ANTROPICO">ANTROPICO</option>
          <option value="NATURAL">NATURAL</option>
          <option value="SANITARIO">SANITARIO</option>
        </v-select>
        <label>Evento:</label>
        <v-select v-model="o.type" :disabled="!o.category" required="required">
          <option value="">Select One...</option>
          <option v-for="type in filteredEvent" :key="type" :value="type">
            {{ type }}
          </option>
        </v-select>
        <label>Detalle:</label>
        <v-select v-model="o.detail" :disabled="!o.type" required="required">
          <option value="">Select One...</option>
          <option v-for="item in filteredDetailEvent" :key="item" :value="item">
            {{ item }}
          </option>
        </v-select>
        <label>Descripción:</label>
        <v-textarea v-model="o.description" maxlength="500"/>
      </v-fieldset>

      <v-fieldset legend="Ubicación" class="v-form">
        <label>DIRESA:</label>
        <div>ANCASH</div>
        <label>Provincia:</label>
        <v-select ref="province" storage="province_selected" v-model="o.province" :required="true"
          @input="$refs.district.load({ code: o.province })">
          <option>Select One...</option>
          <v-options store="province" display-field="name" value-field="code" />
        </v-select>
        <label>Distrito:</label>
        <v-select ref="district" :autoload="false" store="district_selected" :disabled="!o.province"
          v-model="o.district" name="district" required="true" @input="$refs.cpSelect.load({ id: o.district })">
          <option value="">Select One...</option>
          <v-options store="district" value-field="code" display-field="name" />
        </v-select>

        <label>Centro Poblado:</label>
        <v-select :autoload="false" :label="o.districtName ? o.districtName : '---'" :disabled="!o.district"
          required="required" ref="cpSelect" v-model="o.codigo_ccpp" @input="inputCCPP">
          <option value="">Seleccionar Opción</option>
          <v-options store="town" display-field="name" value-field="id" />
        </v-select>
        
        <label>Referencia:</label>
        <v-textarea v-model="o.referencia" maxlength="200" />
      </v-fieldset>

      <v-fieldset legend="Recursos movilizados ">
        <div>TODOS CON ORIGEN (IPRESS)</div>
        <label>N° Ambulancias:</label>
        <v-number v-model="o.ambulancias" />
        <label>N° personal:</label>
        <v-number v-model="o.personal" />
        <label>N° Brigadistas de salud:</label>
        <v-number v-model="o.brigadistas" />
        <label>N° Equipo Técnico EMED:</label>
        <v-number v-model="o.equipo_tecnico" />
      </v-fieldset>
      <label>Coordenadas:</label>
      <v-map ref="map" v-on:build="mapBuild" style="height: 400px; border: 1px solid lightgrey"
        v-on:translateend="translateend">
        <v-layer-control />
        <v-map-control v-on:click="addMarker" style="bottom: 30px; right: 10px" icon="fa-map-marker" />
      </v-map>
      <v-fieldset legend="Fuente de Información">
        <label>Institución:</label>
        <input v-model="o.fuente_institucion" />
        <label>Apellidos y nombres:</label>
        <input v-model="o.fuente_nombre_completo" />
        <label>Cargo:</label>
        <input v-model="o.fuente_cargo" />
        <label>Celular:</label>
        <input v-model="o.fuente_celular" />
      </v-fieldset>
      <v-fieldset legend="Responsable de Información IPRESS">
        <v-fieldset legend="Fuente inicial">
          <label>IPRESS:</label>
          <v-select v-model="o.fuente_responsable_ipress" required="required">
            <option value="">Select One...</option>
            <option v-for="e in ipress_inicial" :key="e" :value="e">
              {{ e }}
            </option>
          </v-select>
          <label>Apellidos y nombres:</label>
          <input v-model="o.fuente_responsable_nombre_completo" />
          <label>Cargo:</label>
          <input v-model="o.fuente_responsable_cargo" />
          <label>Celular:</label>
          <input v-model="o.fuente_responsable_celular" />
        </v-fieldset>
        <v-fieldset legend="Fuente verificación">
          <label>EMED Salud:</label>
          <v-select v-model="o.fuente_verifica_emed" required="required">
            <option value="">Select One...</option>
            <option v-for="e in emed" :key="e" :value="e">
              {{ e }}
            </option>
          </v-select>
          <label>Apellidos y nombres:</label>
          <input v-model="o.fuente_verifica_nombre_completo" />
          <label>Cargo:</label>
          <input v-model="o.fuente_verifica_cargo" />
          <label>Celular:</label>
          <input v-model="o.fuente_verifica_celular" />
        </v-fieldset>
      </v-fieldset>
    </div>
    <center>
      <v-button value="Grabar" icon="fa-save" class="blue" @click.prevent="save"></v-button>
      <v-button style="margin-left: 10px" value="Ver" :disabled="!o.id" icon="fa-eye" class="blue" @click.prevent="
  $router.replace(
    '/admin/desarrollo-social/emed/' + (o.tmpId ? -o.tmpId : o.id)
  )
      "></v-button>
    </center>
  </v-form>
</template>
<script>
import { Capacitor } from "@capacitor/core";
import { Camera, CameraResultType } from "@capacitor/camera";
import { Filesystem, Directory } from "@capacitor/filesystem";
import { Geolocation } from "@capacitor/geolocation";
import "ol/ol.css";
import Feature from "ol/Feature";
import Icon from "ol/style/Icon";
var { _, axios, ol } = window;
ol.style.Icon = Icon;
ol.style.Feature = Feature;

export default _.ui({
  props: ["id"],
  data() {
    return {
      count: 0,
      red: [],
      risk: [
        "INVIDENTE",
        "DIFICULTAD PIERNAS",
        "DISCAPACIDAD CARA",
        "DISCAPACIDAD CARA Y LABIOS",
        "DISCAPACIDAD MENTAL",
        "EXTREMIDADES",
        "MINUSVALIDA",
        "PARALISIS",
        "SORDO MUDO",
        "SINDROME DOWN",
        "SORDERA",
        "SORDO MUDO",
        "TARTAMUDO",
        "TRANSTORNO DE CADERA",
        "Otro",
      ],
      event: [
        { category: "ANTROPICO", type: "ACCIDENTE_AEREO", detail: "AVION" },
        { category: "ANTROPICO", type: "ACCIDENTE_AEREO", detail: "AVIONETA" },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_AEREO",
          detail: "HELICOPTERO",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "ATROPELLO",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "CAIDA A BARRANCO",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "CAIDA DE PASAJERO",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "COLISION",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "COLISION MULTIPLE",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "DESPISTE",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DE_TRANSITO",
          detail: "VOLCADURA",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_DEPORTIVO",
          detail: "ACCIDENTE_DEPORTIVO",
        },
        { category: "ANTROPICO", type: "ACCIDENTE_FLUVIAL", detail: "BALSA" },
        { category: "ANTROPICO", type: "ACCIDENTE_FLUVIAL", detail: "BARCO" },
        { category: "ANTROPICO", type: "ACCIDENTE_FLUVIAL", detail: "BOTE" },
        { category: "ANTROPICO", type: "ACCIDENTE_FLUVIAL", detail: "LANCHA" },
        { category: "ANTROPICO", type: "ACCIDENTE_FLUVIAL", detail: "OTRO" },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_FLUVIAL",
          detail: "PEQUE PEQUE",
        },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_LABORAL",
          detail: "APLASTAMIENTO O ENTERRAMIENTO",
        },
        { category: "ANTROPICO", type: "ACCIDENTE_LABORAL", detail: "CAIDA" },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_LABORAL",
          detail: "ELECTROCUCION",
        },
        { category: "ANTROPICO", type: "ACCIDENTE_LABORAL", detail: "OTRO" },
        { category: "ANTROPICO", type: "ACCIDENTE_MARITIMO", detail: "BARCO" },
        { category: "ANTROPICO", type: "ACCIDENTE_MARITIMO", detail: "BOTE" },
        {
          category: "ANTROPICO",
          type: "ACCIDENTE_MARITIMO",
          detail: "CHALANA O CHALUPA",
        },
        { category: "ANTROPICO", type: "ACCIDENTE_MARITIMO", detail: "LANCHA" },
        { category: "ANTROPICO", type: "AHOGAMIENTO", detail: "AHOGAMIENTO" },
        { category: "ANTROPICO", type: "BLOQUEOS", detail: "CALLE" },
        { category: "ANTROPICO", type: "BLOQUEOS", detail: "CARRETERA" },
        {
          category: "ANTROPICO",
          type: "COLAPSO_DE_ESTRUCTURA",
          detail: "EDIFICIO",
        },
        {
          category: "ANTROPICO",
          type: "COLAPSO_DE_ESTRUCTURA",
          detail: "OTRAS ESTRUCTURAS",
        },
        {
          category: "ANTROPICO",
          type: "COLAPSO_DE_ESTRUCTURA",
          detail: "PUENTE",
        },
        {
          category: "ANTROPICO",
          type: "COLAPSO_DE_ESTRUCTURA",
          detail: "VIVIENDA",
        },
        {
          category: "ANTROPICO",
          type: "CONFLICTO_SOCIAL",
          detail: "ACCIONES INSURGENTES",
        },
        {
          category: "ANTROPICO",
          type: "CONFLICTO_SOCIAL",
          detail: "PROTESTA CON MOVILIZACIONES",
        },
        {
          category: "ANTROPICO",
          type: "CONTAMINACION_AMBIENTAL",
          detail: "DEGRADACIÓN DE CUERPOS DE AGUA",
        },
        {
          category: "ANTROPICO",
          type: "CONTAMINACION_AMBIENTAL",
          detail: "DERRAME DE PETROLEO",
        },
        {
          category: "ANTROPICO",
          type: "DEFLAGRACION",
          detail: "COMBUSTION RAPIDA DE UNA LLAMA",
        },
        {
          category: "ANTROPICO",
          type: "DELINCUENCIA_COMUN",
          detail: "DELINCUENCIA_COMUN",
        },
        { category: "ANTROPICO", type: "DERRUMBE", detail: "EDIFICIO" },
        {
          category: "ANTROPICO",
          type: "DERRUMBE",
          detail: "OTRAS ESTRUCTURAS",
        },
        { category: "ANTROPICO", type: "DERRUMBE", detail: "PUENTE" },
        { category: "ANTROPICO", type: "DERRUMBE", detail: "VIVIENDA" },
        {
          category: "ANTROPICO",
          type: "DESPLAZAMIENTO",
          detail: "POR EVENTOS DE ORIGEN NATURAL",
        },
        {
          category: "ANTROPICO",
          type: "DESPLAZAMIENTO",
          detail: "POR VIOLENCIA SOCIAL",
        },
        {
          category: "ANTROPICO",
          type: "ELECTROCUCION",
          detail: "ELECTROCUCION",
        },
        {
          category: "ANTROPICO",
          type: "ENFRENTAMIENTO",
          detail: "ENFRENTAMIENTO",
        },
        {
          category: "ANTROPICO",
          type: "EVENTO_PROGRAMADO_CON_VICTIMAS",
          detail: "EVENTO_PROGRAMADO_CON_VICTIMAS",
        },
        { category: "ANTROPICO", type: "EXPLOSION", detail: "EXPLOSION" },
        {
          category: "ANTROPICO",
          type: "FUGA_DE_GASES",
          detail: "FUGA_DE_GASES",
        },
        { category: "ANTROPICO", type: "GUERRA", detail: "GUERRA" },
        {
          category: "ANTROPICO",
          type: "HUELGA_DE_HAMBRE",
          detail: "HUELGA_DE_HAMBRE",
        },
        {
          category: "ANTROPICO",
          type: "HUELGA_GENERAL_INDEFINIDA",
          detail: "HUELGA_GENERAL_INDEFINIDA",
        },
        {
          category: "ANTROPICO",
          type: "INCENDIO",
          detail: "INCENDIO FORESTAL",
        },
        {
          category: "ANTROPICO",
          type: "INCENDIO",
          detail: "INCENDIO INDUSTRIAL",
        },
        { category: "ANTROPICO", type: "INCENDIO", detail: "INCENDIO URBANO" },
        {
          category: "ANTROPICO",
          type: "INTOXICACIÓN",
          detail: "INTOXICACION ALIMENTARIA",
        },
        {
          category: "ANTROPICO",
          type: "INTOXICACIÓN",
          detail: "INTOXICACION POR QUIMICOS U OTROS AGENTES",
        },
        {
          category: "ANTROPICO",
          type: "INUNDACION_ANEGAMIENTO",
          detail: "POR COLAPSO DE DRENAJES",
        },
        {
          category: "ANTROPICO",
          type: "INUNDACION_ANEGAMIENTO",
          detail: "POR RUPTURA DE TUBERIAS",
        },
        {
          category: "ANTROPICO",
          type: "MATERIALES_PELIGROSOS",
          detail: "DERRAME DE SUSTANCIAS QUIMICAS PELIGROSAS",
        },
        {
          category: "ANTROPICO",
          type: "MATERIALES_PELIGROSOS",
          detail: "EMERGENCIA NUCLEAR",
        },
        {
          category: "ANTROPICO",
          type: "MATERIALES_PELIGROSOS",
          detail: "EMERGENCIA POR AGENTE BIOLOGICO",
        },
        {
          category: "ANTROPICO",
          type: "MATERIALES_PELIGROSOS",
          detail: "EMERGENCIA POR AGENTES EXPLOSIVOS",
        },
        {
          category: "ANTROPICO",
          type: "MATERIALES_PELIGROSOS",
          detail: "EMERGENCIA RADIACTIVA",
        },
        {
          category: "ANTROPICO",
          type: "MOVILIZACION_SOCIAL",
          detail: "MOVILIZACION POR PROTESTA",
        },
        { category: "ANTROPICO", type: "NARCOTRAFICO", detail: "NARCOTRAFICO" },
        {
          category: "ANTROPICO",
          type: "OTROS_EVENTOS",
          detail: "OTROS_EVENTOS",
        },
        { category: "ANTROPICO", type: "PANDILLAJE", detail: "PANDILLAJE" },
        { category: "ANTROPICO", type: "PAROS", detail: "PAROS" },
        { category: "ANTROPICO", type: "SUBVERSION", detail: "SUBVERSION" },
        {
          category: "ANTROPICO",
          type: "TOMA_DE_LOCAL",
          detail: "TOMA_DE_LOCAL",
        },
        {
          category: "ANTROPICO",
          type: "TOMA_DE_REHENES",
          detail: "TOMA_DE_REHENES",
        },
        { category: "NATURAL", type: "ACTIVIDAD_VOLCANICA", detail: "" },
        { category: "NATURAL", type: "ACTIVIDAD_VOLCANICA", detail: "" },
        { category: "NATURAL", type: "ACTIVIDAD_VOLCANICA", detail: "" },
        { category: "NATURAL", type: "ACTIVIDAD_VOLCANICA", detail: "" },
        { category: "NATURAL", type: "ACTIVIDAD_VOLCANICA", detail: "" },
        {
          category: "NATURAL",
          type: "ALUVION_HUAYCO",
          detail: "MATERIAL DE ARRASTRE GRUESO Y FINO",
        },
        {
          category: "NATURAL",
          type: "AVALANCHA",
          detail: "MOVIMIENTO DE UNA MASA DE NIEVE",
        },
        {
          category: "NATURAL",
          type: "AVALANCHA",
          detail: "MOVIMIENTO DE UNA MASA DE TIERRA",
        },
        {
          category: "NATURAL",
          type: "COLMATACION",
          detail: "CRECIMIENTO DE FLORA NATIVA EN LOS RIOS",
        },
        {
          category: "NATURAL",
          type: "COLMATACION",
          detail: "OBSTRUCCION DEL CAUCE NATURAL DE UN RIO",
        },
        { category: "NATURAL", type: "DERRUMBES", detail: "EN UN BARRANCO" },
        { category: "NATURAL", type: "DERRUMBES", detail: "EN UN CAÑON" },
        { category: "NATURAL", type: "DERRUMBES", detail: "EN UN CERRO" },
        { category: "NATURAL", type: "DERRUMBES", detail: "EN UNA LOMA" },
        { category: "NATURAL", type: "DERRUMBES", detail: "EN UNA MONTAÑA" },
        {
          category: "NATURAL",
          type: "DESGLACIACION",
          detail: "PERDIDA DE CASCO GLACIAR",
        },
        {
          category: "NATURAL",
          type: "DESLIZAMIENTO_DE_TIERRA",
          detail: "CONO ALUVIAL (MATERIAL FINO)",
        },
        {
          category: "NATURAL",
          type: "DESLIZAMIENTO_DE_TIERRA",
          detail: "CONO COLUVIAL (MATERIAL GRUESO)",
        },
        {
          category: "NATURAL",
          type: "DESLIZAMIENTO_DE_TIERRA",
          detail: "EN UN CERRO",
        },
        {
          category: "NATURAL",
          type: "DESLIZAMIENTO_DE_TIERRA",
          detail: "EN UNA LOMA",
        },
        {
          category: "NATURAL",
          type: "DESLIZAMIENTO_DE_TIERRA",
          detail: "EN UNA MONTAÑA",
        },
        {
          category: "NATURAL",
          type: "DESPRENDIMIENTO_DE_ROCAS",
          detail: "EN UN BARRANCO",
        },
        {
          category: "NATURAL",
          type: "DESPRENDIMIENTO_DE_ROCAS",
          detail: "EN UN CERRO",
        },
        {
          category: "NATURAL",
          type: "DESPRENDIMIENTO_DE_ROCAS",
          detail: "EN UNA LADERA DEL CERRO",
        },
        {
          category: "NATURAL",
          type: "EROSION_FLUVIAL",
          detail: "CONO ALUVIAL (MATERIAL FINO)",
        },
        {
          category: "NATURAL",
          type: "EROSION_FLUVIAL",
          detail: "CONO COLUVIAL (MATERIAL GRUESO)",
        },
        {
          category: "NATURAL",
          type: "EROSION_FLUVIAL",
          detail: "EROSION DE CARCAVAS",
        },
        {
          category: "NATURAL",
          type: "FENOMENO_EL_NIÑO",
          detail: "BAJA DENSIDAD DE ESPECIES MARINAS",
        },
        {
          category: "NATURAL",
          type: "FENOMENO_EL_NIÑO",
          detail: "FUERTES PRECIPITACIONES",
        },
        {
          category: "NATURAL",
          type: "FENOMENO_EL_NIÑO",
          detail: "INCREMENTO DE LA SALINIDAD DEL MAR",
        },
        {
          category: "NATURAL",
          type: "FENOMENO_EL_NIÑO",
          detail: "INCREMENTO DE LA TEMPERATURA",
        },
        {
          category: "NATURAL",
          type: "FENOMENO_EL_NIÑO",
          detail: "INUNDACIONES",
        },
        { category: "NATURAL", type: "FRIAJE", detail: "INGRESO DE AIRE FRIO" },
        {
          category: "NATURAL",
          type: "GRANIZADA",
          detail: "PRECIPITACION SOLIDA",
        },
        {
          category: "NATURAL",
          type: "HELADA",
          detail: "BAJA DE LA TEMPERATURA EN LA SIERRA",
        },
        { category: "NATURAL", type: "HUNDIMIENTO", detail: "FALLA GEOLOGICA" },
        {
          category: "NATURAL",
          type: "HUNDIMIENTO",
          detail: "POR INFLUENCIA DE ZONA DE ACUIFEROS",
        },
        {
          category: "NATURAL",
          type: "HUNDIMIENTO",
          detail: "POR PRESENCIA DE SUMIDEROS",
        },
        {
          category: "NATURAL",
          type: "HUNDIMIENTO",
          detail: "PRESENCIA DE NAPA FREATICA",
        },
        { category: "NATURAL", type: "INCENDIO_FORESTAL", detail: "BOSQUE" },
        {
          category: "NATURAL",
          type: "INCENDIO_FORESTAL",
          detail: "PROPAGADAS POR RAICES ARBOREAS",
        },
        {
          category: "NATURAL",
          type: "INCENDIO_FORESTAL",
          detail: "TERRENO DE CULTIVO",
        },
        {
          category: "NATURAL",
          type: "INCENDIO_FORESTAL",
          detail: "ZONAS FORESTALES EXPUESTAS",
        },
        {
          category: "NATURAL",
          type: "INUNDACION_ANEGAMIENTOS",
          detail: "POR DESBORDES DE LAGUNAS",
        },
        {
          category: "NATURAL",
          type: "INUNDACION_ANEGAMIENTOS",
          detail: "POR DESBORDES DE RIOS",
        },
        {
          category: "NATURAL",
          type: "INUNDACION_ANEGAMIENTOS",
          detail: "POR DESVIACION NATURAL DE LOS RIOS",
        },
        {
          category: "NATURAL",
          type: "INUNDACION_ANEGAMIENTOS",
          detail: "POR PRECIPITACIONES FUERA DE LO NORMAL",
        },
        {
          category: "NATURAL",
          type: "LLOVIZNA_PERSISTENTE",
          detail: "PRECIPITACION EN LA COSTA",
        },
        {
          category: "NATURAL",
          type: "LLUVIAS_INTENSAS",
          detail: "PRECIPITACION FUERTE Y DE LARGA DURACION",
        },
        {
          category: "NATURAL",
          type: "MOVIMIENTO_EN_MASA",
          detail: "ARRASTRE DE MATERIAL FINO Y GRUESO",
        },
        {
          category: "NATURAL",
          type: "MOVIMIENTO_EN_MASA",
          detail: "COBERTURA DE ARRASTRE DE GRAN EXTENSION",
        },
        {
          category: "NATURAL",
          type: "MOVIMIENTO_EN_MASA",
          detail: "CON FLUJO DE BARRO",
        },
        {
          category: "NATURAL",
          type: "MOVIMIENTO_EN_MASA",
          detail: "POR SOBRE HIDRATACION DEL SUELO",
        },
        { category: "NATURAL", type: "NEVADA", detail: "PRECIPITACION SOLIDA" },
        {
          category: "NATURAL",
          type: "OBSTRUCCION_DE_CANALES_Y_PUENTES",
          detail: "RELLENO EN EL PASO DEL FLUJO (CANAL)",
        },
        {
          category: "NATURAL",
          type: "OLA_DE_CALOR",
          detail: "INCREMENTO TEMPORAL DEL CALOR",
        },
        {
          category: "NATURAL",
          type: "OLEAJES_ANOMALOS",
          detail: "INCREMENTO DE LA FUERZA DEL OLEAJE",
        },
        { category: "NATURAL", type: "OTRO_EVENTOS", detail: "OTRO_EVENTOS" },
        {
          category: "NATURAL",
          type: "REPTACION",
          detail: "DESPRENDIMIENTO Y MOVIMIENTO LENTO DEL SUELO",
        },
        {
          category: "NATURAL",
          type: "SEQUIA",
          detail: "ESCASES DE PRECIPITACIONES",
        },
        {
          category: "NATURAL",
          type: "SEQUIA",
          detail: "PERDIDA EN EL CAUDAL MINIMO DE UN RIO",
        },
        { category: "NATURAL", type: "SISMO", detail: "MAREMOTO (TSUNAMI)" },
        { category: "NATURAL", type: "SISMO", detail: "MOVIMIENTO EN MASA" },
        {
          category: "NATURAL",
          type: "SISMO",
          detail: "MOVIMIENTO TELURICO DE BAJA MAGNITUD",
        },
        {
          category: "NATURAL",
          type: "SISMO",
          detail: "MOVIMIENTO TELURICO DE GRAN MAGNITUD",
        },
        {
          category: "NATURAL",
          type: "TORMENTAS",
          detail: "ASOCIADA A LLUVIAS, VIENTOS FUERTES",
        },
        {
          category: "NATURAL",
          type: "TORMENTAS",
          detail: "ASOCIADA A OLEAJE ANOMALO",
        },
        { category: "NATURAL", type: "TSUNAMI", detail: "INUNDACIONES" },
        { category: "NATURAL", type: "TSUNAMI", detail: "SOCAVAMIENTO" },
        {
          category: "NATURAL",
          type: "VIENTOS_FUERTES",
          detail: "INCREMENTO DE LA FUERZA DEL VIENTO",
        },
        { category: "SANITARIO", type: "BROTE", detail: "CARBUNCO" },
        { category: "SANITARIO", type: "BROTE", detail: "CHICUNGUNYA" },
        { category: "SANITARIO", type: "BROTE", detail: "COLERA" },
        { category: "SANITARIO", type: "BROTE", detail: "DENGUE" },
        {
          category: "SANITARIO",
          type: "BROTE",
          detail: "ENFERMEDAD DE CARRION",
        },
        {
          category: "SANITARIO",
          type: "BROTE",
          detail: "ENFERMEDAD DE CHAGAS",
        },
        { category: "SANITARIO", type: "BROTE", detail: "FIEBRE AMARILLA" },
        { category: "SANITARIO", type: "BROTE", detail: "GUILLAIN BARRE" },
        { category: "SANITARIO", type: "BROTE", detail: "HEPATITIS B" },
        { category: "SANITARIO", type: "BROTE", detail: "INFLUENZA" },
        { category: "SANITARIO", type: "BROTE", detail: "LEISHMANIOSIS" },
        { category: "SANITARIO", type: "BROTE", detail: "LEPTOSPIRA" },
        { category: "SANITARIO", type: "BROTE", detail: "MALARIA" },
        {
          category: "SANITARIO",
          type: "BROTE",
          detail: "MENINGITIS MENINGOCOCIDA",
        },
        {
          category: "SANITARIO",
          type: "BROTE",
          detail: "PARALISIS FLACIDA AGUDA",
        },
        { category: "SANITARIO", type: "BROTE", detail: "PARATODITIS" },
        { category: "SANITARIO", type: "BROTE", detail: "PESTE" },
        { category: "SANITARIO", type: "BROTE", detail: "POLIOMIELITIS" },
        { category: "SANITARIO", type: "BROTE", detail: "POR PLAGICIDAS" },
        { category: "SANITARIO", type: "BROTE", detail: "RABIA" },
        { category: "SANITARIO", type: "BROTE", detail: "SARAMPION" },
        { category: "SANITARIO", type: "BROTE", detail: "TETANOS NEONATAL" },
        { category: "SANITARIO", type: "BROTE", detail: "TOS FERINA" },
        { category: "SANITARIO", type: "BROTE", detail: "VARICELA" },
        { category: "SANITARIO", type: "BROTE", detail: "ZIKA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "CARBUNCO" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "CHICUNGUNYA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "COLERA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "DENGUE" },
        {
          category: "SANITARIO",
          type: "EPIDEMIAS",
          detail: "ENFERMEDAD DE CARRION",
        },
        {
          category: "SANITARIO",
          type: "EPIDEMIAS",
          detail: "ENFERMEDAD DE CHAGAS",
        },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "FIEBRE AMARILLA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "GUILLAIN BARRE" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "HEPATITIS B" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "INFLUENZA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "LEISHMANIOSIS" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "MALARIA" },
        {
          category: "SANITARIO",
          type: "EPIDEMIAS",
          detail: "MENINGITIS MENINGOCOCIDA",
        },
        {
          category: "SANITARIO",
          type: "EPIDEMIAS",
          detail: "PARALISIS FLACIDA AGUDA",
        },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "PESTE" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "POLIOMIELITIS" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "POR PLAGICIDAD" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "RABIA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "SARAMPION" },
        {
          category: "SANITARIO",
          type: "EPIDEMIAS",
          detail: "TETANOS NEONATAL",
        },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "TOS FERINA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "VARICELA" },
        { category: "SANITARIO", type: "EPIDEMIAS", detail: "ZIKA" },
        {
          category: "SANITARIO",
          type: "OTROS_EVENTO",
          detail: "OTROS EVENTOS",
        },
        { category: "SANITARIO", type: "PANDEMIAS", detail: "CORONAVIRUS" },
        { category: "SANITARIO", type: "PLAGAS", detail: "ARTROPODOS" },
        { category: "SANITARIO", type: "PLAGAS", detail: "ROEDORES" },
      ],
      areaResidencia: [
        { id: "U", name: "URBANO" },
        { id: "M", name: "URBANO MARGINAL" },
        { id: "R", name: "RURAL" },
      ],
      emed: [
        'RSCN',
        'RSCS',
        'RSHN',
        'RSHS',
        'RSPN',
        'RSPS',
        'HLC',
        'HEGB',
        'HVRG'
      ],
      ipress_inicial: [
        'CIA BOMBEROS',
        'CPCED - COE',
        'IGP',
        'INDECI',
        'P.N.P',
        'PRENSA',
        'RADIO',
        'REPORTA SALUD',
        'SENAMHI',
        'TELEVISION',
        'CPCED - EMED',
        'COE SALUD',
        'OTROS',
        'MARINA DE GUERRA DEL PERÚ',
        'EJÉRCITO DEL PERÚ',
        'FUERZA AÉREA DEL PERÚ',
        'SAMU',
        'EMED SALUD',
        'COEN'

      ],
      resultadoVisita: ["EJECUTADO", "RECHAZADO", "ABANDONADO"],
      trayLocation: null,
      o: {
        id: null,
        synchronized: null,
        lat: null,
        tmpId: null,
        lon: null,
        codigo_ccpp: null,
      },
    };
  },
  computed: {
    filteredEvent() {
      return this.o.category != null
        ? this.event
          .filter((e) => e.category == this.o.category)
          .map((e) => e.type)
          .filter((value, index, self) => self.indexOf(value) === index)
        : [];
    },
    filteredDetailEvent() {
      return this.o.type != null
        ? this.event
          .filter(
            (e) => e.category == this.o.category && e.type == this.o.type
          )
          .map((e) => e.detail)
        : [];
    },
  },
  created() {
    var me = this;
    me.$on("sync", (o) => {
      me.getStoredList("emed").then((emeds) => {
        emeds.forEach((e) => {
          if (e.tmpId == Math.abs(o.tmpId)) {
            if (e.action)
              e.action.forEach((e) => {
                if (o.action)
                  o.action.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.emedId = o.id;
              });
            if (e.damage_salud)
              e.damage_salud.forEach((e) => {
                if (o.damage_salud)
                  o.damage_salud.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.emedId = o.id;
              });
            if (e.damage_ipress)
              e.damage_ipress.forEach((e) => {
                if (o.damage_ipress)
                  o.damage_ipress.forEach((o) => {
                    if (o.tmpId == e.tmpId) {
                      e.id = o.id;
                      e.synchronized = o.synchronized;
                    }
                  });
                e.emedId = o.id;
              });
            _.db
              .transaction(["emed"], "readwrite")
              .objectStore("emed")
              .put(e);
          }
        });
      });
    });
  },
  mounted() {
    var me = this;
    me.changeRoute();
  },
  methods: {
    onInputFUR(o) {
      if (o) {
        o = new Date(o);
        o.setFullYear(o.getFullYear() + 1);
        o.setMonth(o.getMonth() - 3);
        o.setDate(o.getDate() + 7);
      }
      this.o.gestanteFPP = _.toDate(o, "date-");
    },
    inputCCPP(a, b) {
      this.o.ccpp = b ? b.object.name || "" : "";
    },
    inputEstablishment(a, b) {
      this.o.establecimientoSalud = b ? b.object.name : "";
    },
    process(o) {
      if (!this.trayLocation) {
        this.MsgBox("Debe tratar de obtener la geolocalización.");
        return false;
      }
      return o;
    },
    changeImage(result) {
      var me = this,
        o = me.o;
      o.tempFile = result.tempFile;
      if (o.id > 0) {
        result.id = o.id;
        axios
          .post("/api/desarrollo-social/emed/attach-image", result)
          .then(() => {
            if (o.tmpId) {
              var objectStore = _.db.transaction(["emed"], "readwrite")
                .objectStore("emed");
              var item = objectStore.get(o.tmpId);
              item.onsuccess = () => {
                objectStore.put(o);
              };
            }
            me.app.toast("Imagen adjuntada!");
          });
      }
    },
    mapBuild() {
      var o = this.o;
      if (0 > o.lon) {
        this.$refs.map.addFeature(
          {
            lon: o.lon,
            lat: o.lat,
          },
          {}
        );
      }
    },
    translateend(o) {
      this.o.lat = o.lat;
      this.o.lon = o.lon;
    },
    async addMarker() {
      //var o = this.o;
      var me = this,
        m = me.$refs.map;
      if (!m.collection.getLength()) {
        me.trayLocation = 1;
        const coordinates = await Geolocation.getCurrentPosition();
        var c = coordinates.coords;
        me.o.lat = c.latitude;
        me.o.lon = c.longitude;
        m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
      } else
        m.map.getView().animate({
          center: m.collection.item(0).getGeometry().getCoordinates(),
          zoom: 17,
          duration: 500,
        });
    },
    uploaderClick(uploader) {
      var me = this,
        o = me.o;
      me.count++;
      Camera.getPhoto({
        quality: 100,
        resultType: CameraResultType.Uri,
      }).then(function (result) {
        me.count--;
        if (me.count == 0) {
          var fs = Filesystem;
          if (result.path) {
            o.ext.path = result.path;
            fs.readFile({
              path: result.path,
            }).then(function (r) {
              var filename = new Date().getTime() + ".jpeg";
              //Aqui se guarda una copia del archivo
              fs.writeFile({
                data: r.data,
                path: filename,
                directory: Directory.Data,
              }).then(function () {
                fs.getUri({
                  path: filename,
                  directory: Directory.Data,
                }).then(function (s) {
                  //incluso si se envia la imagen es mejor tener una referencia local
                  var src = Capacitor.convertFileSrc(s.uri);
                  if (me.online) {
                    fetch(src)
                      .then((r) => r.blob())
                      .then((b) => {
                        uploader.submitFile(b, "name." + result.format);
                      });
                  }
                });
              });
            });
          } else {
            fetch(result.webPath)
              .then((r) => r.blob())
              .then(function (b) {
                o.ext.src = result.webPath;
                o.ext.pending = 1;
                if (me.online)
                  uploader.submitFile(b, "name." + result.format);
              });
          }
        }
      });
    },
    async changeRoute() {
      var me = this,
        id = me.id, m = me.$refs.map;
      me.trayLocation = 0;
      if (id < 0) {
        me.getStoredList("emed").then((emed) => {
          emed.forEach((e) => {
            if (e.tmpId == Math.abs(me.id)) {
              me.o = e;
              m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
              me.$refs.province.load({ code: me.o.region || "02" });
              me.trayLocation = e.lat && e.lon;
              alert(me.trayLocation);
            }
          });
        });
      } else if (Number(id)) {
        axios
          .get("/api/desarrollo-social/emed/" + id)
          .then((response) => {
            var o = response.data;
            if (o.province) {
              o.province = me.pad(o.province, 4);
              o.region = o.province.substring(0, 2);
            }
            if (o.district) o.district = me.pad(o.district, 6);
            me.trayLocation = 1;
            me.o = o;
            m.addFeature({ draggable: true, lat: me.o.lat, lon: me.o.lon }, { zoom: 14 });
            me.$refs.province.load({ code: me.o && me.o.region || '02' });
          });
      } else {
        try {
          var s = localStorage.getItem("setting");
          if (s) {
            s = JSON.parse(s);
            var o = this.o;
            if (s.region) o.region = s.region.code;
            if (s.province) o.province = s.province.code;
            if (s.district) o.district = s.district.code;
            if (s.town) o.codigoCCPP = s.town.id;
            /*o.town = s.town;*/
          }
        } catch (e) {
          console.log(e);
        }
        me.$refs.province.load({ code: me.o && me.o.region || '02' });
      }
    },
    close(r) {
      var me = this, o = me.o;
      if (r.success === true) {
        me.o.id = r.data.id;
        me.o.tmpId = r.data.tmpId;
        if (r.data.uploaded) {
          delete o.tempFile;
        }
      }
      var nid = o.tmpId ? -o.tmpId : o.id;
      if (me.id != nid)
        me.$router.replace("/admin/desarrollo-social/emed/" + nid);
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
      if (me.getCurrentPosition) {
        me.getCurrentPosition();
      } else
        _.getLocation().then(function (c) {
          me.o.lat = c.coords.latitude;
          me.o.lon = c.coords.longitude;
        });
    },
  },
});
</script>