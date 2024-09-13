declare global {
  interface Variables {
    player: {
      age: number;
      inventory: Array<{
        id: number;
        qty: number;
      }>;
    };
    score: number;
  }
}
