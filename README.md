# jquery-parking-map

## Options

<table>
 <thead>
 <tr>
  <th>parameter</th>
  <th>value</th>
  <th>description</th>
 </tr>
</thead>
<tbody>
 <tr>
  <td>`parkwhizKey` (required)</td>
  <td>string</td>
  <td>API key provided on http://www.parkwhiz.com/developers/ after signing up for an account.</td>
 </tr>
 <tr>
  <td>`location` (required)</td>
  <td>
    Object with these keys:<br />
    `destination` (string) street address
    <br />*OR*<br />
    `lat` (number) and `lng` (number)
    <br />*OR*<br />
    `venue` (string URL)
  </td>
  <td>
    The location for which the user will be looking for parking.
    <br />
    e.g. `{ destination: "208 S. Jefferson St, Chicago, IL 60661" }`
    <br />*OR*<br />
    `{ lat: 41.878598, lng: -87.638836 }`
    <br />*OR*<br />
    `{ venue: "united-center-parking" }` (corresponding to https://www.parkwhiz.com/united-center-parking/)
  </td>
 </tr>
 <tr>
  <td>`showTimePicker`</td>
  <td>boolean, default true</td>
  <td>This only applies if `location` is an address or lat/lng..  Should the date+time picker be shown?</td>
 </tr>
 <tr>
  <td>`showChosenEvent`</td>
  <td>boolean, default true</td>
  <td>This only applies if `location` is a venue.  Should the name of the current event be shown?</td>
 </tr>
 <tr>
  <td>`showLocationMarker`</td>
  <td>boolean, default true</td>
  <td>Should a marker be shown on the `location` position?</td>
 </tr>
 <tr>
  <td>`defaultTime`</td>
  <td>Object with these keys:
   <br />
   `start` and `end` unix timestamps
   <br />*OR*<br />
   `hours` number of hours
   <br /><br />
   Default is `{ hours: 3 }`.
  </td>
  <td>This only applies if `location` is an address or lat/lng. <br /><br />e.g. `{ start: 1383847222, end: 1383858022 }` - specific time range.
  <br />*OR*<br />
  `{ hours: 6 }` from roughly now for a 6 hour duration. (start time will be the nearest hour or half hour).
 </td>
 </tr>
 <tr>
  <td>`event`</td>
  <td>string event URL</td>
  <td>This only works if `location` is a venue.  If provided, the map will pre-load with price markers for the given event. Otherwise, if no event is chosen the map will load with "P" markers and require you to choose an event before seeing prices.
  <br />
  e.g. `"/2010-5-27-7pm-boston-red-sox-vs-kansas-city-royals/"`
  </td>
 </tr>
 <tr>
  <td>`loadFirstEvent`</td>
  <td>boolean, default false</td>
  <td>This only works if `location` is a venue.  If true, the first event for the given venue will be used to populate prices. Otherwise, if no event is chosen the map will load with "P" markers and require you to choose an event before seeing prices.</td>
 </tr>
 <tr>
  <td>`showEventList`</td>
  <td>boolean, default true</td>
  <td>This only works if `location` was set to use a venue with `venue_id`.</td>
 </tr>
 <tr>
  <td>`width`</td>
  <td>CSS string</td>
  <td>e.g. `90%`</td>
 </tr>
 <tr>
  <td>`height`</td>
  <td>CSS string</td>
  <td>e.g. `500px`</td>
 </tr>
 <tr>
  <td>`zoom`</td>
  <td>number</td>
  <td>Zoom level as described here: https://developers.google.com/maps/documentation/javascript/tutorial</td>
 </tr>
 <tr>
  <td>`additionalMarkers`</td>
  <td>Object</td>
  <td>
   Value will be passed through to http://gmap3.net/en/catalog/10-overlays/marker-41
   <br />
   e.g. 
```
   {
    values: [
      [49.28952958093682, 6.152559438984804],
      {
        latLng:[44.28952958093682, 6.152559438984804],
        options:{
          icon: "http://maps.google.com/mapfiles/marker_green.png"
        }
      },
      [49.28952958093682, -1.1501188139848408],
      {
        latLng:[44.28952958093682, -1.1501188139848408],
        events:{
          click:function(){
            alert("I'm the last one, and i have my own click event");
          }
        }
      }
    ],
    events:{ // events trigged by markers 
      click: function(){
        alert("Here is the default click event");
      }
    }
```
   </td>    
 </tr>
</tbody>
</table>

