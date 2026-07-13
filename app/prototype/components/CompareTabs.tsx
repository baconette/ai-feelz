'use client'

import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs'

export type CompareTab = 'friend' | 'others'

export function CompareTabs({
  active,
  onChange,
}: {
  active: CompareTab
  onChange: (tab: CompareTab) => void
}) {
  return (
    <Tabs value={active} onValueChange={(value) => onChange(value as CompareTab)} className="mb-3 w-fit mx-auto">
      <TabsList>
        <TabsTrigger value="friend">My Friend</TabsTrigger>
        <TabsTrigger value="others">Others</TabsTrigger>
      </TabsList>
    </Tabs>
  )
}
