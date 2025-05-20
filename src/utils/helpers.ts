const OPERATIONS = ['add', 'sub', 'mul', 'div'];

export function getRandomInt(max: number): number {
  return Math.floor(Math.random() * max);
}

export function getRandomOp(): string {
  return OPERATIONS[getRandomInt(OPERATIONS.length)];
}

export function sleep(): Promise<void> {
  const delay = Math.floor(Math.random() * 10000) + 5000;
  console.log(`sleep for ${delay / 1000}s`)
  return new Promise(resolve => setTimeout(resolve, delay));
}