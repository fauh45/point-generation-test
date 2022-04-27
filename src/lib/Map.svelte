<script lang="ts">
  import { GeoJSONSource, Map } from "maplibre-gl";
  import "maplibre-gl/dist/maplibre-gl.css";
  import {
    halfenMultiLineGeoJSONMultiPoints,
    pointsToGeoJSONFeatureCollection,
  } from "./geojson";
  import { onDestroy, onMount } from "svelte";

  export let points: Array<[number, number]> = [];
  export let randomRadius: number = 0.015;
  export let halfenRecursion: number = 2;

  let map: Map;
  let mapContainer: HTMLDivElement;

  let mousePos: string;

  onMount(() => {
    map = new Map({
      container: mapContainer,
      center: [107.58519549618038, -6.743442931566894],
      zoom: 11,
      style: {
        version: 8,
        name: "Stamen Terrain",
        sources: {
          stamen: {
            type: "raster",
            tiles: [
              "https://stamen-tiles.a.ssl.fastly.net/terrain/{z}/{x}/{y}.jpg",
            ],
            attribution: `Map tiles by <a href="http://stamen.com">Stamen Design</a>, under <a href="http://creativecommons.org/licenses/by/3.0">CC BY 3.0</a>. Data by <a href="http://openstreetmap.org">OpenStreetMap</a>, under <a href="http://www.openstreetmap.org/copyright">ODbL</a>.`,
          },
        },
        layers: [
          {
            id: "stamen",
            type: "raster",
            source: "stamen",
          },
        ],
      },
    });

    console.log(points);
    console.log(pointsToGeoJSONFeatureCollection(points));
    console.log(
      halfenMultiLineGeoJSONMultiPoints(points, halfenRecursion, randomRadius)
    );

    map.on("load", () => {
      map
        .addSource("points", {
          type: "geojson",
          data: pointsToGeoJSONFeatureCollection(points),
        })
        .addLayer({
          id: "points",
          type: "circle",
          source: "points",
          paint: {
            "circle-color": "red",
            "circle-radius": 8,
          },
        });

      map
        .addSource("points-lines", {
          type: "geojson",
          data: halfenMultiLineGeoJSONMultiPoints(
            points,
            halfenRecursion,
            randomRadius
          ),
        })
        .addLayer({
          id: "points-lines",
          type: "line",
          source: "points-lines",
        });
    });

    map.on("mousemove", (ev) => {
      mousePos = `Lng : ${ev.lngLat.lng}, Lat : ${ev.lngLat.lat}`;
    });
  });

  $: {
    if (map && map.loaded()) {
      const pointsSource = map.getSource("points") as GeoJSONSource;
      pointsSource.setData(pointsToGeoJSONFeatureCollection(points));

      const pointsLineSource = map.getSource("points-lines") as GeoJSONSource;
      pointsLineSource.setData(
        halfenMultiLineGeoJSONMultiPoints(points, halfenRecursion, randomRadius)
      );
    }
  }

  onDestroy(() => {
    map.remove();
  });
</script>

<div class="map-wrap">
  <div class="map" bind:this={mapContainer} />
</div>

<p>{mousePos}</p>

<style>
  .map-wrap {
    position: relative;
    width: 100%;
    height: calc(
      100vh - 77px
    ); /* calculate height of the screen minus the heading */
  }
  .map {
    position: absolute;
    width: 100%;
    height: 100%;
  }
</style>
