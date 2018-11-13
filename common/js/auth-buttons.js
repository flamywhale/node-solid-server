const elements = {};
['login', 'logout', 'accountSettings'].forEach(id => {
  elements[id] = document.getElementById(id) || document.createElement('div')
})

solid.auth.trackSession(session => {
  const loggedIn = !!session
  const isOwner = loggedIn && new URL(session.webId).origin === location.origin
  elements.login.classList.toggle('hidden', loggedIn)
  elements.logout.classList.toggle('hidden', !loggedIn)
  elements.accountSettings.classList.toggle('hidden', !isOwner)
})

async function login() {
  const session = await solid.auth.popupLogin()
  if (session) {
    // Make authenticated request to the server to establish a session cookie
    const {status} = await solid.auth.fetch(location, { method: 'HEAD' })
    if (status === 401) {
      alert(`Invalid login.\n\nDid you set ${session.idp} as your OIDC provider in your profile ${session.webId}?`)
      await solid.auth.logout()
    }
    // Now that we have a cookie, reload to display the authenticated page
    location.reload()
  }
}

async function logout() {
  await solid.auth.logout()
  location.reload()
}

function register() {
  const registration = new URL('/register', location)
  registration.searchParams.set('returnToUrl', location)
  location.href = registration
}
