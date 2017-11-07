function loadFunctions() {
    LoadForecastHourly();
    LoadCurrentWeather();
    LoadForecastDaily();
    LoadMusicalInfo();
    GetTodaysShows();

    setTimeout("location.reload(true);", 900000);
}

function LoadForecastDaily() {
    $.ajax({
        url: "http://api.wunderground.com/api/d95d7d9350ebe8f8/forecast/q/ND/Medora.json",
        dataType: 'json',
        error: function () { },
        success: function (data) {
            var numofForecastDays = 3,
                forecastData = data.forecast.simpleforecast.forecastday;

            var content = '<div class="ModuleHeader">' + "3 Day forecast" + '</div>';

            content += '<div class="ModuleContent" id="ForecastDailyContent">';
            content += '<table id="forecasttable">';

            content += '<th class="ForecastHeader">' + "Time  " + '</th>';
            content += '<th class="ForecastTempHeader">' + "  Temp  " + '</th>';

            for (var i = 0; i < numofForecastDays; i++) {
                content += '<tr class="ForecastRow">';
                content += '<td class="ForecastPeriodData">' + forecastData[i].date.weekday + '</td>';
                content += '<td class="ForecastTempData">' + forecastData[i].high.fahrenheit + "&#176;" + "F" + "/" + forecastData[i].low.fahrenheit + "&#176;" + "F" + '</td>';
                //content += '<td class="ForecastPicture"><img src="' + forecastData[i].icon_url + '">' + '</td>';
                content += '</tr>';
            }

            content += '</table>';
            content += '</div>';
            document.getElementById("ForecastDaily").innerHTML = content;

        }
    });
}

function LoadForecastHourly() {
    $.ajax({
        url: "http://api.wunderground.com/api/d95d7d9350ebe8f8/hourly/q/ND/medora.json",
        dataType: 'json',
        error: function () { },
        success: function (data) {
            var hourly = data.hourly_forecast,
                numofHours = 4;

            var content = '<div class = "ModuleHeader">' + "Hourly forecast" + '</div>';
            content += '<div class = "ModuleContent">';
            content += '<table id="Hourlytable">';

            content += '<th class="HourlyHeader">' + "Time  " + '</th>';
            content += '<th class="HourlyHeader">' + "  Temp.  " + '</th>';
            content += '<th class="HourlyHeaderWind">' + "  Wind " + '</th>';


            for (var i = 0; i < numofHours; i++) {
                var timestamp = hourly[i].FCTTIME.civil,
                    CurrentTemp = hourly[i].temp.english,
                    WindSpeed = hourly[i].wspd.english,
                    Direction = hourly[i].wdir.dir;

                content += '<tr class="HourlyRow">';
                content += '<td class="TimeStamp">' + timestamp + '</td>';
                content += '<td class="Temperature">' + CurrentTemp + "&#176;" + "F" + '</td>';
                content += '<td class="Windspeed">' + WindSpeed + " " + Direction + '</td>';
                content += '</tr>';
            }

            content += '</table>';
            content += '</div>';

            document.getElementById("ForecastHourly").innerHTML = content;
        }
    });
}

function LoadCurrentWeather() {
    $.ajax({
        url: "http://api.wunderground.com/api/d95d7d9350ebe8f8/conditions/q/ND/Medora.json",
        dataType: 'json',
        error: function () { },
        success: function (data) {
            var Temp = data.current_observation.temp_f,
                windSpeed = data.current_observation.wind_mph,
                windDirection = data.current_observation.wind_dir;

            if (Temp !== null) {
                document.getElementById("CurrentTemp").innerHTML = Temp + "&#176;" + "F";
            } else {
                document.getElementById("CurrentTemp").innerHTML = "Unavailable";
            }

            if (windSpeed != 0) {
                if (windSpeed !== null) {
                    document.getElementById("CurrentWind").innerHTML = windSpeed + " mph" + " " + windDirection;
                }
            }

        }
    });
}

function LoadMusicalInfo() {

    $.ajax({
        url: "/musical",
        dataType: 'html',
        error: function () { },
        success: function (data) {
            if (data === "No message to display") {
                document.getElementById("MusicalModule").innerHTML = "The Medora Musical is at 7:30pm Tonight.";
            } else {
                document.getElementById("MusicalModule").innerHTML = data;
            }
        }
    });
    //document.getElementById("MusicalModule").innerHTML = "The Musical is on time.";
}

function GetTodaysShows() {
    //document.getElementById("TodaysShows").innerHTML = "The Gospel Brunch Starts at 9:30 today" + "<br>" + "Jared Mason Live is at 1:30 today" + "<br>" + "TR Salute is at 3:30 Today";
    var shows = [
        {
            Show: "Gospel Brunch",
            Time: moment().hour(9).minute(30),
            PrintoutTime: "9:30AM",
            Days: ["Wed", "Fri", "Sat", "Sun"],
            Used: false,
        },

        {
            Show: "Jared Mason",
            Time: moment().hour(13).minute(30),
            PrintoutTime: "1:30PM",
            Days: ["Wed", "Thu", "Fri", "Sat", "Sun", "Mon"],
            Used: false,
        },

        {
            Show: "TR Salute",
            Time: moment().hour(15).minute(30),
            PrintoutTime: "3:30PM",
            Days: ["Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
            Used: false,
        }

    ];
    var ShowIds = [

        {
            ShowID: "4c95cc43-f10b-42a4-ad64-f3a80395194d",
            DisplayName: "TR Salute",
            Used: false
        },
        {
            ShowID: "5edc8c03-7c17-466e-ac8b-3e8099f3f9f5",
            DisplayName: "Jared Mason Live!",
            Used: false
        },
        {
            ShowID: "b2faba83-8a11-45aa-9c18-d0b4f5d68ede",
            DisplayName: "Gospel Brunch",
            Used: false
        },
    ];
    var ajaxUrl = ["/GB", "/JM", "/TR"];
    var ajaxDone;
    for (urls in ajaxUrl) {
        url = ajaxUrl[urls];
        var ShowIDsRequest = new XMLHttpRequest();
        ShowIDsRequest.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                var data = ShowIDsRequest.responseText;
                if (data != "No message to display") {
                    document.getElementById("TodaysShows").innerHTML += data + "<br>";
                    ShowIds[urls].Used = true;
                }
            }
        };
        ShowIDsRequest.open("GET", url, false);
        ShowIDsRequest.send();
    }
    var shows;
    var count = 0;
    for (var i = 0; i < ShowIds.length; i++) {
        if (ShowIds[i].Used == true) {
            count++;
        }
    }
    for (var i = count; i < ShowIds.length; i++) {
        var url = "http://tickets.medora.com/feed/events?json&showid=" + ShowIds[i].ShowID;
        var ShowIDsRequest = new XMLHttpRequest();
        ShowIDsRequest.onreadystatechange = function () {
            if (this.readyState == 4 && this.status == 200) {
                shows = JSON.parse(this.response);
            }
        };
        ShowIDsRequest.open("GET", url, false);
        ShowIDsRequest.send();

        var days = ["Sun", "Mon", "Tues", "Wed", "Thu", "Fri", "Sat"];
        var day = moment().format("ddd");
        var time = moment().format("h:mA");
        var ShowDays = shows.feed.Events.Event;
        var TimeTest = shows.feed.Events.Event[0].ActualEventDate
        TimeTest = moment(TimeTest);
        var test1 = moment(TimeTest).format('ddd h:mA');
        var test2 = moment().format('ddd h:mmA');
        var test3 = moment().startOf('day').add(15, 'h').add(35, 'm');
        if (moment(TimeTest).isBetween(moment().startOf('day'), moment().startOf('day').add(15, 'h').add(35, 'm'))) {
            document.getElementById("TodaysShows").innerHTML += "<li>" + ShowIds[i].DisplayName + " will be at " + moment(TimeTest).format("h:mA") + " Today </li></br>";
        }
        else if (moment(TimeTest).isAfter(moment().endOf('day'))) {
            document.getElementById("TodaysShows").innerHTML += "<li> The next " + ShowIds[i].DisplayName + " will be on " + moment(TimeTest).format('dddd') + " at " + moment(TimeTest).format("h:mA") + "</li></br>";
        }
    }
}