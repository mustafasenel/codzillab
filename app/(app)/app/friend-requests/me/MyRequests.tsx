"use client"

import React from 'react'

import { FullGameBodyType, FullUserType } from '@/types';
import { Game } from '@prisma/client';
import MyRequests from '../components/MyRequests';

interface MyRequestsProps {
    user: FullUserType;
    games?: Game[];
    userGameBodyAdverts?: FullGameBodyType[] | [] | undefined;
  }

const MyRequestsComp:React.FC<MyRequestsProps> = ({ user, games, userGameBodyAdverts }) => {
  return (
    <div className="pt-10">
    <MyRequests
      games={games}
      user={user}
      userGameBodyAdverts={userGameBodyAdverts}
    />
  </div>
  )
}

export default MyRequestsComp
