import Loading from './Loading'
export default function ResourceState({ loading, error }: { loading: boolean; error: string }) {
  if (loading) return <Loading />
  if (error) return <p role="alert" className="text-destructive">{error}</p>
  return null
}
