<script>
import Vue from 'vue'
//const { _, axios } = window;
import axios from 'axios';

const template = `
	<div :class={reflow:reflow} :key="'v-table-'+keyBody" :style={width:width}
    class="v-datatable v-resize">
    <template v-if="active">
		<div v-if="hasSlot('header')" class="v-datatable-header v-widget-header ui-corner-top"><slot name="header"></slot>
		</div>
		<div v-if="pagination" class="v-paginator v-paginator-top v-widget-header v-paginator-pages center">
		
		<v-button value="|<" :disabled="page<=1" v-on:click.prevent="to(1)"/>
        <v-button value="<" v-on:click.prevent="to(page-1)" :disabled="page<=1"/>
        <div style="padding:3px 8px;display:inline-block">
            <input type="number" v-on:change="to(page,true)" style="width:60px" min="1" :max="pages" v-model="page"/> / {{pages}}
        </div>
		<v-button value=">" v-on:click.prevent="to(page+1)" :disabled="page==pages"/>
            <v-button v-on:click.prevent="to(pages)" value=">|" :disabled="page==pages"/>
			</div>
		<div v-if="scrollable0" class="v-widget-header v-datatable-scrollable-header" style="position:relative">
		<div class="v-datatable-scrollable-header-box" style=""></div></div>
		<div :class="{'v-datatable-scrollable-body':scrollable0}">
		<table class="v-table" :style="{width:width}" v-if="columns">
			<thead>
            <tr>
                <th v-if="selectable0" :width="getCheckColumnWidth" >
                    <span class="v-check" v-on:click="rowSelect(null,-10)" :data-icon="selected.length?'square-check':'square'">
                        <i class="fa fa-lg" :class="selected.length?'fa-square-check':'fa-square'"></i>
                    </span>
                </th>
                <th :class="k['h-class']" v-for="k in columns" :width="k.width" v-on:click="sortBy(k)">
                    <div v-html="k.header"></div>
                </th>
			</tr>
            </thead>
			<tbody class="v-datatable-data" :key="kc" >
                 <template v-for="(groupItem) in groupedData">
                    <tr v-if="hasSlot('header-group')" class="v-header-group">
                        <slot name="header-group" :group="groupItem"></slot>
                    </tr>
                    <tr v-for="(entry,r) in groupItem.values" @row="rowCreated(entry)" @click="_selectRow($event,entry,r)" 
                        :class="getRowClass(entry,r)">
                        <td v-if="selectable0" width="18" class="center">
                            <span :data-index="r" class="v-check" v-on:click="rowSelect(entry,r)"
                            :data-icon="isSelected(entry)?'square-check':'square'"><i class="far fa-lg" :class="isSelected(entry,r)?'fa-square-check':'fa-square'" ></i></span>
                        </td>
                        <slot :row="entry" :index="r+(page-1)*paginatio_"></slot>
                    </tr>

                    <tr v-if="hasSlot('footer-group')" class="v-footer-group">
                        <slot name="footer-group" :group="groupItem" ></slot>
                    </tr>
 <template v-if="hasSlot('extra-group')" >
                        <slot name="extra-group" :group="groupItem" :groups="groupedData"></slot>
                    </template>
                 </template>

				<tr v-if="!sortedData||sortedData.length==0">
					<td :colspan="columns.length+(selectable0?1:0)">{{emptyMessage}}</td>
				</tr>
			</tbody>
		</table>
		</div>
		<div v-if="summary||hasSlot('summary')" class="v-table-summary" :class="{'v-datatable-scrollable-body':scrollable}">
			<table class="v-table v-table-summary"><tr>
			<td v-if="selectable0" :width="getCheckColumnWidth" ></td>
			<slot name="summary" :data="sortedData"></slot>
			</tr></table>
		</div>
		<div class="hide filters"><slot name="filters"></slot><slot name="columns"></slot></div></template></div>
`;
const compiledTemplate = Vue.compile(template);
export default {
    props: {
        value: Array,
        filterKey: String,
        reflow: null,
        summary: null,
        src: String,
        gql: null,
        filters: Object,
        store: null,
        width: null,
        emptyMessage: { default: 'No existen registros' },
        rowKey: { default: 'id' },
        rowStyleClass: String,
        groups: { default: '' },
        pagination: null,
        selectable: { default: true },
        scrollable: null,
        autoload: {
            default: true
        }
    },

    data() {
        var sortOrders = {};
        return {
            data: [],
            sorter: null,
            sortDir: 1,
            pages: 1,
            resizeAfterUpddate: 0,
            page: 1,
            active: 0,
            selectable0: 1,
            scrollable0: 0,
            kc: 1,
            keyBody: 1,
            columns: null,
            row: {},
            hasFilters: 0,
            kt: 0,
            size: null,
            sortKey: '',
            selected: [],
            paginatio_: 0,
            remoteLoaded: null,
            loaded: false,
            sortOrders: sortOrders,
            rowStyleClassFunc: null
        };
    },
    render(createElement) {
        var me = this, columns = [];

        if (!me.def) me.def = me.$scopedSlots.default;
        var children = me.def({ row: {} });
        if (children) {
            //me.columns=[];
            children.forEach((e) => {
                var column = e.data.attrs;
                if (e.children) {
                    e.children.filter((e) => e.tag == 'v-filter').forEach((e2) => {
                        column.filter = e2;
                        me.hasFilters = 1;
                        //console.log(createElement('div',column.filter));
                        e.children.shift();
                        //console.log(createElement('div',column.filter));
                    });
                    e.children.filter((e) => e.tag == 'v-footer').forEach((e2) => {
                        column.footer = e2;
                        e.children.shift();
                    });
                }
                columns.push(column);
            });
            if (!me.columns)
                me.columns = columns;
            //console.log(columns);
            me.co = columns;
        }
        //se altera el virtual don of each row deleting v-filters
        me.$scopedSlots.default = function (r, r2, r3) {
            let item = me.def(r, r2, r3);
            item.forEach((e) => {
                delete e.data.attrs.header;
                delete e.data.attrs.width;
                if (e.children) {
                    e.children.filter((e) => e.tag == 'v-filter').forEach(() => {
                        me.hasFilters = 1;
                        e.children.shift();
                    });
                    e.children.filter((e) => e.tag == 'v-footer').forEach(() => {
                        e.children.shift();
                    });
                }
            });
            return item;
        };
        //console.log('render');
        var ct = compiledTemplate.render.call(this, createElement);
        //console.log(ct.children);
        //Se agregan los filtros a las columnas
        me.co.forEach(e => { if (e.filter) ct.children[ct.children.length - 1].children.push(e.filter) });
        return ct;
    },
    computed: {
        getCheckColumnWidth() {
            return 36;//18;
        },
        filteredData() {
            const me = this;
            const _=window._;
            //console.log('========>_='+_);
            let data = me.data, f, v;
            data = data.filter(item => {
                for (let key in me.filters) {
                    f = me.filters[key];
                    if (typeof f === 'function') {
                        if (!f(item)) {
                            return 0;
                        }
                    } else if (f && typeof f === 'string' && key in item) {
                        v = item[key];
                        if (typeof v === 'string') {
                            v = v.toUpperCase().normalize('NFD').replace(/[\u0300-\u036f]/g, "");
                            if (!v.includes(f.toUpperCase())) {
                                //console.log(v+'  no contains2 '+f.toUpperCase()+' '+v.includes(f.toUpperCase()));
                                return 0;
                            }
                        }
                    }
                }
                return 1;
            });
            data.sum = _.sum;
            return data;
        },
        groupedData() {
            const sum = function (keyOrIndex) {
                return this.reduce((total, item) => {
                    if (typeof keyOrIndex === 'number') {
                        return total + (item[keyOrIndex] || 0);
                    } else if (typeof keyOrIndex === 'string') {
                        return total + (item[keyOrIndex] || 0);
                    }
                    return total;
                }, 0);
            }
            Array.prototype.sum = sum;
            const grouped = {}, groupKeys = this.groups, sortedData = this.sortedData || [];
            //console.log('=====', groupKeys);
            if (groupKeys) {
                sortedData.forEach(row => {
                    const group = row[groupKeys];
                    if (!grouped[group]) {
                        const g = [];
                        g.sum = sum
                        grouped[group] = g;

                    }
                    grouped[group].push(row); // ✅ Copia para evitar referencias directas
                });
            } else {
                grouped[''] = sortedData;
            }
            return Object.entries(grouped).map(([group, values]) => ({
                name: group,
                values
            }));
        },
        sortedData() {
            let me = this, data = me.filteredData, aa;
            const _=window._;
            data = me.sorter ? data.sort((a, b) => {
                b = b[me.sorter];
                b = b ? b : 0;
                a = a[me.sorter];
                aa = Number(a);
                if (aa) a = aa;
                if (a < b) return -1 * me.sortDir;
                else if (a > b) return 1 * me.sortDir;
                else return 0;
            }) : data;
            data.sum = _.sum;
            return data;
        }
    },
    mounted() {
        var me = this;
        //console.log('mounted');
        //me.columns.forEach(e=>{console.log(e.filter)});
        //console.log(me.$el.querySelectorAll('.v-datatable-scrollable-header-box > th'));
        var h = me.$el.style ? me.$el.style.height : null;
        if (h) {
            me.scrollable0 = 1;
            //console.log('scroll for '+me.$el.id);
            me.resizeAfterUpddate = 1;
        }
        if (me.$parent.tabs) {
            me.$el.addEventListener("tabChange", (e) => {
                me.active = 1;
                var k = e.$target.k;
                if (me.kt != k) {
                    me.load();
                    me.kt = k;
                }
            });
        }
        if (me.active) {
            me.buildColumns();
            if (me.autoload === true) me.load();
        }
        me.$el.addEventListener("parentResize", (e) => {

            me.resize(e.height);
        });
        me.$el.addEventListener("command", (e) => {
            switch (e.name) {
                case 'refresh':
                    if (!e.key || me.$el.getAttribute('refresh') != e.key) {
                        me.load();
                        me.$el.getAttribute('refresh', e.key);
                        break;
                    }
            }
        });
        if (h) {
            me.resize(parseInt(h));
        } else {
            // me.resize(me.$el.offsetHeight);
        }
        //console.log('mointed');
    },
    created() {
        var me = this;

        //Si el padre el un tabview debe considerarse q no se esta en la pestaña activa y no deberia cargarse
        if (!(me.$parent.tabs)) {
            //el padre es un tab
            me.active = 1;
        }
        var s = ('' + me.selectable);
        me.selectable0 = (s != 'false' && s != '0') ? 1 : 0;
        s = ('' + me.scrollable);
        me.scrollable0 = (me.scrollable && s != 'false' && s != '0') ? 1 : 0;
        me.paginatio_ = me.pagination ? me.pagination : 0;
        if (me.rowStyleClass) eval('me.rowStyleClassFunc=function(row){return ' + me.rowStyleClass + '}');
    },
    beforeUpdate() {
        var me = this;
        if (me.active) {
            me.buildColumns();
            if (me.value) {
                if (me.remoteLoaded == null)
                    me.data = me.value;
            }
        }
    },
    updated() {
        var me = this;
        const _=window._;
        if (me.resizeAfterUpddate) {
            me.resize(parseInt(me.$el.style.height));
            me.resizeAfterUpddate = 0;
        }

        me.paginatio_ = me.pagination ? me.pagination : 0;
        var t = me.$el.querySelectorAll(".v-table");
        var p = me.$el.querySelectorAll(".v-datatable-scrollable-header-box")[0];
        if (p) {
            //console.log(me.co);
            var clonedHeader = me.$el.querySelectorAll(".v-cloned-header");
            if (clonedHeader.length === 0) {
                clonedHeader = document.createElement("table");
                var originalHeader = t[0].querySelectorAll("thead")[0];


                var maxLabelHeight = 0;
                var ca = document.createElement('canvas');
                var cs = window.getComputedStyle(p);
                var ctx = ca.getContext("2d");
                ctx.font = cs.fontSize + " PTSans";
                //var filtersMap = {};
                var listener = (event) => {
                    if (event.keyCode === 13) {
                        event.preventDefault();
                        me.load();
                    }
                }
                let th = originalHeader.childNodes[0].querySelectorAll("th");
                me.columns.forEach(e => {
                    if (e.filter) {
                        e.filter.elm.querySelectorAll('input').forEach(e => e.addEventListener("keyup", listener));
                    }
                });
                let ht = new _.HTML2Canvas({ lineHeight: parseInt(cs.lineHeight), ctx: ctx }), i, tw = 0;
                th.forEach((e, i) => {
                    e.childNodes[0].onclick = sortClick;
                    var f = me.columns[(i - (me.selectable0 ? 1 : 0))];
                    //cltd.setAttribute("ind", '' + (i - (me.selectable0?1:0)));
                    if (f && f.filter && f.filter.elm) {
                        //console.log(f.filter.elm.children);
                        //console.log(typeof f.filter.elm.children);
                        if (f.filter.elm.children.forEach)
                            f.filter.elm.children.forEach(ef => e.appendChild(ef));
                        else
                            for (let ef of f.filter.elm.children) {
                                e.appendChild(ef);
                            }
                    } else if (i > 0 && me.hasFilters) {
                        var input = document.createElement("input");
                        input.disabled = "disabled";
                        input.className = "center"; // set the CSS class
                        e.appendChild(input);
                    }

                    if (e.clientHeight > maxLabelHeight)
                        maxLabelHeight = e.clientHeight;
                    tw += parseInt(e.width);
                    var hh = e.childNodes[0].offsetHeight;
                    hh = ht.heightText(e.childNodes[0].textContent, parseInt(e.width));
                    e.childNodes[0].style.width = e.width + 'px';
                    e.childNodes[0].style.display = 'table-cell';
                    e.childNodes[0].style.verticalAlign = 'middle';
                    if (hh > maxLabelHeight) maxLabelHeight = hh;
                });
                th.forEach((e, i) => {
                    if (i) e.childNodes[0].style.height = maxLabelHeight + 'px';
                    clonedHeader.appendChild(e);
                });
                th.forEach((e) => {
                    var e2 = document.createElement('th');
                    e2.width = e.width;
                    originalHeader.childNodes[0].appendChild(e2);
                });
                t[0].style.width = tw + 'px';
                t[0].width = tw;
                //console.log(t);
                if (t.length > 1) {
                    t[1].style.width = tw + 'px';
                    t[1].width = tw;
                    t[0].parentNode.style.overflowX = 'hidden';
                    t[0].parentNode.style.position = 'relative';
                    t[0].style.position = 'absolute';
                    t[0].parentNode.style.height = '150px'
                    t[1].parentNode.addEventListener("scroll", (e) => {
                        var horizontal = e.currentTarget.scrollLeft;
                        p.style.left = "-" + horizontal + "px";
                        t[0].style.left = "-" + horizontal + "px";
                    });
                    var ts = t[1].querySelectorAll('td');
                    //se debe considerar las columnas agregadas como el selector
                    for (i = 0; i < th.length; i++) {
                        if (ts[i])
                            ts[i].style.width = th[i].width + 'px';
                    }
                } else {

                    t[0].parentElement.addEventListener("scroll", (e) => {
                        var horizontal = e.currentTarget.scrollLeft;
                        p.style.left = "-" + horizontal + "px";
                    });
                }
                clonedHeader.style.width = tw + 'px';
                var sortClick = (e) => {
                    var sort = me.columns[e.target.parentNode.getAttribute("ind")].sort;
                    if (sort == me.sorter) me.sortDir = me.sortDir * -1;
                    me.sorter = sort;
                };

                clonedHeader.className = "v-cloned-header v-table";
                p.appendChild(clonedHeader);
                p.appendChild(p.firstChild);
                p.style.position = 'absolute';
                //no se para q agrego 37  -------
                p.style.height = (maxLabelHeight + 37 - 37) + 'px';
                //.v-widget-header
                p.parentElement.style.height = p.style.height;

                if (me.$el.style.maxHeight)
                    p.parentElement.nextElementSibling.style.maxHeight = (parseInt(me.$el.style.maxHeight) - maxLabelHeight) + 'px';

                originalHeader.className = 'v-head-cloned';
            }
            //resize();
        }
        let i, svg = me.$el.querySelectorAll('.v-check > svg');
        for (i = 0; i < svg.length; i++) {
            //square-check':'square
            svg[i].dataset.icon = svg[i].parentNode.dataset.icon;
        }
        if (me.loaded) {
            var group = me.$el.querySelectorAll('.group');
            for (var k = 0; k < group.length; k++) {
                group[k].parentNode.removeChild(group[k]);
            }
            me.$emit('updated', me);
            me.loaded = 0;
        }
    },
    filters: {
        capitalize(str) {
            return str ? (str.charAt(0).toUpperCase() + str.slice(1)) : str;
        },
        rowSelectedCount() {
            return this.selected.length;
        }
    },
    watch: {
        kc() {
            var me = this;
            setTimeout(function () {
                me.$emit('updated', me);
            }, 100);
        }
    },
    methods: {
        cli(e) {
            this.$emit('click', e)
        },
        buildColumns() { },
        resize(h) {
            var el = this.$el;
            setTimeout(() => {
                //h=el.style.maxHeight?Math.min(parseInt(el.style.maxHeight,10),h):h;
                var e = el.querySelector(".v-datatable-header");
                if (e) h -= e.offsetHeight;
                e = el.querySelector(".v-paginator");
                if (e) h -= e.offsetHeight;
                e = el.querySelector(".v-datatable-scrollable-header");
                if (e) {
                    e.style.height = e.querySelector("table").offsetHeight + 'px';
                    h -= e.offsetHeight;
                }
                e = el.querySelector(".v-table-summary");
                if (e) {
                    h -= e.offsetHeight;
                }
                e = el.querySelector(".v-datatable-scrollable-body");
                const scrollbarWidth = e.offsetWidth - e.clientWidth;
                e.style.overflowY = 'auto';
                e.style.height = h + 'px';

                e = el.querySelector(".v-datatable-scrollable-header-box");
                if (e) {
                    e.parentNode.style.marginRight = scrollbarWidth + 'px';
                }
                e = el.querySelector(".v-table-summary");
                if (e) {
                    e.style.overflowY = 'hidden';
                    e.style.marginRight = scrollbarWidth + 'px';
                }

            }, 100);
        },
        to(n, v) { this.loadP(n, v) },
        loadP(n, v) {
            var m = this;
            //console.log('m.page != n=' + (m.page != n));
            if (m.page != n || v) {
                m.page = n;
                m.load()
            }
        },
        rowCreated(/*r*/) {
            /*this.$parent.$parent.row=r;
             console.log(this.$parent.$parent.row);
             this.$emit('row',r);*/
        },
        hasSlot(name = 'default') {
            return !!this.$slots[name] || !!this.$scopedSlots[name];
        },
        sortBy(/*key*/) {
            //this.sortKey = key
            //this.sortOrders[key] = this.sortOrders[key] * -1
        },
        isSelected(row) {
            return this.selected.contains(row);//this.selected.contains(rowIndex);
        },
        getRowClass(row) {
            const me = this, cls = [];
            //if (me.selectable && me.isSelected(rowIndex)) cls.push('v-selected');
            if (me.selectable && me.isSelected(row)) cls.push('v-selected');
            if (me.rowStyleClassFunc) cls.push(me.rowStyleClassFunc(row));
            return cls;
        },
        _selectRow(event, row, rowIndex) {
            const _=window._;
            const me = this;
            if (me.selectable0 && _.whichChild(event.target) == 0)
                return;
            this.rowSelect(row, rowIndex, 1);
        },
        rowSelect(row, rowIndex, c) {
            const me = this;
            //Click en select all
            if (rowIndex === -10) {
                if (me.filteredData.length === me.selected.length) {
                    me.selected = [];
                } else {
                    me.selected = me.filteredData.map((value) => value);
                }
            } else if (c) {
                if (this.selectable0 || !me.selected.contains(row))//!me.selected.contains(rowIndex))
                    me.selected = [row];//[rowIndex];
                else {
                    me.selected = [];
                    row = null;
                }
            } else if (!me.selected.contains(row)) {
                me.selected.push(row);
                //} else if (!me.selected.contains(rowIndex)) { me.selected.push(rowIndex);
            } else {
                //me.selected.splice(me.selected.indexOf(rowIndex), 1);
                me.selected.splice(me.selected.indexOf(row), 1);
                row = null;
            }
            //const selection = me.selected.sort((a, b) => { return a - b; }).map(value=>me.data[value]);
            const selection = me.selected;
            me.$emit('row-select', { target: me, current: row, selection });
        },
        async getStoredList(store) {
            let p = new Promise((resolve) => {
                var t = window._.db.transaction(store), objectStore = t.objectStore(store);//,d=[];
                var r = objectStore.getAll();
                r.onsuccess = function () {
                    resolve(r.result);
                }
                //t.onerror = event => reject(event.target.error);
            });
            try {
                let result = await p;
                //console.log(result);
                return result;
            } catch (e) {
                alert("Error al cargar el store: "+store+"!");
                throw e;
            }
        },
        async loadStore() {
            var me = this, store = me.store;
            if (store != null) {
                var datj;
                if (window._.db) datj = await me.getStoredList(store);
                if (!datj) datj = [];
                me.data = me.data ? datj.concat(me.data) : datj;
            }
            return me.data;
        },
        load(/*s*/) {
            var me = this;
            const _=window._;
            this.selected = [];
            if (me.value) {
                me.data = me.value;
            }
            if (me.src) {
                var s = me.src;
                if (!s)//esto deberia darse si 
                    return;
                //s = me.$root.apiLink(window.location.pathname);
                if (s.endsWith("/"))
                    s = s.slice(0, s.length - 1);
                var pagination = me.pagination;
                if (pagination) {

                    s += '/' + (me.page - 1) * pagination + '/' + (me.pagination);
                }
                if (_.networkStatus.connected) {
                    var request;
                    if (me.gql) {
                        var gql = me.gql;
                        var query = ('query{' + Object.keys(gql)[0] + '(offset:' + ((me.page - 1) * pagination)
                            + ' limit:' + (me.pagination) + '){\ndata{' + gql[Object.keys(gql)[0]] + '}\nsize\n}\n}');

                        request = axios.post(me.src, { query: query });
                    } else {
                        request = axios.get(s, { params: _.clean(me.filters) });
                    }


                    request.then((r) => {
                        const _=window._;
                        if (r.data && r.data.error) {
                            _.MsgBox(r.data.error);
                        } else {
                            var re = r.data;
                            if (me.gql) {
                                //console.log(r.data);
                                //console.log(Object.keys(me.gql)[0]);
                                re = r.data.data[Object.keys(me.gql)[0]];
                            }
                            me.data = re.data || re;
                            if (re && Object.prototype.hasOwnProperty.call(re, 'size') && pagination) {
                                me.pages = Math.ceil(re.size / pagination);
                                if (me.page > me.pages)
                                    me.page = 1;
                                me.size = re.size;
                            }
                            //console.log('======');
                            //console.log(me.data);
                            me.loadStore();
                            me.$emit('loaded', { target: me });
                            me.$emit('row-select', {});
                            me.remoteLoaded = 1;
                            me.loaded = 1;
                            me.kc++;
                        }
                    }).catch(me.error);
                } else {
                    me.data = [];
                    var result = me.loadStore();
                    if (result.then) result.then(result => { me.data = result });
                    me.$emit('row-select', { target: me });
                }
            } else {
                me.data = [];
                me.loadStore();
                me.$emit('loaded', { target: me });
            }
            me.kc++;
            me.loaded = 1;
        },
        filter() {
            alert(12);
        }
    }
}
</script>