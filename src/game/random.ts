/**
 * Generates an infinite sequence of numbers with an approximately normal distribution
 * using the [Box Muller Transformation](https://en.wikipedia.org/wiki/Box%E2%80%93Muller_transform)
 */
function* normalDistributionGenerator(): Generator<number, never> {
  while (true) {
    const x = 2 * (Math.random() - 0.5);
    const y = 2 * (Math.random() - 0.5);
    const radius_squared = x * x + y * y;
    if (radius_squared > 1) {
      continue;
    } else if (radius_squared === 0) {
      yield 0;
      yield 0;
    } else {
      const scale_factor = Math.sqrt((-2 * Math.log(radius_squared)) / radius_squared);
      yield x * scale_factor;
      yield y * scale_factor;
    }
  }
}

const normalDistribution = normalDistributionGenerator();

/** @returns a number with an approximately normal distribution */
export function randomNormal(mean = 0, standardDeviation = 1) {
  return mean + normalDistribution.next().value * standardDeviation;
}
