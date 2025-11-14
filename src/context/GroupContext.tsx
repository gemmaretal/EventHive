'use client'

import React, { createContext, useContext, useState, useEffect } from 'react'
import { mockGroups, type Group } from '@/mocks/groups'

interface GroupContextType {
  groups: Group[]
  createGroup: (payload: {
    eventSlug: string
    title: string
    organizerName: string
    maxMembers: number
  }) => Group
  requestJoin: (groupId: string, userId: string) => void
  acceptMember: (groupId: string, userId: string) => void
  leaveGroup: (groupId: string, userId: string) => void
  getGroupsByEvent: (eventSlug: string) => Group[]
  getGroupById: (groupId: string) => Group | undefined
}

const GroupContext = createContext<GroupContextType | undefined>(undefined)

const GROUPS_STORAGE_KEY = 'eventhive_groups'

function loadGroupsFromStorage(): Group[] {
  if (typeof window === 'undefined') {
    return mockGroups
  }

  try {
    const stored = localStorage.getItem(GROUPS_STORAGE_KEY)
    if (stored) {
      return JSON.parse(stored)
    }
  } catch (error) {
    console.error('Failed to load groups from localStorage:', error)
  }

  return mockGroups
}

function saveGroupsToStorage(groups: Group[]): void {
  if (typeof window === 'undefined') return

  try {
    localStorage.setItem(GROUPS_STORAGE_KEY, JSON.stringify(groups))
  } catch (error) {
    console.error('Failed to save groups to localStorage:', error)
  }
}

export function GroupProvider({ children }: { children: React.ReactNode }) {
  const [groups, setGroups] = useState<Group[]>([])
  const [isInitialized, setIsInitialized] = useState(false)

  useEffect(() => {
    const loaded = loadGroupsFromStorage()
    setGroups(loaded)
    setIsInitialized(true)
  }, [])

  useEffect(() => {
    if (isInitialized) {
      saveGroupsToStorage(groups)
    }
  }, [groups, isInitialized])

  const createGroup = (payload: {
    eventSlug: string
    title: string
    organizerName: string
    maxMembers: number
  }): Group => {
    const newGroup: Group = {
      id: `group-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      eventSlug: payload.eventSlug,
      title: payload.title,
      organizerName: payload.organizerName,
      maxMembers: payload.maxMembers,
      members: [],
      pendingRequests: [],
    }

    setGroups(prev => [...prev, newGroup])
    return newGroup
  }

  const requestJoin = (groupId: string, userId: string): void => {
    alert('Successfully Request Join!')
    setGroups(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group

        if (
          group.members.includes(userId) ||
          group.pendingRequests.includes(userId)
        ) {
          return group
        }

        if (group.members.length >= group.maxMembers) {
          return group
        }

        return {
          ...group,
          pendingRequests: [...group.pendingRequests, userId],
        }
      })
    )
  }

  const acceptMember = (groupId: string, userId: string): void => {
    alert('Successfully Accept The Request!')
    setGroups(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group

        if (!group.pendingRequests.includes(userId)) {
          return group
        }

        if (group.members.length >= group.maxMembers) {
          return group
        }

        return {
          ...group,
          members: [...group.members, userId],
          pendingRequests: group.pendingRequests.filter(id => id !== userId),
        }
      })
    )
  }

  const leaveGroup = (groupId: string, userId: string): void => {
    setGroups(prev =>
      prev.map(group => {
        if (group.id !== groupId) return group

        return {
          ...group,
          members: group.members.filter(id => id !== userId),
          pendingRequests: group.pendingRequests.filter(id => id !== userId),
        }
      })
    )
  }

  const getGroupsByEvent = (eventSlug: string): Group[] => {
    return groups.filter(group => group.eventSlug === eventSlug)
  }

  const getGroupById = (groupId: string): Group | undefined => {
    return groups.find(group => group.id === groupId)
  }

  const value: GroupContextType = {
    groups,
    createGroup,
    requestJoin,
    acceptMember,
    leaveGroup,
    getGroupsByEvent,
    getGroupById,
  }

  return <GroupContext.Provider value={value}>{children}</GroupContext.Provider>
}

export function useGroups() {
  const context = useContext(GroupContext)
  if (context === undefined) {
    throw new Error('useGroups must be used within a GroupProvider')
  }
  return context
}
