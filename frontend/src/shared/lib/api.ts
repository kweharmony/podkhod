async function fetchApi(path: string, options: RequestInit) {
  try { return await fetch(path, options) }
  catch { throw new Error('Нет связи с сервером. Проверьте, что backend запущен') }
}

let token: string | null = null
let refreshRequest: Promise<void> | null = null

export function clearToken() {
  token = null
}

async function send(path: string, body?: unknown) {
  const response = await fetchApi(`/api/auth/${path}`, {
    method: 'POST',
    credentials: 'same-origin',
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  if (!response.ok) {
    const data = await response.json()
    throw new Error(
      typeof data.detail === 'string'
        ? data.detail
        : 'Проверьте введённые данные',
    )
  }
  if (response.status === 204) return
  const data = await response.json()
  token = data.access_token
}

export async function refresh() {
  if (!refreshRequest) {
    refreshRequest = send('refresh').finally(() => {
      refreshRequest = null
    })
  }
  await refreshRequest
}

export async function apiFetch(path: string, options: RequestInit = {}) {
  function request() {
    const headers = new Headers(options.headers)
    if (token) headers.set('Authorization', `Bearer ${token}`)
    return fetchApi(`/api${path}`, { ...options, headers })
  }
  let response = await request()
  if (response.status === 401) {
    try {
      await refresh()
    } catch {
      clearToken()
      window.dispatchEvent(new Event('session-expired'))
      throw new Error('Сессия истекла. Войдите снова')
    }
    response = await request()
  }
  if (!response.ok) {
    const data = await response.json().catch(() => ({}))
    const detail = data.detail
    throw new Error(
      typeof detail === 'string'
        ? detail
        : Array.isArray(detail)
          ? detail
              .map(
                (item: { loc: string[]; msg: string }) =>
                  `${item.loc.slice(1).join('.')}: ${item.msg}`,
              )
              .join('; ')
          : 'Не удалось выполнить запрос',
    )
  }
  return response
}

export async function authenticate(
  path: 'login' | 'register',
  values: unknown,
) {
  await send(path, values)
  const response = await apiFetch('/auth/me')
  return response.json() as Promise<User>
}

export async function logout() {
  await send('logout')
  clearToken()
}

export type User = { id: number; name: string; email: string }

export async function request<T>(
  path: string,
  method = 'GET',
  body?: unknown,
): Promise<T> {
  const response = await apiFetch(path, {
    method,
    headers: { 'Content-Type': 'application/json' },
    body: body === undefined ? undefined : JSON.stringify(body),
  })
  return response.status === 204 ? (undefined as T) : response.json()
}
