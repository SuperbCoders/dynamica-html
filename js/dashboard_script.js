var resizeHndl;

$(function ($) {

    /*    selectReadyTicker = setInterval(function () {

     var $selectpicker = $('.filterSelect');


     $selectpicker.each(function (ind) {
     var slct = $(this).data('selectpicker').$newElement;

     if (slct != void 0) {
     clearInterval(selectReadyTicker);

     console.log($(this), slct);
     }

     //slct.on('hide.bs.dropdown', function (e) {
     //    console.log('hide');
     //});
     //
     //slct.on('hidden.bs.dropdown', function (e) {
     //    console.log('hide');
     //});
     });

     }, 500);*/

    $('.datePicker').datepicker({
        beforeShowYear: function (date) {
            if (date.getFullYear() == 2007) {
                return false;
            }
        }
    });

    $('body')
        .delegate('.bootstrap-select.filterSelect', 'hide.bs.dropdown', function () {
            $(this).closest('.hover-select-box').removeClass('opened');
        })
        .delegate('.bootstrap-select.filterSelect', 'click', function () {
            $(this).closest('.hover-select-box').addClass('opened');
        });

    $('.graphFilterDate').on('change', function () {
        var firedEl = $(this);

        console.log(firedEl.val());

        return false;
    });


});

function init_charts() {

    var big_chart = [
        {
            "name": "Revenue",
            "color": "#86f3b7",
            "value": "35,489$",
            "diff": "+8%",
            "data": [
                {"date": "9-Apr-12", "close": 180},
                {"date": "7-Apr-12", "close": 221},
                {"date": "5-Apr-12", "close": 400},
                {"date": "4-Apr-12", "close": 320},
                {"date": "3-Apr-12", "close": 229},
                {"date": "2-Apr-12", "close": 150}
            ]
        },
        {
            "name": "Orders",
            "color": "#4C89FF",
            "value": "490",
            "diff": "-9%",
            "data": [
                {"date": "9-Apr-12", "close": 240},
                {"date": "7-Apr-12", "close": 368},
                {"date": "5-Apr-12", "close": 150},
                {"date": "4-Apr-12", "close": 264},
                {"date": "3-Apr-12", "close": 120},
                {"date": "2-Apr-12", "close": 250}
            ]
        },
        {
            "name": "Products sell",
            "color": "#FF8E64",
            "value": "9,483",
            "diff": "-9%",
            "data": [
                {"date": "9-Apr-12", "close": 436},
                {"date": "7-Apr-12", "close": 221},
                {"date": "5-Apr-12", "close": 313},
                {"date": "4-Apr-12", "close": 264},
                {"date": "3-Apr-12", "close": 229},
                {"date": "2-Apr-12", "close": 218}
            ]
        },
        {
            "name": "Unic users",
            "color": "#6CDFFF",
            "value": "109,330",
            "diff": "-1%",
            "data": [
                {"date": "9-Apr-12", "close": 336},
                {"date": "7-Apr-12", "close": 260},
                {"date": "5-Apr-12", "close": 120},
                {"date": "4-Apr-12", "close": 300},
                {"date": "3-Apr-12", "close": 250},
                {"date": "2-Apr-12", "close": 155}
            ]
        },
        {
            "name": "Customers",
            "color": "#FFE164",
            "value": "477",
            "diff": "+2",
            "data": [
                {"date": "9-Apr-12", "close": 136},
                {"date": "7-Apr-12", "close": 321},
                {"date": "5-Apr-12", "close": 213},
                {"date": "4-Apr-12", "close": 364},
                {"date": "3-Apr-12", "close": 129},
                {"date": "2-Apr-12", "close": 418}
            ]
        }
    ];

    init_donut_chart($('.donutChart_1'));

    $('.areaChartFamily_1').each(function (ind) {
        init_area_family_chart($(this), big_chart);
    });

    $('.areaChart_1').each(function (ind) {
        init_area_chart($(this));
    });

    $('.areaChart_2').each(function (ind) {
        init_line_chart($(this));
    });

    $('.lineAreaChart_1').each(function (ind) {
        init_line_area_chart($(this));
    });

    $('.areaChart_3').each(function (ind) {
        init_line_area2_chart($(this));
    });
}

function init_line_area2_chart(el) {

    el.empty();

    var margin = {top: 0, right: 0, bottom: 0, left: 0},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var data = [436, 221, 313, 264, 229, 218];

    var scale = {
        x: d3.scale.linear().domain([0, data.length]).range([0, width]),
        y: d3.scale.linear().domain([0, d3.max(data)]).range([height, 15])
    };

    var chart = d3.select(el[0])
        .append('svg:svg')
        .data([data])
        .attr('width', width)
        .attr('height', height)
        .append('svg:g');

    var line = d3.svg.area().x(function (d, i) {
        return scale.x(i);
    })
        .y(function (d) {
            return scale.y(d);
        }).y0(height).interpolate("cardinal");

    var gradient = chart.append("svg:defs")
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

    chart.append('svg:path')
        .attr('d', function (d, i) {
            return line(d, i);
        }).style("fill", 'url(#area_gradient_1)');


    chart.selectAll('circle.mark').data(data).enter().append('svg:circle')
        .attr('class', 'mark')
        .attr('cx', function (d, i) {
            return scale.x(i);
        })
        .attr('cy', function (d) {
            return scale.y(d);
        })
        .attr('r', 5.5)

}

function init_line_area_chart(el) {

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

}

function init_line_chart(el) {

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

function init_area_family_chart(el, data_files, data_colors) {

    el.empty();

    var legendBlock = el.parents('.graph-unit').find('.legend_v2');

    if (!legendBlock.length) {
        legendBlock = $('<ul class="legend_v2 graph-unit-legend" />');
        el.parents('.graph-unit').append(legendBlock);
    }

    legendBlock.empty();

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
            .attr("d", area)
            .style("fill", function (d) {

                var color = data_files[i].color,
                    legendItem = $('<li class="legend_item" />')
                        .append($('<div class="legend_name" />').css('color', color).append($('<span/>').text(data_files[i].name)))
                        .append($('<div class="legend_val" />')
                            .append($('<span class="val" />').text(data_files[i].value))
                            .append($('<sup class="graph-dynamica" />').addClass(/-/g.test(data_files[i].diff) ? 'dynamica_down' : 'dynamica_up').text(data_files[i].diff)));

                legendBlock.append(legendItem);
                return color;
            })
            .style("opacity", .6);
    }

}

function init_area_chart(el) {

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