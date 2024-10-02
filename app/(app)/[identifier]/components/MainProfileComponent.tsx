import { FullGameBodyType, FullUserType } from '@/types'
import React from 'react'

import Cover from './Cover';
import ProfileDetails from './ProfileDetails';

interface MainProfileComponentProps {
    user: FullUserType;
    currentUser: FullUserType;
    userGameBodyAdverts?: FullGameBodyType[] | [];
}
  
const MainProfileComponent:React.FC<MainProfileComponentProps> = ({ user, currentUser, userGameBodyAdverts }) => {
  return (
    <div className='w-full flex-col py-2 md:px-0 px-2'>
        <Cover user={user} currentUser={currentUser} />
        <ProfileDetails user={user} currentUser={currentUser}/>
    </div>
  )
}

export default MainProfileComponent
