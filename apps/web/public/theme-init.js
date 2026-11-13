;(function () {
  var clave = 'calculolibreperu:theme'
  var tema = null

  try {
    tema = window.localStorage.getItem(clave)
  } catch (error) {
    tema = null
  }

  if (tema !== 'light' && tema !== 'dark') {
    tema = 'dark'
  }

  document.documentElement.dataset.theme = tema

  var meta = document.querySelector('meta[name="theme-color"]')
  if (meta) meta.setAttribute('content', tema === 'dark' ? '#0a0a0a' : '#f5f5f5')
})()
