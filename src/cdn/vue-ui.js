import * as olProj from 'ol/proj';
import Map from 'ol/Map'
import View from 'ol/View'
import Collection from 'ol/Collection'
import {Fill, Stroke, Style, Circle, RegularShape} from 'ol/style'
import {Tile,Vector as VectorLayer} from 'ol/layer'
import {OSM,Vector} from 'ol/source'
import Point from 'ol/geom/Point'
import Control from 'ol/control/Control'
import FullScreen from 'ol/control/FullScreen'
import Overlay from 'ol/Overlay'
import Feature from 'ol/Feature'
import GeoJSON from 'ol/format/GeoJSON'
import Translate from 'ol/interaction/Translate'
import Text from  'ol/style/Text'

var ol={
	Overlay:Overlay,
	Feature:Feature,
	proj:olProj,
	interaction:{Translate:Translate},
	format:{GeoJSON:GeoJSON},
	geom:{Point:Point},
	control:{Control:Control,FullScreen:FullScreen},
	Map:Map,
	View:View,
	Collection:Collection,
	source:{OSM:OSM,Vector:Vector},
	layer:{Tile:Tile,Vector:VectorLayer},
	style:{Style:Style,Stroke:Stroke,Text:Text,Fill:Fill,Circle:Circle,RegularShape:RegularShape}
}
window.ol=ol;