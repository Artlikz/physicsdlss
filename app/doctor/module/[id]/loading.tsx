export default function Loading() {
  return (
    <div className="container py-8 px-4 mx-auto max-w-6xl">
      <div className="flex justify-center items-center min-h-[50vh]">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-primary"></div>
      </div>
    </div>
  )
}
