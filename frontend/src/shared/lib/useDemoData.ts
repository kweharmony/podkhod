import { useEffect, useState } from 'react'
import { useSearchParams } from 'react-router-dom'

type State<T> = {
  data: T[]
  loading: boolean
  error: boolean
}

// Демо-данные приходят с задержкой, как придут с сервера в ЛР №5.
// Поэтому у экранов есть состояния загрузки, ошибки и пустого списка.
// Чтобы посмотреть два последних, к адресу можно добавить ?demo=fail или ?demo=empty
export function useDemoData<T>(items: T[]): State<T> {
  const [searchParams] = useSearchParams()
  const mode = searchParams.get('demo')

  const [state, setState] = useState<State<T>>({ data: [], loading: true, error: false })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (mode === 'fail') {
        setState({ data: [], loading: false, error: true })
      } else {
        setState({ data: mode === 'empty' ? [] : items, loading: false, error: false })
      }
    }, 700)

    return () => clearTimeout(timer)
  }, [items, mode])

  return state
}
