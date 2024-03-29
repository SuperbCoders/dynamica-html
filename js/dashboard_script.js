var resizeHndl, activeFamilyGraph = 0, dataFixture = [];

$(function ($) {

    for (var i = 0; i < 95; i++) {
        var date = moment().subtract(i, 'd');

        dataFixture.push({
            "date": date.format('D') + '-' + date.format('MMM') + '-' + date.format('YY'),
            "close": (Math.random() * 1000).toFixed(0)
        });
    }

    $('.datePicker').each(function () {
        var datePckr = $(this);

        datePckr.datepicker({
            multidate: 3,
            //clearBtn: true,
            toggleActive: true,
            startDate: '-477d',
            endDate: '0',
            orientation: "bottom left",
            format: 'M dd, yyyy',
            container: datePckr.parent(),
            multidateSeparator: ' – ',
            beforeShowDay: function (date, e) {
                var dataPicker = $(e.picker), dPickerElement = $(e.element),
                    dates = e.dates, curDate = moment(date),
                    rangeStart = moment(dates[0]), rangeEnd = moment(dates[1]);

                if (rangeStart.isAfter(rangeEnd)) {
                    dPickerElement.datepicker("setDates", [dates[1], dates[0]]).datepicker("update");
                }

                if (dates.length == 1) {
                    if (curDate.isSame(rangeStart, 'day')) return "start-range";
                }

                if (dates.length == 2) {

                    if (rangeStart.isAfter(rangeEnd, 'day')) {
                        rangeStart = [rangeEnd, rangeEnd = rangeStart][0];
                    }

                    if (curDate.isSame(rangeStart, 'day')) return "start-range";
                    if (curDate.isSame(rangeEnd, 'day')) return "end-range";
                    if (curDate.isBetween(rangeStart, rangeEnd)) return "in-range";
                }

                if (dates.length == 3) {
                    dPickerElement.datepicker("setDates", [dates[2]]).datepicker("update");
                }
            }
        }).on('show', function (e) {
            var calendar = $(this).datepicker("widget"), dates = e.dates;

            if (calendar.find('.btn').length) return;

            var buttonPane = $('<span class="calendar-control-holder" />');

            setTimeout(function () {
                var btn = $('<a class="apply-calendar-btn_ btn btn-block btn-danger" >Показать</a>');

                btn.off("click").on("click", function () {
                    loadGraphData();
                    return false;
                });

                buttonPane.appendTo(calendar);
                btn.appendTo(buttonPane);

            }, 1);

        }).on('changeDate', function (e, w) {


        });
    });

    $('body')
        .delegate('.bootstrap-select.filterSelect', 'hide.bs.dropdown', function () {
            $(this).closest('.hover-select-box').removeClass('opened');
        })
        .delegate('.bootstrap-select.filterSelect', 'click', function () {
            $(this).closest('.hover-select-box').addClass('opened');
        })
        .delegate('.dropdown.filterSelect', 'hide.bs.dropdown', function () {
            $(this).closest('.hover-select-box').removeClass('opened');
        })
        .delegate('.dropdown.filterSelect', 'click', function () {
            $(this).closest('.hover-select-box').addClass('opened');
        })
        .delegate('.filter-mod.hover-select-box .filterSelect.selectpicker', 'change', function () {
            $(this).closest('.filter-holder').addClass('current').siblings().removeClass('current');
        })
        .delegate('.hoverCatcher', 'mouseenter', function () {
            var firedEl = $($(this).attr('data-area'));

            activeFamilyGraph = $(this).attr('data-area').replace(/\D/g, '') * 1;

            firedEl.css('opacity', 1).siblings('.area').css('opacity', .15);

        })
        .delegate('.hoverCatcher', 'mouseleave', function () {
            var firedEl = $($(this).attr('data-area'));

            firedEl.css('opacity', .5).siblings('.area').css('opacity', .5);
        });

    $('.graphFilterDate').on('change', function () {
        var firedEl = $(this),
            datePckr = firedEl.closest('.datepickerComponent').find('.datePicker'),
            rangeStart, rangeEnd,
            newRange = firedEl.val(), today = moment();

        if (newRange == 0) {         //  Current month       
            rangeStart = moment(today).startOf('month');
            rangeEnd = moment(today).endOf('month');

        } else if (newRange == 1) {  //  Previous month 
            rangeStart = moment(today).subtract(1, 'month').startOf('month');
            rangeEnd = moment(today).subtract(1, 'month').endOf('month');

        } else if (newRange == 2) {  //  Last 3 month 
            rangeStart = moment(today).subtract(3, 'month');
            rangeEnd = moment(today);

        } else if (newRange == 3) {  //  Last 6 month 
            rangeStart = moment(today).subtract(6, 'month');
            rangeEnd = moment(today);

        } else if (newRange == 4) {  //  Last year 
            rangeStart = moment(today).subtract(12, 'month');
            rangeEnd = moment(today);

        } else if (newRange == 5) {  //  All time 
            rangeStart = moment(datePckr.datepicker('getStartDate'));
            rangeEnd = moment(datePckr.datepicker('getEndDate'));
        }

        datePckr.datepicker("setDates", [
            fit2Limits(datePckr, rangeStart, true),
            fit2Limits(datePckr, rangeEnd)
        ]).datepicker("update");

    }).change();

    $('.graphFilterDropDown a').on('click', function (e,r) {
         
        var firedEl = $(this),
            datePckr = firedEl.closest('.datepickerComponent').find('.datePicker'),
            rangeStart, rangeEnd,
            newRange = parseInt(firedEl.attr('data-value')), today = moment();

        if (newRange == 0) {         //  Current month       
            rangeStart = moment(today).startOf('month');
            rangeEnd = moment(today).endOf('month');

        } else if (newRange == 1) {  //  Previous month 
            rangeStart = moment(today).subtract(1, 'month').startOf('month');
            rangeEnd = moment(today).subtract(1, 'month').endOf('month');

        } else if (newRange == 2) {  //  Last 3 month 
            rangeStart = moment(today).subtract(3, 'month');
            rangeEnd = moment(today);

        } else if (newRange == 3) {  //  Last 6 month 
            rangeStart = moment(today).subtract(6, 'month');
            rangeEnd = moment(today);

        } else if (newRange == 4) {  //  Last year 
            rangeStart = moment(today).subtract(12, 'month');
            rangeEnd = moment(today);

        } else if (newRange == 5) {  //  All time 
            rangeStart = moment(datePckr.datepicker('getStartDate'));
            rangeEnd = moment(datePckr.datepicker('getEndDate'));
        }

        datePckr.datepicker("setDates", [
            fit2Limits(datePckr, rangeStart, true),
            fit2Limits(datePckr, rangeEnd)
        ]).datepicker("update");

    }).first().click();

});

function avgBuilder(arr, step) {
    var ret = [], part = (1 * (arr.length / step).toFixed(0));

    if (part < 2) return arr;

    for (var i = 0; i < arr.length; i += part) {

        var obj = arr.slice(i, i + (arr.length - part * 2 >= i ? part : arr.length)), val = 0;

        for (var j = 0; j < obj.length; j++) {
            val += 1 * obj[j].close;
        }

        ret.push({"close": 1 * (val / obj.length).toFixed(0), "date": arr[i].date});

        val = 0;

        if (!(arr.length - part * 2 >= i)) {
            //console.log('break', arr.length, i, part, obj.length);
            break;
        }
    }

    return ret;
}

function loadGraphData() {
    console.log('loadGraphData');

    $('.pageOverlay').addClass('show_overlay');

    setTimeout(function () {
        $('.pageOverlay').removeClass('show_overlay');
    }, 1500);

}

function fit2Limits(pckr, date, max) {
    var start = moment(pckr.datepicker('getStartDate')),
        end = moment(pckr.datepicker('getEndDate'));

    if (max) {
        return moment.max(start, date).startOf('day')._d;
    } else {
        return moment.min(end, date).startOf('day')._d;
    }
}


function init_charts() {

    var big_chart = [
        {
            "name": "Revenue",
            "color": "#6AFFCB", // green
            "value": "35,489$",
            "diff": "+8%",
            "data": [
                {"date": "9-Apr-12", "close": 180},
                {"date": "8-Apr-12", "close": 260},
                {"date": "7-Apr-12", "close": 218},
                {"date": "6-Apr-12", "close": 308},
                {"date": "5-Apr-12", "close": 400},
                {"date": "4-Apr-12", "close": 220},
                {"date": "3-Apr-12", "close": 329},
                {"date": "2-Apr-12", "close": 150}
            ]
        },
        {
            "name": "Orders",
            "color": "#FF1FA7", // violet
            "value": "490",
            "diff": "-9%",
            "data": [
                {"date": "9-Apr-12", "close": 240},
                {"date": "8-Apr-12", "close": 290},
                {"date": "7-Apr-12", "close": 368},
                {"date": "6-Apr-12", "close": 308},
                {"date": "5-Apr-12", "close": 150},
                {"date": "4-Apr-12", "close": 264},
                {"date": "3-Apr-12", "close": 120},
                {"date": "2-Apr-12", "close": 250}
            ]
        },
        {
            "name": "Products sell",
            "color": "#FF7045",  // orange
            "value": "9,483",
            "diff": "-9%",
            "data": [
                {"date": "9-Apr-12", "close": 340},
                {"date": "8-Apr-12", "close": 290},
                {"date": "7-Apr-12", "close": 368},
                {"date": "6-Apr-12", "close": 208},
                {"date": "5-Apr-12", "close": 313},
                {"date": "4-Apr-12", "close": 264},
                {"date": "3-Apr-12", "close": 129},
                {"date": "2-Apr-12", "close": 218}
            ]
        },
        {
            "name": "Unic users",
            "color": "#3BD7FF", // light blue
            "value": "109,330",
            "diff": "-1%",
            "data": [
                {"date": "9-Apr-12", "close": 326},
                {"date": "8-Apr-12", "close": 200},
                {"date": "7-Apr-12", "close": 318},
                {"date": "6-Apr-12", "close": 308},
                {"date": "5-Apr-12", "close": 120},
                {"date": "4-Apr-12", "close": 300},
                {"date": "3-Apr-12", "close": 250},
                {"date": "2-Apr-12", "close": 155}
            ]
        },
        {
            "name": "Customers",
            "color": "#FFD865", // yellow
            "value": "477",
            "diff": "+2",
            "data": [
                {"date": "9-Apr-12", "close": 126},
                {"date": "8-Apr-12", "close": 300},
                {"date": "7-Apr-12", "close": 218},
                {"date": "6-Apr-12", "close": 108},
                {"date": "5-Apr-12", "close": 213},
                {"date": "4-Apr-12", "close": 364},
                {"date": "3-Apr-12", "close": 129},
                {"date": "2-Apr-12", "close": 418}
            ]
        }
    ];

    init_donut_chart($('.donutChart_1'));

    // Главный график на дашборде
    $('.areaChartFamily_1').each(function (ind) {
        draw_general_graph($(this), big_chart);
    });

    $('.areaChart_1').each(function (ind) {
        init_area_chart($(this));
    });

    // Блочный график без точек
    $('.areaChart_2').each(function (ind) {
        draw_dotted_block_graps($(this));
    });

    // Блочные графики с точками
    $('.lineAreaChart_1').each(function (ind) {
        init_line_area_chart($(this), function (el) {
            el.parent().addClass('animated fadeInUp');
        });
    });

}


function init_line_area_chart(el, callback) {
    // графики с точками
    // return false;
    el.empty();

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var area_x = d3.time.scale().range([0, width]);
    var area_y = d3.scale.linear().range([height, 0]);

    var area = d3.svg.area()
        .x(function (d) {
            return area_x(d.date);
        })
        .y0(height)
        //.interpolate("cardinal")
        .y1(function (d) {
            return area_y(d.close);
        });

    var valueline = d3.svg.line()
        .x(function (d) {
            //console.log(d);
            return x(d.date);
        })
        .y(function (d) {
            //console.log(d);
            return y(d.close);
        });
    //.interpolate("cardinal");

    var svg = d3.select(el[0])
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var data = [
        {"date": "9-Apr-12", "close": 436},
        {"date": "7-Apr-12", "close": 221},
        {"date": "5-Apr-12", "close": 313},
        {"date": "4-Apr-12", "close": 264},
        {"date": "3-Apr-12", "close": 229},
        {"date": "2-Apr-12", "close": 218},
        {"date": "1-Apr-12", "close": 436}
    ];

    data = avgBuilder(dataFixture, 10);

    // Get the data
    data.forEach(function (d) {
        d.date = parseDate(moment(d.date).format('D-MMM-YY'));
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.close);
    })]);

    area_x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    area_y.domain([0, d3.max(data, function (d) {
        return d.close;
    })]);

    var gradient = svg.append("svg:defs")
        .append("svg:linearGradient")
        .attr("id", "area_gradient_1")
        .attr("x1", "0%")
        .attr("y1", "0%")
        .attr("x2", "0%")
        .attr("y2", "100%")
        .attr("spreadMethod", "pad");

    gradient.append("svg:stop")
        .attr("offset", "0%")
        .attr("stop-color", "#dfe7ff")
        .attr("stop-opacity", 1);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#f6f6f6")
        .attr("stop-opacity", 0);

    svg.append("path")
        .attr("class", "line")
        .attr("d", valueline(data));

    svg.append("path")
        .datum(data)
        .attr("class", "area area_v1")
        .attr("d", area)
        .style("fill", 'url(#area_gradient_1)');


    // Add the scatterplot
    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5.5)
        .attr('class', function (d, i) {
            var cls;

            if (i == 0 || (i == data.length - 1)) {
                cls = 'hidden'
            }

            return 'mark ' + cls;
        })
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.close);
        });

    if (typeof callback == 'function') callback(el);
}

function draw_dotted_block_graps(el) {
    // линии без точек
    // return false;
    el.empty();

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale().range([0, width]);
    var y = d3.scale.linear().range([height, 0]);

    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });

    var svg = d3.select(el[0])
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
            "translate(" + margin.left + "," + margin.top + ")");

    var data = [
        {"date": "9-Apr-12", "close": 436},
        {"date": "7-Apr-12", "close": 221},
        {"date": "5-Apr-12", "close": 313},
        {"date": "4-Apr-12", "close": 264},
        {"date": "3-Apr-12", "close": 229},
        {"date": "2-Apr-12", "close": 218}
    ];

    // Get the data
    data.forEach(function (d) {
        d.date = parseDate(d.date);
        d.close = +d.close;
    });

    // Scale the range of the data
    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));
    y.domain([0, d3.max(data, function (d) {
        return Math.max(d.close);
    })]);


    svg.append("path")
        .attr("class", "line")
        .attr("id", "blueLine")
        .attr("d", valueline(data));
}

function draw_general_graph(el, data_files, data_colors) {

    el.find('svg').remove();

    var legendBlock = el.parents('.graph-unit').find('.legend_v2');

    if (!legendBlock.length) {
        legendBlock = $('<ul class="legend_v2 graph-unit-legend" />');
        el.parents('.graph-unit').append(legendBlock);
    }

    legendBlock.empty();

    var dates = [], values = [];

    for (var i = 0; i < data_files[0].data.length; i++) {
        var obj = data_files[0].data[i];
        dates.push(moment(obj.date));
        values.push(obj.close);
    }

    var tooltip = $('<table class="graph-tooltip-table" />');

    var margin = {top: 80, right: 0, bottom: 30, left: 0},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var bisectDate = d3.bisector(function (d) {
            //console.log(d);
            return d.date;
        }).left,
        parseDate = d3.time.format("%d-%b-%y").parse;

    var area_x = d3.time.scale()
        .domain([moment.min(dates), moment.max(dates)])
        .range([0, width]);

    var area_y = d3.scale.linear()
        .domain([0, 1000 * Math.floor((Math.max.apply(null, values) / 1000) + 1)])
        .range([height, 0]);

    var area = d3.svg.area()
        .x(function (d) {
            return area_x(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return area_y(d.close);
        })
        .interpolate("monotone");

    var xAxis = d3.svg.axis()
        .scale(area_x)
        .ticks(dates.length - 1)
        .tickFormat(d3.time.format("%b %d"))
        .orient("bottom");

    //var xScale = d3.scale.ordinal()
    //    .domain(d3.range(dataset.length))
    //    .rangeRoundBands([0, w], 0.05);

    var svg = d3.select(el[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on('mousemove', function (d) {
            console.log(this);
                //console.log(d3.mouse(this));
                var tooltip = d3.select("#tooltip"),
                    tooltip_content = $("#tooltip_content"),
                    tooltip_dot = $("#tooltip_dot"),
                    tool_table = $('<table class="graph-tooltip-table" />'),
                    distance = area_x(data_files[activeFamilyGraph].data[0].date) - area_x(data_files[activeFamilyGraph].data[1].date) || 0,
                    x = d3.mouse(this)[0] + distance / 2,
                    x0 = area_x.invert(x),
                    ind;

                for (var k = 0; k < dates.length; k++) {
                    var obj1 = dates[k];

                    if (moment(x0).startOf('day').isSame(obj1, 'day')) {
                        ind = k;
                        break;
                    }
                }

                for (var j = 0; j < data_files.length; j++) {
                    var color = data_files[j].color, data = data_files[j].data;

                    //var i = bisectDate(data, x0, 1);

                    var tooltip_item = $('<tr class="tooltip_row" />').attr('data-graph', 'family_area_' + j)
                        .addClass(j == activeFamilyGraph ? 'active_row' : '')
                        .addClass($('.graph-unit-legend .legend_item[data-graph=#family_area_' + j + ']').hasClass('disabled') ? 'disabled' : '')
                        .append($('<td class="tooltip_name" />').append($('<div class="legend_name" />').css('color', color).append($('<span/>').text(data_files[j].name))))
                        .append($('<td class="tooltip_val" />').append($('<b class="" />').text(data_files[j].data[ind].close)));

                    tool_table.append(tooltip_item);
                }

                tooltip_content.empty()
                    .append($('<div class="tooltip-title" />').text(moment(x0).format('dddd, D MMMM YYYY')))
                    .append(tool_table);

                tooltip
                    .classed('flipped_left', x < tooltip_content.outerWidth() + 25)
                    .style("left", area_x(data_files[activeFamilyGraph].data[ind].date) + "px");

                tooltip_dot.css('top', margin.top + area_y(data_files[activeFamilyGraph].data[ind].close) - 11);
            }
        );

    svg.append("g")
        .attr("class", "x axis family_x_axis")
        .style("font-size", '14px')
        .style("fill", '#fff')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    for (var i = 0; i < data_files.length; i++) {
        var data = data_files[i].data;

        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });

        area_x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        area_y.domain([0, d3.max(data, function (d) {
            return d.close;
        })]);

        svg.append("path")
            .datum(data)
            .attr("class", "area area_v1")
            .attr("id", 'family_area_' + i)
            .attr("d", area)
            .style("fill", function (d) {

                var color = data_files[i].color,

                    legendItem = $('<li class="legend_item" />')
                        .append($('<div class="legend_name" />').css('color', color).append($('<span/>').text(data_files[i].name)))
                        .append($('<div class="legend_val" />')
                            .append($('<span class="val" />').text(data_files[i].value))
                            .append($('<sup class="graph-dynamica" />').addClass(/-/g.test(data_files[i].diff) ? 'dynamica_down' : 'dynamica_up').text(data_files[i].diff))),

                    tooltip_item = $('<tr class="tooltip_row" />').attr('data-graph', 'family_area_' + i)
                        .append($('<td class="tooltip_name" />').append($('<div class="legend_name" />').css('color', color).append($('<span/>').text(data_files[i].name))))
                        .append($('<td class="tooltip_val" />').append($('<b class="" />').text(data_files[i].value)));

                legendItem.attr('data-graph', '#family_area_' + i).on('click', function () {
                    var firedEl = $(this),
                        graph = d3.select(firedEl.attr('data-graph')),
                        tip = $(('.tooltip_row[data-graph=' + graph.attr('id') + ']')),
                        graph_cls = graph.attr('class');

                    if (/hidden/g.test(graph_cls)) {
                        firedEl.removeClass('disabled');
                        tip.removeClass('disabled');
                        graph.classed('hidden', false);
                    } else {
                        firedEl.addClass('disabled');
                        tip.addClass('disabled');
                        graph.classed('hidden', true);
                    }

                    return false;
                });

                tooltip.append(tooltip_item);

                legendBlock.append(legendItem);

                return color;
            })
            .style("opacity", .5)
            .on('mouseenter', function () {

            });
    }

    for (var i = 0; i < data_files.length; i++) {

        svg.append("rect")
            .attr("class", 'graph-hover-catcher hoverCatcher')
            .attr("data-area", '#family_area_' + i)
            .style("opacity", 0)
            .attr("transform", "translate(0,-" + margin.top + ")")
            .attr("x", 0)
            .attr("y", i * (100 / data_files.length) + '%')
            .attr("width", '100%')
            .attr("height", (100 / data_files.length) + '%');
    }
}

function init_area_chart(el) {
    // return false;
    el.empty();

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var area_x = d3.time.scale()
        .range([0, width]);

    var area_y = d3.scale.linear()
        .range([height, 0]);

    var area = d3.svg.area()
        .x(function (d) {
            return area_x(d.date);
        })
        .y0(height)
        .y1(function (d) {
            return area_y(d.close);
        });


    var svg = d3.select(el[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")");

    d3.tsv("data.tsv", function (error, data) {

        if (error) throw error;

        data.forEach(function (d) {
            d.date = parseDate(d.date);
            d.close = +d.close;
        });

        area_x.domain(d3.extent(data, function (d) {
            return d.date;
        }));
        area_y.domain([0, d3.max(data, function (d) {
            return d.close;
        })]);

        var gradient = svg.append("svg:defs")
            .append("svg:linearGradient")
            .attr("id", "area_gradient_1")
            .attr("x1", "0%")
            .attr("y1", "0%")
            .attr("x2", "0%")
            .attr("y2", "100%")
            .attr("spreadMethod", "pad");

        gradient.append("svg:stop")
            .attr("offset", "0%")
            .attr("stop-color", "#dfe7ff")
            .attr("stop-opacity", 1);

        gradient.append("svg:stop")
            .attr("offset", "100%")
            .attr("stop-color", "#f6f6f6")
            .attr("stop-opacity", 0);

        svg.append("path")
            .datum(data)
            .attr("class", "area area_v1")
            .attr("d", area)
            .style("fill", 'url(#area_gradient_1)');

    });

}

function init_donut_chart(el) {
    //return false;
    el.empty();

    var legendBlock = el.parent().find('.legend_v1');

    if (!legendBlock.length) {
        legendBlock = $('<ul class="legend_v1" />');
        el.after(legendBlock);
    }

    legendBlock.empty();

    var width = el.width(),
        height = el.height(),
        radius = Math.min(width, height) / 2;

    var arc = d3.svg.arc()
        .outerRadius(radius)
        .innerRadius(radius - 10);

    var pie = d3.layout.pie()
        .sort(null)
        .value(function (d) {
            return d.value;
        });

    var svg = d3.select(el[0]).append("svg")
        .attr("width", width)
        .attr("height", height)
        .append("g")
        .attr("transform", "translate(" + width / 2 + "," + height / 2 + ")");

    d3.csv("customers_data.csv", type, function (error, data) {
        if (error) throw error;

        var g = svg.selectAll(".arc")
            .data(pie(data))
            .enter().append("g")
            .attr("class", "arc");

        g.append("path")
            .attr("d", arc)
            .style("fill", function (d) {

                var color = d.data.color, legendItem = $('<li class="legend_item" />')
                    .append($('<div class="legend_name" />').css('color', color).append($('<span/>').text(d.data.name)))
                    .append($('<div class="legend_val" />').text(d.data.value));

                el.next().append(legendItem);
                return color;
            });
    });

    function type(d) {
        d.value = +d.value;
        return d;
    }
}


$(window).resize(function () {

    clearTimeout(resizeHndl);

    resizeHndl = setTimeout(function () {
        init_charts();
    }, 10);

}).load(function () {

    init_charts();

});
