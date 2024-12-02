"use client"

import { Plus } from 'lucide-react'
import React from 'react'
import ActionTooltip from '../ActionTooltip'
import { useModal } from '@/hooks/use-modal'

const NavigationAction = () => {

    const { onOpen } = useModal();

  return (
    <div>
        <ActionTooltip
            side='right'
            align='center'
            label='Sunucu Ekle'
        >

      <button className='group flex items-center' onClick={() => onOpen("createServer")}>
        <div className='flex mx-3 h-[48px] w-[48px] rounded-[24px] group-hover:rounded-[16px] transition-all overflow-hidden items-center justify-center bg-background dark:bg-slate-700 group-hover:bg-indigo-500'>
            <Plus 
                className='group-hover:text-white transition text-indigo-400'
                size={25}
            />
        </div>
      </button>
        </ActionTooltip>
    </div>
  )
}

export default NavigationAction
