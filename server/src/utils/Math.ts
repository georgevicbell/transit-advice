import { Position } from "../types";

export function getDistanceFromLatLonInKm(pos1: Position, pos2: Position) {
    var R = 6371; // Radius of the earth in km
    var dLat = deg2rad(pos2.lat - pos1.lat);  // deg2rad below
    var dLon = deg2rad(pos2.lon - pos1.lon);
    var a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos(deg2rad(pos1.lat)) * Math.cos(deg2rad(pos2.lat)) *
        Math.sin(dLon / 2) * Math.sin(dLon / 2)
        ;
    var c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
    var d = R * c; // Distance in km
    return d;
}

function deg2rad(deg: number) {
    return deg * (Math.PI / 180)
}