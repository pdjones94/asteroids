export function rotatePoint(p, center, angle) {
    return {
      x: ((p.x-center.x)*Math.cos(angle) - (p.y-center.y)*Math.sin(angle)) + center.x,
      y: ((p.x-center.x)*Math.sin(angle) + (p.y-center.y)*Math.cos(angle)) + center.y
    };
  };


export function asteroidVertices(num, radius) {
  const points = [];
  for (let i = 0; i<num; i++) {
    points.push({
      x: (-Math.sin((360/num)*i*Math.PI/180) + Math.round(Math.random()*2-1)*Math.random()/3)*radius,
      y: (-Math.cos((360/num)*i*Math.PI/180) + Math.round(Math.random()*2-1)*Math.random()/3)*radius
    });
  }
  return points;
}

export function randomNumberBetween(min, max) {
  return Math.random() * (max - min + 1) + min;
}

export function randomIntBetween(min, max) {
  return Math.floor(Math.random() * (max - min + 1) + min);
}

export function randomNumberBetweenExcluding(min, max, minEx, maxEx) {
  let randomNumber = randomNumberBetween(min, max);
  while (randomNumber > minEx && randomNumber < maxEx) {
    randomNumber = randomNumberBetween(min, max);
  }
  return randomNumber;
}