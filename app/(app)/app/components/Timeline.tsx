import { Card } from '@/components/ui/card'
import { FullUserType } from '@/types'
import React from 'react'

interface TimelineProps {
    user:FullUserType
}

const Timeline:React.FC<TimelineProps> = ({ user }) => {
  return (
    <div className='flex flex-col space-y-6'>
      <Card className='w-full h-60 flex items-center justify-center'>
            Post 1
      </Card>
      <Card className='w-full h-60 flex items-center justify-center'>
            Post 2
      </Card>
      <Card className='w-full h-60 flex items-center justify-center'>
            Post 3
      </Card>
      <Card className='w-full h-60 flex items-center justify-center'>
            Post 4
      </Card>
    </div>
  )
}

export default Timeline
