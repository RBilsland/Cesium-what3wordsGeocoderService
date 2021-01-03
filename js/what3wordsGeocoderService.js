/**
 * A custom geocoder providing geocoding through the what3words convert-to-coordinates API.
 * @alias what3wordsGeocoder
 * @constructor
 */
function what3wordsGeocoderService() { }

/**
 * The function called to geocode using this geocoder service.
 *
 * @param {String} input The query to be sent to the geocoder service
 * @returns {Promise<GeocoderService.Result[]>}
 */
what3wordsGeocoderService.prototype.geocode = function (input) {
    // A RegEx representing a valid what3words location
    var regex = /^\/{0,}[^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]{1,}[・.。][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]{1,}[・.。][^0-9`~!@#$%^&*()+\-_=[{\]}\\|'<,.>?/";:£§º©®\s]{1,}$/;

    if (regex.test(input)) {
        var convertResource = new Cesium.Resource({
            url: "https://api.what3words.com/v3/convert-to-coordinates",
            queryParameters: {
                key: "1KA9ISHZ",
                //key: "Insert_Your_what3words_API_Key_Here",
                words: input,
                format: "geojson",
            },
        });

        return convertResource.fetchJson().then(function (results) {
            var bboxDegrees;
            return results.features.map(function (resultObject) {
                bboxDegrees = resultObject.bbox;
                return {
                    displayName: "///" + resultObject.properties.words,
                    destination: Cesium.Rectangle.fromDegrees(
                        bboxDegrees[0],
                        bboxDegrees[1],
                        bboxDegrees[2],
                        bboxDegrees[3]
                    ),
                };
            });
        });
    }
};
