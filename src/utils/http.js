export const makeHttpRequest = async function (url) {
  try {
    const response = await fetch(url)
    return await response.json()
  } catch (err) {
    console.error(`Error fetching ${url}: `, err)
    return null
  }
}
