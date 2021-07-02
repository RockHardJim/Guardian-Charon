$(function() {

        var ctx = $("#chart");
        var data = {
            labels: ["2006", "2007", "2008", "2009", "2010", "2011", "2012", "2013", "2014", "2015"],
            datasets: [{
                label: "",
                fill: false,
                tension: 0,
                backgroundColor: "#fafbfe",
                borderColor: "#249def",
                borderWidth: 2,
                borderCapStyle: 'butt',
                borderDash: [],
                borderDashOffset: 0.0,
                borderJoinStyle: 'miter',
                pointBorderColor: "#249def",
                pointBackgroundColor: "#fff",
                pointBorderWidth: 2,
                pointRadius: 5,
                pointHoverRadius: 5,
                pointHoverBackgroundColor: "#090d15",
                pointHoverBorderColor: "#090d15",
                pointHoverBorderWidth: 2,
                pointHitRadius: 10,
                data: [300000, 550000, 490000, 500000, 550000, 1000000, 900000, 870000, 800000, 870000]
            }]
        };
        var myChart = new Chart(ctx, {
            type: 'line',
            data: data,
            options: {
                responsive: false,
                legend: {
                    display: false
                },
                scales: {
                    yAxes: [{
                        display: false,
                        ticks: {
                            suggestedMax: 1400000
                        }
                    }],
                    xAxes: [{
                        ticks: {
                            maxRotation: 0,
                            fontColor: "#090d15",
                            fontFamily: 'PT Sans',
                            fontSize: 12,
                            paddingTop: 1000
                        },
                        gridLines: {
                            color: "#e0e4f0",
                            zeroLineColor: "#e0e4f0",
                            drawTicks: false,
                            drawBorder: false
                        }
                    }]
                },
                tooltips: {
                    backgroundColor: "#090d15",
                    titleFontSize: 11,
                    titleMarginBottom: 1,
                    titleFontStyle: '300',
                    cornerRadius: 12,
                    xPadding: 11,
                    yPadding: 6,
                    caretSize: 0,
                    tooltipXOffset: 100,
                    callbacks: {
                        title: function(tooltipItem, data) {
                            // console.log(tooltipItem);

                            return tooltipItem[0].yLabel;

                        },
                        label: function() {}
                    }
                },
                maintainAspectRatio: false,
                responsive: true
            }
        });

    });