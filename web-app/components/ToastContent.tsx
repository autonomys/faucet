interface ToastContentProps {
  title: string
  description: string
}

export const ToastContent: React.FC<ToastContentProps> = ({ title, description }) => {
  return (
    <div className='space-y-1'>
      <div className='text-lg font-medium'>{title}</div>
      <div className='text-sm font-normal'>{description}</div>
    </div>
  )
}
