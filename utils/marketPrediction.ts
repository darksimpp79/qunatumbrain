export function predictMarketDirection(data: number[]): "up" | "down" {
  // This is a simple example. In a real-world scenario, you'd use more sophisticated
  // analysis, possibly involving machine learning models.
  const recentPrices = data.slice(-5)
  const average = recentPrices.reduce((a, b) => a + b, 0) / recentPrices.length
  const lastPrice = recentPrices[recentPrices.length - 1]

  return lastPrice > average ? "up" : "down"
}

