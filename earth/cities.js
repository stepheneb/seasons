var cities = [
    {
        name: "Vancouver",
        country: "Canada",
        active: false,
        location: {
            signed_latitude: 49.25,
            latitude: 49.25,
            lat_dir: "N",
            longitude: 123.1,
            long_dir: "W",
            elev: 34
        },
        average_temperatures: [2.1, 4.0, 4.9, 9.1, 12.7, 17.4, 19.6, 18.1, 15.7, 10.0, 7.1, 2.1],
        source: "http://climate.weatheroffice.gc.ca/climateData/monthlydata_e.html?Prov=XX&timeframe=3&StationID=889&Month=1&Day=1&Year=2009&cmdB1=Go"
    },

    {
        name: "Anchorage",
        country: "United States",
        active: true,
        location: {
            signed_latitude: 61.21,
            latitude: 61.21,
            lat_dir: "N",
            longitude: 149.9,
            long_dir: "W",
            elev: 19
        },
        average_temperatures: [-10.5, -7.5, -5, 2, 8, 12, 15, 13.5, 9, 2, -6, -10.5],
        source: "http://www.climatetemp.info/usa/anchorage-alaska.html"
    },

    {
        name: "San Francisco",
        country: "United States",
        active: true,
        location: {
            signed_latitude: 37.77,
            latitude: 37.77,
            lat_dir: "N",
            longitude: 122.42,
            long_dir: "W",
            elev: 26
        },
        average_temperatures: [9, 10.5, 12, 13, 15, 16, 17, 17, 18, 16, 13, 10],
        source: "http://www.climatetemp.info/usa/san-francisco-california.html"
    },

    {
        name: "Miami",
        country: "United States",
        active: false,
        location: {
            signed_latitude: 25.75,
            latitude: 25.75,
            lat_dir: "N",
            longitude: 80.25,
            long_dir: "W",
            elev: 1
        },
        average_temperatures: [19, 20, 22, 24, 26, 27, 28, 28, 28, 26, 23, 20],
        source: "http://www.climatetemp.info/usa/miami-florida.html"
    },

    {
        name: "Galapagos Island",
        country: "Chile",
        active: true,
        location: {
            signed_latitude: -0.75,
            latitude: 0.75,
            lat_dir: "S",
            longitude: 91.1,
            long_dir: "W",
            elev: 184
        },
        average_temperatures: [26, 26.5, 27, 27, 26, 24, 22, 21.5, 21, 22, 23, 24],
        source: "http://www.climatetemp.info/galapagos-islands/"
    },

    {
        name: "Rio de Janeiro",
        country: "Brazil",
        active: false,
        location: {
            signed_latitude: -27.75,
            latitude: 27.75,
            lat_dir: "S",
            longitude: 43.25,
            long_dir: "W",
            elev: 13
        },
        average_temperatures: [25.5, 26.5, 26, 25, 22, 22, 21, 22, 23, 24, 25, 26],
        source: "http://www.climatetemp.info/brazil/rio-de-janeiro.html"
    },

    {
        name: "Rio Gallegos",
        country: "Argentina",
        active: false,
        location: {
            signed_latitude: -51.65,
            latitude: 51.65,
            lat_dir: "S",
            longitude: 69.25,
            long_dir: "W",
            elev: 12
        },
        average_temperatures: [12.5, 11.5, 11, 8, 4, 1, 1, 2.5, 6, 9, 11, 12],
        source: "http://www.climatetemp.info/argentina/rio-gallegos.html"
    },
    
    {
        name: "Melbourne",
        country: "Australia",
        active: true,
        location: {
            signed_latitude: -37.8,
            latitude: 37.8,
            lat_dir: "S",
            longitude: 144.95,
            long_dir: "E",
            elev: 15
        },
        average_temperatures: [20, 20, 19, 16, 12, 11, 10, 10.5, 13, 14, 17, 18],
        source: "http://www.climatetemp.info/australia/melbourne.html"
    },
    
    {
        name: "McMurdo Station",
        country: "Antarctica",
        active: true,
        location: {
            signed_latitude: -77.88,
            latitude: 77.88,
            lat_dir: "S",
            longitude: 166.73,
            long_dir: "E",
            elev: 24
        },
        average_temperatures: [-2.9, -9.5, -18.2, -20.7, -21.7, -23, -25.7, -26.1, -24.6, -18.9, -9.7, -3.4, -16.9],
        source: "http://www.coolantarctica.com/Antarctica%20fact%20file/antarctica%20environment/climate_graph/vostok_south_pole_mcmurdo.htm"
    },
    

];
