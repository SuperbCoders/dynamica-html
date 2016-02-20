var resizeHndl;

$(function ($) {

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

    });


});

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

$(window).resize(function () {

    clearTimeout(resizeHndl);

    resizeHndl = setTimeout(function () {
        init_charts();
    }, 10);

}).load(function () {

    init_charts();

});