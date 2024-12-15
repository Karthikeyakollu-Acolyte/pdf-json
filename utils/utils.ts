export function convertToRgba(color: string, opacity: number): string {
    // If color is in RGB format (e.g., rgb(0, 0, 255))
    if (color.startsWith('rgb')) {
        return `${color.replace('rgb', 'rgba').slice(0, -1)}, ${opacity})`;
    }

    // If color is in Hex format (e.g., #ff0000)
    if (color.startsWith('#')) {
        // Convert Hex to RGB
        let hex = color.slice(1);
        if (hex.length === 3) {
            hex = hex.split('').map(c => c + c).join('');
        }
        const r = parseInt(hex.slice(0, 2), 16);
        const g = parseInt(hex.slice(2, 4), 16);
        const b = parseInt(hex.slice(4, 6), 16);
        return `rgba(${r}, ${g}, ${b}, ${opacity})`;
    }

    // If color is already in RGBA format, change the opacity
    if (color.startsWith('rgba')) {
        return `${color.replace(/rgba\(([^,]+), ([^,]+), ([^,]+), ([^)]+)\)/, `rgba($1, $2, $3, ${opacity})`)}`;
    }

    // If color format is not recognized, return the original color
    return color;
}



// Helper functions for loop detection
interface Point {
    x: number;
    y: number;
  }
  
  export const crossProduct = (a: Point, b: Point, c: Point): number => {
    return (c.x - a.x) * (b.y - a.y) - (c.y - a.y) * (b.x - a.x);
  };
  
  const onSegment = (a: Point, b: Point, c: Point): boolean => {
    return (
      Math.min(a.x, b.x) <= c.x && c.x <= Math.max(a.x, b.x) &&
      Math.min(a.y, b.y) <= c.y && c.y <= Math.max(a.y, b.y)
    );
  };
  
  export const segmentsIntersect = (p1: Point, p2: Point, p3: Point, p4: Point): boolean => {
    const d1 = crossProduct(p1, p2, p3);
    const d2 = crossProduct(p1, p2, p4);
    const d3 = crossProduct(p3, p4, p1);
    const d4 = crossProduct(p3, p4, p2);
  
    return (
      ((d1 > 0 && d2 < 0) || (d1 < 0 && d2 > 0)) &&
      ((d3 > 0 && d4 < 0) || (d3 < 0 && d4 > 0)) ||
      (d1 === 0 && onSegment(p1, p2, p3)) ||
      (d2 === 0 && onSegment(p1, p2, p4)) ||
      (d3 === 0 && onSegment(p3, p4, p1)) ||
      (d4 === 0 && onSegment(p3, p4, p2))
    );
  };
  
  export const findLoop = (points: Point[]): Point[] | null => {
    const numPoints = points.length;
    for (let i = 0; i < numPoints - 2; i++) {
      for (let j = i + 2; j < numPoints - 1; j++) {
        if (segmentsIntersect(points[i], points[i + 1], points[j], points[j + 1])) {
          return points.slice(i + 1, j + 2);
        }
      }
    }
    return null;
  };