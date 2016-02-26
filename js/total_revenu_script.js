var resizeHndl, scrollBottomFixed, scrollParent, wnd, doc;

$(function ($) {

    wnd = $(window);
    doc = $(document);
    scrollParent = $('.scrollParent');
    scrollBottomFixed = $('.scrollBottomFixed');

    $('.datePicker').each(function () {
        var datePckr = $(this);

        datePckr.datepicker({
            multidate: 2,
            //clearBtn: true,
            toggleActive: true,
            startDate: '-477d',
            endDate: '0',
            orientation: "bottom left",
            format: 'M dd, yyyy',
            container: datePckr.parent(),
            //multidateSeparator: ' — ',
            multidateSeparator: ' – ',
            beforeShowDay: function (date, e) {
                var dates = e.dates, curDate = moment(date),
                    rangeStart = moment(dates[0]), rangeEnd = moment(dates[1]);

                if (dates.length == 2) {

                    if (rangeStart.isAfter(rangeEnd, 'day')) {
                        rangeStart = [rangeEnd, rangeEnd = rangeStart][0];
                    }

                    if (curDate.isSame(rangeStart, 'day')) return "start-range";
                    if (curDate.isSame(rangeEnd, 'day')) return "end-range";
                    if (curDate.isBetween(rangeStart, rangeEnd)) return "in-range";
                }
            }
        }).on('show', function (e) {

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

function PrefixedEvent(element, type, callback) {


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

    el.empty();

    var data = [
        {"date": "9-Apr-12", "close": 4236},
        {"date": "7-Apr-12", "close": 2221},
        {"date": "5-Apr-12", "close": 1313},
        {"date": "4-Apr-12", "close": 3264},
        {"date": "3-Apr-12", "close": 2229},
        {"date": "2-Apr-12", "close": 3818}
    ];

    var dates = [], values = [];

    for (var i = 0; i < data.length; i++) {
        var obj = data[i];
        dates.push(moment(obj.date));
        values.push(obj.close);
    }

    //console.log(Math.min.apply(null, values), Math.max.apply(null, values));

    //console.log(moment.min(data));

    var margin = {top: 30, right: 35, bottom: 50, left: 80},
        width = el.width() - margin.left - margin.right,
        height = el.height() - margin.top - margin.bottom;

    var parseDate = d3.time.format("%d-%b-%y").parse;

    var commasFormatter = d3.format(",.0f");

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
        });

    var valueline = d3.svg.line()
        .x(function (d) {
            return x(d.date);
        })
        .y(function (d) {
            return y(d.close);
        });
    //.interpolate("cardinal");

    var xAxis = d3.svg.axis()
        .scale(x)
        .ticks(data.length - 1)
        .tickFormat(d3.time.format("%b %d"))
        .orient("bottom");

    var yAxis = d3.svg.axis()
        .scale(y)
        .ticks(5)
        .tickFormat(function (d) {
            return d == 0 ? "" : commasFormatter(d) + "$";
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
        .enter().append("line")
        .attr("class", function (d, i) {
            var cls = '';

            if (i == 0 || (i == data.length - 1)) cls = ' hidden';

            return 'line_for_dot_' + i + cls;
        })
        .style("stroke", "#D0E3EE")
        .style("stroke-width", "2")
        .style("display", 'none')
        .attr("x1", function (d) {
            return x(d.date);
        })
        .attr("x2", function (d) {
            return x(d.date);
        })
        .attr("y1", height)
        .attr("y2", function (d) {
            return y(d.close);
        });

    svg.selectAll("dot")
        .data(data)
        .enter().append("circle")
        .attr("r", 5.5)
        .attr("data-line", function (d, i) {
            return 'line_for_dot_' + i;
        })
        .attr('class', function (d, i) {
            var cls = '';

            if (i == 0 || (i == data.length - 1)) cls = 'hidden';

            return 'mark_v2 vis_on_hover ' + cls;
        })
        .attr("cx", function (d) {
            return x(d.date);
        })
        .attr("cy", function (d) {
            return y(d.close);
        }).on('mouseenter', function () {
            var firedEl = $(this);
            $('.' + firedEl.addClass('vis').attr('data-line')).show();

        }).on('mouseleave', function () {
            var firedEl = $(this);
            $('.' + firedEl.attr('data-line')).hide();

        });

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
