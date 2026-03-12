(function () {
  var TOKEN_KEY = "rendycrm.token"
  var API_KEY = "rendycrm.api"

  var output = document.getElementById("output")
  var apiUrlInput = document.getElementById("apiUrl")
  var emailInput = document.getElementById("email")
  var passwordInput = document.getElementById("password")
  var operatorSecretInput = document.getElementById("operatorSecret")

  var initialApi = localStorage.getItem(API_KEY) || (window.RUNTIME_CONFIG && window.RUNTIME_CONFIG.API_BASE_URL) || ""
  apiUrlInput.value = initialApi

  function log(value) {
    var text = typeof value === "string" ? value : JSON.stringify(value, null, 2)
    output.textContent = text
  }

  function getApiBase() {
    var value = (apiUrlInput.value || "").trim()
    if (!value) return ""
    return value.replace(/\/+$/, "")
  }

  function getToken() {
    return localStorage.getItem(TOKEN_KEY) || ""
  }

  function saveApi() {
    localStorage.setItem(API_KEY, getApiBase())
  }

  async function request(path, init) {
    saveApi()
    var base = getApiBase()
    var url = (base ? base : "") + path
    var headers = new Headers((init && init.headers) || {})
    headers.set("Content-Type", "application/json")
    var token = getToken()
    if (token) headers.set("Authorization", "Bearer " + token)
    var response = await fetch(url, {
      method: (init && init.method) || "GET",
      headers: headers,
      body: init && init.body ? init.body : undefined
    })
    var body
    try {
      body = await response.json()
    } catch (_e) {
      body = { raw: "non-json response" }
    }
    if (!response.ok) {
      throw new Error((body && body.error) || "HTTP " + response.status)
    }
    return body
  }

  document.getElementById("loginBtn").addEventListener("click", async function () {
    try {
      var res = await request("/auth/login", {
        method: "POST",
        body: JSON.stringify({
          email: emailInput.value,
          password: passwordInput.value
        })
      })
      localStorage.setItem(TOKEN_KEY, res.token || "")
      log({ ok: true, login: res })
    } catch (e) {
      log({ ok: false, error: e.message })
    }
  })

  document.getElementById("logoutBtn").addEventListener("click", function () {
    localStorage.removeItem(TOKEN_KEY)
    log({ ok: true, message: "logged out" })
  })

  document.getElementById("healthBtn").addEventListener("click", async function () {
    try {
      var res = await request("/health")
      log({ ok: true, health: res })
    } catch (e) {
      log({ ok: false, error: e.message })
    }
  })

  document.getElementById("meBtn").addEventListener("click", async function () {
    try {
      var res = await request("/auth/me")
      log({ ok: true, me: res })
    } catch (e) {
      log({ ok: false, error: e.message })
    }
  })

  document.getElementById("operatorWebhookBtn").addEventListener("click", async function () {
    try {
      saveApi()
      var base = getApiBase()
      var headers = new Headers()
      headers.set("Content-Type", "application/json")
      var secret = (operatorSecretInput.value || "").trim()
      if (secret) headers.set("X-Telegram-Bot-Api-Secret-Token", secret)

      var response = await fetch((base ? base : "") + "/webhooks/telegram/operator", {
        method: "POST",
        headers: headers,
        body: JSON.stringify({
          update_id: Date.now(),
          message: { text: "/start", chat: { id: 1 }, from: { id: 1 } }
        })
      })
      var body = await response.json().catch(function () {
        return { raw: "non-json response" }
      })
      if (!response.ok) throw new Error((body && body.error) || "HTTP " + response.status)
      log({ ok: true, webhook: body })
    } catch (e) {
      log({ ok: false, error: e.message })
    }
  })
})()

