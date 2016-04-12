var resizeHndl, scrollBottomFixed, scrollParent, wnd, doc, prevTracingDot;

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

    $('.areaChartTotal_1').each(function (ind) {
        init_line_area3_chart($(this));
    });

}

function init_line_area3_chart(el) {

    el.find('svg').remove();

    var data = [
        {"date": "19-Apr-12", "close": 423600},
        {"date": "18-Apr-12", "close": 322100},
        {"date": "17-Apr-12", "close": 222100},
        {"date": "16-Apr-12", "close": 231300},
        {"date": "15-Apr-12", "close": 131300},
        {"date": "14-Apr-12", "close": 326400},
        {"date": "13-Apr-12", "close": 222900},
        {"date": "12-Apr-12", "close": 381800},
        {"date": "11-Apr-12", "close": 222900},
        {"date": "10-Apr-12", "close": 381800},
        {"date": "9-Apr-12", "close": 423600},
        {"date": "8-Apr-12", "close": 123600},
        {"date": "7-Apr-12", "close": 222100},
        {"date": "6-Apr-12", "close": 331300},
        {"date": "5-Apr-12", "close": 131300},
        {"date": "4-Apr-12", "close": 326400},
        {"date": "3-Apr-12", "close": 222900},
        {"date": "2-Apr-12", "close": 381800}
    ];

    var dates = [], values = [];

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        dates.push(moment(obj.date));
        values.push(obj.close);
    }

    //console.log(Math.min.apply(null, values), Math.max.apply(null, values));

    //console.log(moment.min(data));

    var margin = {top: 30, right: 35, bottom: 50, left: 100},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var tooltip = $('#tooltip'),
        tooltip_content = $('#tooltip_content');

    var bisectDate = d3.bisector(function (d) {
            //console.log(d);
            return d.date;
        }).left,
        parseDate = d3.time.format("%d-%b-%y").parse;

    //var currencyFormatter = d3.format(",.0f");
    
    var currencyFormatter = function (e) {
       return e.toString().replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1 ');
    };

    var x = d3.time.scale()
        .domain([moment.min(dates), moment.max(dates)])
        .range([0, width]);
    var y = d3.scale.linear()
        .domain([0, 1000 * Math.floor((Math.max.apply(null, values) / 1000) + 1)])
        .range([height, 0]);

    function make_y_axis() {
        return d3.svg.axis()
            .scale(y)
            .orient("left")
            .ticks(5)
    }

    function make_x_axis() {
        return d3.svg.axis()
            .scale(x)
            .orient("bottom")
            .ticks(5)
    }

    var line = d3.svg.line()
        .x(function (d) {
            return x(d.x);
        })
        .y(function (d) {
            return y(d.y);
        });

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
        })
        .interpolate("monotone");

    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        })
        .interpolate("monotone");

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(data.length - 1)
        .tickFormat(d3.time.format("%b %d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .tickFormat(function (d) {
            return d == 0 ? "" : currencyFormatter(d) + "$";
        })
        .orient("left");

    var svg = d3.select(el[0])
        .append("svg")
        .attr("width", width + margin.left + margin.right)
        .attr("height", height + margin.top + margin.bottom)
        .append("g")
        .attr("transform",
        "translate(" + margin.left + "," + margin.top + ")");

    svg.append("g")
        .attr("class", "x axis")
        .style("font-size", '14px')
        .style("fill", '#A5ADB3')
        .attr("transform", "translate(0," + height + ")")
        .call(xAxis);

    svg.append("g")
        .attr("class", "y axis")
        .attr("transform", "translate(" + (-25) + ", 0)")
        .style("font-size", '14px')
        .style("fill", '#A5ADB3')
        .attr("class", "grid")
        .call(yAxis);

    /*   svg.append("g")
     .attr("class", "gray_grid")
     .attr("transform", "translate(0," + height + ")")
     .call(make_x_axis()
     .tickSize(-height, 0, 0)
     .tickFormat("")
     );*/

    svg.append("g")
        .attr("class", "gray_grid")
        .call(make_y_axis()
            .tickSize(-width, 0, 0)
            .tickFormat("")
    );

    /*    svg.append("path")
     .data(data)
     .attr("class", "grid_line")
     .attr("d", line);*/

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
        .attr("stop-color", "#E0E8FF")
        .attr("stop-opacity", .8);

    gradient.append("svg:stop")
        .attr("offset", "100%")
        .attr("stop-color", "#f6f6f6")
        .attr("stop-opacity", 0);

    svg.append("path")
        .datum(data)
        .attr("class", "area area_v1")
        .attr("d", area)
        .style("fill", 'url(#area_gradient_1)');
    
    svg.append("path")
        .attr("class", "line line_v2")
        .attr("d", valueline(data));

    // Add the scatterplot

    svg.append("line")
        .attr("id", 'line_for_dot')
        .attr("class", 'line_for_dot')
        .style("stroke", "#D0E3EE")
        .style("stroke-width", "2")
        .attr("x1", 0)
        .attr("x2", 0)
        .attr("y1", height)
        .attr("y2", 0);

    var line_for_dot = d3.select('#line_for_dot');

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 0)
        .attr("data-y-value", function (d, i) {
            return y(d.close);
        })
        .attr('class', function (d, i) {
            return 'mark_v3 ';
            //return 'mark_v3 ' + (i == 0 || (i == data.length - 1) ? ' hidden' : '');
        })
        .attr('id', function (d, i) {
            return 'dot_' + i;
        })
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.close);
        });

    svg.append("circle")
        .attr("r", 10)
        .attr('id', 'big_dot')
        .attr('class', 'big_dot mark_v2')
        .attr("cx", 0)
        .attr("cy", 0);

    var tracing_anim_duration = 150, distance = x(data[0].date) - x(data[1].date), big_dot = d3.select('#big_dot');

    for (var i = 0; i < data.length; i++) {

        svg.append("rect")
            .attr("class", 'graph-tracing-catcher tracingCatcher')
            .attr("data-dot", '#dot_' + (data.length - i - 1))
            .style("opacity", 0)
            .attr("x", function () {
                return width - x(data[i].date);
            })
            .attr("y", 0)
            .attr("width", width)
            .attr("height", height)
            .style("transform", 'translate(' + (distance / -2) + 'px)')
            .on("mouseenter", function (e) {
                var $this = $(this),
                    dot_id = d3.select(this).attr('data-dot'),
                    cur_id = dot_id.replace(/\D/g, '') * 1,
                    cur_dot = $('#dot_' + (cur_id)),
                    x0 = area_x.invert(cur_dot.attr('cx')),
                    y0 = area_y.invert(cur_dot.attr('cy')).toFixed(0);

                if (prevTracingDot != void 0) {
                    big_dot
                        .transition()
                        .duration(tracing_anim_duration)
                        .attr("cx", $this.attr('x'))
                        .attr("cy", cur_dot.attr('data-y-value'));

                    line_for_dot
                        .transition()
                        .duration(tracing_anim_duration)
                        .attr("x1", $this.attr('x'))
                        .attr("x2", $this.attr('x'))
                        .attr("y2", cur_dot.attr('data-y-value'));

                    tooltip_content.empty()
                        .css('top', (cur_dot.attr('data-y-value') * 1 + margin.top - 15) + "px")
                        .append($('<div class="tooltip-title" />').text(moment(x0).format('dddd, D MMMM YYYY')))
                        .append($('<div class="tooltip-value" />').text(currencyFormatter(y0) + "$"));

                    tooltip
                        .css("left", ($this.attr('x') * 1 + margin.left) + "px");

                    splashTracing(cur_id, (cur_id > prevTracingDot ? 'left' : 'right'));
                }

            })
            .on("mouseleave", function (e) {
                var dot_id = d3.select(this).attr('data-dot');

                prevTracingDot = dot_id.replace(/\D/g, '') * 1;

            });
    }
}

function splashTracing(id, direction) {

    var new_r = 5;

    //console.log(id, direction);

    if (direction == 'right') {

        setTimeout(function () {
            var obj = $('#dot_' + (id + 1));
            //console.log('in', obj);
            obj.attr('r', new_r);
        }, 50 * 1);

        setTimeout(function () {
            var obj = $('#dot_' + (id * 1 + 1));
            //console.log('out', obj);
            obj.attr('r', 0);
        }, 300 + (50 * 1));

    } else if (direction == 'left') {
        setTimeout(function () {
            var obj = $('#dot_' + (id - 1));
            //console.log('in', obj);
            obj.attr('r', new_r);
        }, 50 * 1);

        setTimeout(function () {
            var obj = $('#dot_' + (id * 1 - 1));
            //console.log('out', obj);
            obj.attr('r', 0);
        }, 300 + (50 * 1));
    }
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
