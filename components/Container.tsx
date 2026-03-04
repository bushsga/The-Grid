type Props = {
  children: React.ReactNode
  className?: string
}

export default function Container({ children }: Props) {
  return (
    <div className="max-w-7xl mx-auto w-full px-4 sm:px-6 lg:px-8">
      {children}
    </div>
  )
}