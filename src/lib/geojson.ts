import type GeoJSON from "geojson";
import { chaikinSmooth } from "./chaikin";

export const pointToGeoJSONPoint = (
  point: [number, number]
): GeoJSON.Geometry => {
  return {
    type: "Point",
    coordinates: point,
  };
};

export const pointsToGeoJSONFeatureCollection = (
  points: Array<[number, number]>
): GeoJSON.GeoJSON => {
  return {
    type: "FeatureCollection",
    features: points.map((point) => {
      return {
        type: "Feature",
        geometry: pointToGeoJSONPoint(point),
        properties: {},
      };
    }),
  };
};

const halfPointBetweenTwoPoint = (
  points: [[number, number], [number, number]]
): [number, number] => {
  return [
    points[0][0] + (points[1][0] - points[0][0]) / 2,
    points[0][1] + (points[1][1] - points[0][1]) / 2,
  ];
};

const randomSign = () => {
  return Math.round(Math.random()) * 2 - 1;
};

const getRandomRadius = (radius: number): [number, number] => {
  return [
    randomSign() * Math.random() * radius,
    randomSign() * Math.random() * radius,
  ];
};

const halfenTwoPoints = (
  points: [[number, number], [number, number]],
  recursion: number,
  random_radius: number
): Array<[number, number]> => {
  const half = halfPointBetweenTwoPoint(points);
  const radiusModifier = getRandomRadius(random_radius);

  half[0] += radiusModifier[0];
  half[1] += radiusModifier[1];

  let result: Array<[number, number]> = [points[0], half, points[1]];

  if (recursion > 1) {
    const firstSegment = halfenTwoPoints(
      [points[0], half],
      recursion - 1,
      random_radius
    ).slice(1, -1);
    const secondSegment = halfenTwoPoints(
      [half, points[1]],
      recursion - 1,
      random_radius
    ).slice(1, -1);

    result = [points[0], ...firstSegment, half, ...secondSegment, points[1]];
  }

  result = chaikinSmooth(result);

  return result;
};

export const halfenMultiLineGeoJSON = (
  points: [[number, number], [number, number]],
  recursion: number,
  random_radius: number
): GeoJSON.Geometry => {
  return {
    type: "LineString",
    coordinates: halfenTwoPoints(points, recursion, random_radius),
  };
};

export const halfenMultiLineGeoJSONMultiPoints = (
  points: Array<[number, number]>,
  recursion: number = 2,
  random_radius: number = 0.015
): GeoJSON.GeoJSON => {
  const result: GeoJSON.Feature[] = [];

  for (let i = 0; i < points.length - 1; i++) {
    result.push({
      type: "Feature",
      geometry: halfenMultiLineGeoJSON(
        [points[i], points[i + 1]],
        recursion,
        random_radius
      ),
      properties: {},
    });
  }

  return {
    type: "FeatureCollection",
    features: result,
  };
};
