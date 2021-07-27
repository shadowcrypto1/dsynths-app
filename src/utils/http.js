export const makeHttpRequest = async function (url) {
  try {
    const response = await fetch(url)
    // await new Promise(function(resolve, reject) {
    //   setTimeout(() => {
    //     resolve()
    //   }, 100000)
    // });
    return await response.json()
  } catch (err) {
    console.error(`Error fetching ${url}: `, err);
    return null
  }
}
