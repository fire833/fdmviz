import { Vector3 } from 'three';
import { edgeTable, triTable } from './LookUpTable';
import { defaultResolution } from './VoxelSpace';

export const scale = 10;
const isolevel = 0.5;

// Returns a list of vectors, to be grouped as the triplets which are the vertices of each face
export function marchingCubes(points: Vector3[], values: number[]): Vector3[] {
  // approximated intersection points
  var vlist = new Array(12);
  // resolution^2
  const resolution2 = defaultResolution * defaultResolution;
  // mesh triangles
  let trianglePoints: Vector3[] = [];

  for (var z = 0; z < defaultResolution - 1; z++)
    for (var y = 0; y < defaultResolution - 1; y++)
      for (var x = 0; x < defaultResolution - 1; x++) {
        // indexes of points in the cube
        var p = x + defaultResolution * y + resolution2 * z,
          px = p + 1,
          py = p + defaultResolution,
          pxy = py + 1,
          pz = p + resolution2,
          pxz = px + resolution2,
          pyz = py + resolution2,
          pxyz = pxy + resolution2;

        // store scalar values corresponding to vertices
        var value0 = values[p],
          value1 = values[px],
          value2 = values[py],
          value3 = values[pxy],
          value4 = values[pz],
          value5 = values[pxz],
          value6 = values[pyz],
          value7 = values[pxyz];

        // cubeindex
        var cubeindex = 0;
        if (value0 < isolevel) cubeindex |= 1;
        if (value1 < isolevel) cubeindex |= 2;
        if (value2 < isolevel) cubeindex |= 8;
        if (value3 < isolevel) cubeindex |= 4;
        if (value4 < isolevel) cubeindex |= 16;
        if (value5 < isolevel) cubeindex |= 32;
        if (value6 < isolevel) cubeindex |= 128;
        if (value7 < isolevel) cubeindex |= 64;

        // lookup edges
        var bits = edgeTable[cubeindex];
        if (bits === 0) continue;

        // approximate intersection points
        var mu = 0.5;
        if (bits & 1) {
          mu = (isolevel - value0) / (value1 - value0);
          vlist[0] = points[p].clone().lerp(points[px], mu);
        }
        if (bits & 2) {
          mu = (isolevel - value1) / (value3 - value1);
          vlist[1] = points[px].clone().lerp(points[pxy], mu);
        }
        if (bits & 4) {
          mu = (isolevel - value2) / (value3 - value2);
          vlist[2] = points[py].clone().lerp(points[pxy], mu);
        }
        if (bits & 8) {
          mu = (isolevel - value0) / (value2 - value0);
          vlist[3] = points[p].clone().lerp(points[py], mu);
        }
        // top of the cube
        if (bits & 16) {
          mu = (isolevel - value4) / (value5 - value4);
          vlist[4] = points[pz].clone().lerp(points[pxz], mu);
        }
        if (bits & 32) {
          mu = (isolevel - value5) / (value7 - value5);
          vlist[5] = points[pxz].clone().lerp(points[pxyz], mu);
        }
        if (bits & 64) {
          mu = (isolevel - value6) / (value7 - value6);
          vlist[6] = points[pyz].clone().lerp(points[pxyz], mu);
        }
        if (bits & 128) {
          mu = (isolevel - value4) / (value6 - value4);
          vlist[7] = points[pz].clone().lerp(points[pyz], mu);
        }
        // vertical lines of the cube
        if (bits & 256) {
          mu = (isolevel - value0) / (value4 - value0);
          vlist[8] = points[p].clone().lerp(points[pz], mu);
        }
        if (bits & 512) {
          mu = (isolevel - value1) / (value5 - value1);
          vlist[9] = points[px].clone().lerp(points[pxz], mu);
        }
        if (bits & 1024) {
          mu = (isolevel - value3) / (value7 - value3);
          vlist[10] = points[pxy].clone().lerp(points[pxyz], mu);
        }
        if (bits & 2048) {
          mu = (isolevel - value2) / (value6 - value2);
          vlist[11] = points[py].clone().lerp(points[pyz], mu);
        }

        // lookup triangles
        var i = 0;
        cubeindex <<= 4; // multiply by 16...
        while (triTable[cubeindex + i] != -1) {
          var index1 = triTable[cubeindex + i];
          var index2 = triTable[cubeindex + i + 1];
          var index3 = triTable[cubeindex + i + 2];

          trianglePoints.push(vlist[index1].clone());
          trianglePoints.push(vlist[index2].clone());
          trianglePoints.push(vlist[index3].clone());

          i += 3;
        }
      }

  return trianglePoints;
}
