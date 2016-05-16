var resizeHndl, scrollBottomFixed, scrollParent, wnd, doc, activeFamilyGraph = 0;

$(function ($) {

    wnd = $(window);
    doc = $(document);
    scrollParent = $('.scrollParent');
    scrollBottomFixed = $('.scrollBottomFixed');

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
                    dPickerElement.datepicker("setDates", [e.dates[1], e.dates[0]]).datepicker("update");
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
            var calendar = $(this).datepicker("widget");

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
        .delegate('.filter-mod.hover-select-box .filterSelect.selectpicker', 'change', function () {
            $(this).closest('.filter-holder').addClass('current').siblings().removeClass('current');
        });

    $('.sortHeader').on('click', function (e) {
        var firedEl = $(this),
            sortBtn = firedEl.closest('.sortBlock').find('.sortBtn');

        if (sortBtn.hasClass('sorting')) return;

        if ($(e.target).hasClass('sortBtn')) {
            $(e.target).toggleClass('sort_desc');
        } else {

            if (firedEl.find('.sortBtn').length) {
                firedEl.find('.sortBtn').toggleClass('sort_desc');
                return false;

            } else {
                sortBtn.one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function () {
                    firedEl.find('.sortCatcher').append($(this).removeClass('sorting').attr('style', ''));
                });

                sortBtn.addClass('sorting').css('left', firedEl.find('.sortCatcher').offset().left - sortBtn.offset().left + sortBtn.css('marginLeft').replace('px', '') * 1);
            }
        }

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


});

function animEndFunc(catcher) {
    console.log(catcher.find('.sortCatcher'));
    catcher.append($(this).removeClass('sorting').attr('style', ''));
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

    var race_chart = {
        items: {
            "IE": "#ffd056",
            "Chrome": "#27c385",
            "Firefox": "#6c67e2",
            "Safari": "#97f079",
            "Opera": "red"
        },
        data: [{
            "date": "13-Oct-11",
            "IE": "41.62",
            "Chrome": "22.36",
            "Firefox": "25.58",
            "Safari": "9.13",
            "Opera": "1.22"
        }, {
            "date": "14-Oct-11",
            "IE": "41.95",
            "Chrome": "22.15",
            "Firefox": "25.78",
            "Safari": "8.79",
            "Opera": "1.25"
        }, {
            "date": "15-Oct-11",
            "IE": "37.64",
            "Chrome": "24.77",
            "Firefox": "25.96",
            "Safari": "10.16",
            "Opera": "1.39"
        }, {
            "date": "16-Oct-11",
            "IE": "37.27",
            "Chrome": "24.65",
            "Firefox": "25.98",
            "Safari": "10.59",
            "Opera": "1.44"
        }, {
            "date": "17-Oct-11",
            "IE": "42.74",
            "Chrome": "21.87",
            "Firefox": "25.01",
            "Safari": "9.12",
            "Opera": "1.17"
        }, {
            "date": "18-Oct-11",
            "IE": "42.14",
            "Chrome": "22.22",
            "Firefox": "25.26",
            "Safari": "9.1",
            "Opera": "1.19"
        }, {
            "date": "19-Oct-11",
            "IE": "41.92",
            "Chrome": "22.42",
            "Firefox": "25.3",
            "Safari": "9.07",
            "Opera": "1.21"
        }, {
            "date": "20-Oct-11",
            "IE": "42.41",
            "Chrome": "22.08",
            "Firefox": "25.28",
            "Safari": "8.94",
            "Opera": "1.18"
        }, {
            "date": "21-Oct-11",
            "IE": "42.74",
            "Chrome": "22.23",
            "Firefox": "25.19",
            "Safari": "8.5",
            "Opera": "1.25"
        }, {
            "date": "22-Oct-11",
            "IE": "36.95",
            "Chrome": "25.45",
            "Firefox": "26.03",
            "Safari": "10.06",
            "Opera": "1.42"
        }, {
            "date": "23-Oct-11",
            "IE": "37.52",
            "Chrome": "24.73",
            "Firefox": "25.79",
            "Safari": "10.46",
            "Opera": "1.43"
        }, {
            "date": "24-Oct-11",
            "IE": "42.69",
            "Chrome": "22.14",
            "Firefox": "24.95",
            "Safari": "8.98",
            "Opera": "1.15"
        }, {
            "date": "25-Oct-11",
            "IE": "42.31",
            "Chrome": "22.26",
            "Firefox": "25.1",
            "Safari": "9.04",
            "Opera": "1.2"
        }, {
            "date": "26-Oct-11",
            "IE": "42.22",
            "Chrome": "22.28",
            "Firefox": "25.17",
            "Safari": "9.08",
            "Opera": "1.16"
        }, {
            "date": "27-Oct-11",
            "IE": "42.62",
            "Chrome": "22.36",
            "Firefox": "24.98",
            "Safari": "8.8",
            "Opera": "1.15"
        }, {
            "date": "28-Oct-11",
            "IE": "42.76",
            "Chrome": "22.36",
            "Firefox": "25.05",
            "Safari": "8.55",
            "Opera": "1.19"
        }, {
            "date": "29-Oct-11",
            "IE": "38.92",
            "Chrome": "24.36",
            "Firefox": "25.34",
            "Safari": "9.99",
            "Opera": "1.3"
        }, {
            "date": "30-Oct-11",
            "IE": "38.06",
            "Chrome": "24.58",
            "Firefox": "25.63",
            "Safari": "10.26",
            "Opera": "1.39"
        }, {
            "date": "31-Oct-11",
            "IE": "42.1",
            "Chrome": "22.45",
            "Firefox": "25.18",
            "Safari": "8.97",
            "Opera": "1.2"
        }]
    };

    $('.areaChartTotal_1').each(function (ind) {
        draw_general_graph_2($(this), race_chart);
    });

}

function draw_general_graph_2(el, data_files) {

    el.find('svg').remove();

    var legendBlock = el.parents('.graph-unit-holder').find('.legend_v2');

    if (!legendBlock.length) {
        legendBlock = $('<ul class="legend_v2 graph-unit-legend" />');
        el.parents('.graph-unit').append(legendBlock);
    }

    var dates = [], area_x,
        items = data_files.items,
        data = data_files.data,
        colors = [], names = [];

    for (var key in items) {
        if (items.hasOwnProperty(key)) {
            names.push(key);
            colors.push(items[key]);
        }
    }

    for (var i = 0; i < colors.length; i++) {
        var obj = doc[i];

    }
    
    var tooltip = $('<table class="graph-tooltip-table" />');

    var margin = {top: 30, right: 35, bottom: 30, left: 75},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var formatPercent = d3.format(".0%"),
        parseDate = d3.time.format("%d-%b-%y").parse;

    var x = d3.time.scale()
        .range([0, width]);

    var y = d3.scale.linear()
        .range([height, 0]);

    var color = d3.scale.ordinal()
        .domain(names)
        .range(colors);

    var xAxis = d3.svg.axis()
        .scale(x)
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .orient("left")
        .tickFormat(formatPercent)
        .tickValues([0, 1]);

    var area = d3.svg.area()
        .x(function (d) {
            return x(d.date);
        })
        .y0(function (d) {
            return y(d.y0);
        })
        .y1(function (d) {
            return y(d.y0 + d.y);
        });

    var stack = d3.layout.stack()
        .values(function (d) {
            return d.values;
        });

    var svg = d3.select(el[0]).append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform", "translate(" + margin.left + "," + margin.top + ")")
        .on('mousemove', function (d) {
                var tooltip = d3.select("#tooltip"),
                    tooltip_content = $("#tooltip_content"),
                    tooltip_dot = $("#tooltip_dot"),
                    tool_table = $('<table class="graph-tooltip-table" />'),
                    distance = area_x(data_files.data[0].date) - area_x(data_files.data[1].date) || 0,
                    x = d3.mouse(this)[0] - distance / 2,
                    x0 = area_x.invert(x),
                    ind;

                for (var k = 0; k < dates.length; k++) {
                    var obj1 = dates[k];

                    if (moment(x0).startOf('day').isSame(obj1, 'day')) {
                        ind = k;
                        break;
                    }
                }

                var p = data_files.data[k];

                var index = 0;

                for (var key in p) {

                    if (p.hasOwnProperty(key)) {

                        if (key !== 'date') {
                            var tooltip_item = $('<tr class="tooltip_row" />')
                                .append($('<td class="tooltip_name" />').append($('<div class="legend_name" />').css('color', colors[index]).append($('<span/>').text(key))))
                                .append($('<td class="tooltip_val" />').append($('<b class="" />').text(p[key])));

                            tool_table.prepend(tooltip_item);
                            index++;
                        }
                    }
                }
            
                tooltip_content.empty()
                    .append($('<div class="tooltip-title" />').text(moment(x0).format('dddd, D MMMM YYYY')))
                    .append(tool_table);

                tooltip
                    .classed('flipped_left', x < tooltip_content.outerWidth() + 60)
                    //.style("top", "50%")
                    .style("left", (area_x(data_files.data[k].date) - distance) + "px");

            }
        );

    color.domain(d3.keys(data[0]).filter(function (key) {
        return key !== "date";
    }));

    data.forEach(function (d) {
        d.date = parseDate(d.date);
        dates.push(moment(d.date));
    });

    var browsers = stack(color.domain().map(function (name) {
        return {
            name: name,
            values: data.map(function (d) {
                return {date: d.date, y: d[name] / 100};
            })
        };
    }));

    x.domain(d3.extent(data, function (d) {
        return d.date;
    }));

    var browser = svg.selectAll(".browser")
        .data(browsers)
        .enter().append("g")
        .attr("class", "browser");

    browser.append("path")
        .attr("class", "area")
        .attr("d", function (d) {
            return area(d.values);
        })
        .style("fill", function (d) {
            return color(d.name);
        });

    svg.append("g")
        .attr("class", "x axis")
        .attr("transform", "translate(0," + height + ")")
        .style('fill', '#a5adb3')
        .style('font-size', '14px')
        .style('font-weight', '300')
        .call(xAxis)
        .selectAll("text")
        .attr("y", 18);

    svg.append("g")
        .attr("class", "y axis")
        .style('fill', '#a5adb3')
        .style('font-size', '14px')
        .style('font-weight', '300')
        .call(yAxis)
        .selectAll("text")
        .attr("y", 0)
        .attr("x", -75)
        .style("text-anchor", "start");

    area_x = d3.time.scale()
        .domain([moment.min(dates), moment.max(dates)])
        .range([0, width]);
    
}

$(window).resize(function () {

    clearTimeout(resizeHndl);

    resizeHndl = setTimeout(function () {
        init_charts();
    }, 10);

}).load(function () {

    init_charts();

}).scroll(function () {

    if (scrollParent.offset().top - doc.scrollTop() + scrollBottomFixed.height() + scrollBottomFixed.css('marginTop').replace('px', '') * 1 <= wnd.height()) {
        scrollBottomFixed.addClass('table-footer-fixed').removeClass('table-footer-bottom');
    }

    if (scrollParent.offset().top - doc.scrollTop() > wnd.height() - scrollBottomFixed.height() * 2) {
        scrollBottomFixed.removeClass('table-footer-fixed').removeClass('table-footer-bottom');
    }

    if (doc.scrollTop() + wnd.height() - scrollBottomFixed.height() >= scrollParent.offset().top + scrollParent.height()) {
        scrollBottomFixed.removeClass('table-footer-fixed').addClass('table-footer-bottom');
    }

});
