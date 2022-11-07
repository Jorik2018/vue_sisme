import Vue from 'vue'
import Chart from 'chart.js'
var _=window._;
Vue.component('v-chart', {
    props: {
        value: {
            type: String,
        },
        data: Object,
        type: String,
        source: String,
        dataFunc:Function
    },

    template: '<div style="border:1px solid gray"><canvas></canvas></div>',
    updated() {
        console.log(this.data.dataIndex);
        this.chart.update();
    },
    mounted() {
        var m = this;
		if(typeof Chart !== 'undefined'){
			m.Chart=Chart;m.build();
		}else
			_.loadScript('/cdn/Chart.min.js', function () {
				m.Chart=Chart;
				m.build();
			});
    },
    data(){
        return {dat: {},Chart:null}
    },
    methods: {
        build() {
            var me = this;
            var canvas = this.$el.querySelector("canvas");
            if (this.chart) {
                this.chart.destroy();
            }
            var _dat = me.dat;
            _dat.label = [];
            _dat.data = [];
//            axios.get(this.src, {params: null})
//                    .then(function (r) {
//                        var _dat = r.data.data ? r.data.data : r.data;
//                        for (i = 0; i < _dat.length; i++) {
//                            _data.label.push(_dat[i][0]);
//                            _data.data.push(_dat[i][1]);
//                        }
//                        me.chart.update();
//
//                        //me.$forceUpdate();
//                        //me.$parent.loaded(nou);
//                        //me.$emit('loaded', me);
//                        //Si lo encuentra despues de cargar los items debe marcarlo
//                        //if(me.$parent.$attrs.value)
//                        //me.$parent.onChange(me.$parent.$attrs.value);
//                    })
//                    .catch(function (r) {
//                        console.log(r);
//                        r = r.response;
//                        var e = me.$parent.$el;
//                        var error = document.createElement("div");
////                        error.innerHTML = r.config.method + ' ' + r.config.url + ' ' + r.status + ' (' + r.statusText + ')';
//                        error.classList.add("v-error");
//                        e.parentNode.insertBefore(error, e);
//                    });

//            if(me.data&&this.data.height){
//                canvas.height = this.data.height+'px';
//                canvas.parentNode.style.height = this.data.height+'px';
//            }
//            var din=this.data.dataIndexName;
//            var met=this.data.metaData;
//            if(din){
//                for(var i=0;i<din.length;i++){
//                    for(var j=0;j<met.length;j++){
//                        if(met[j].name==din[0])this.data.dataIndex=j;
//                    } 
//                }
//            }

            window.chartColors = ['rgb(255, 99, 132)', 'rgb(255, 159, 64)', 'rgb(255, 205, 86)',
                'rgb(75, 192, 192)', 'rgb(54, 162, 235)', 'rgb(153, 102, 255)', 'rgb(201, 203, 207)'];

//            var dataset=[];
//            
//            for(var i=0;i<this.data.data.length;i++){
//                dataset.push(this.data.data[i][this.data.dataIndex]);
//            }
//            for(var i=0;i<this.data.data.length;i++){
//                label.push(this.data.data[i][this.data.labelIndex]);
//            }
//            while(window.chartColors.length<label.length)window.chartColors.push('rgb('+(255*Math.random())+', '+(255*Math.random())+', '+(255*Math.random())+')');
            this.chart = new this.Chart(canvas, Vue.mergeDeep({
                type: this.type,
                data:{
                    datasets: [],
                    labels: []
                },
                options: {
                    responsive: true,
                    maintainAspectRatio: false,
                    legend: {
                        display: true,
                        position: /*this.data.legendPosition?this.data.legendPosition:*/'top'
                    }
                }
            },me.dataFunc?me.dataFunc():{}));
        }
    }
});
Vue.directive('can', {
  // Cuando el elemento enlazado se inserta en el DOM...
  inserted(el) {
    // Enfoca el elemento
    el.focus()
  }
})