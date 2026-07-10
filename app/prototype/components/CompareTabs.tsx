'use client'

import { Button } from '@/components/ui/button'

export type CompareTab = 'friend' | 'others'

export function CompareTabs({
  active,
  onChange,
}: {
  active: CompareTab
  onChange: (tab: CompareTab) => void
}) {
  return (
    <div className="mb-3 flex gap-2">
      <Button
        type="button"
        size="sm"
        variant={active === 'friend' ? 'default' : 'neutral'}
        onClick={() => onChange('friend')}
      >
        My Friend
      </Button>
      <Button
        type="button"
        size="sm"
        variant={active === 'others' ? 'default' : 'neutral'}
        onClick={() => onChange('others')}
      >
        Others
      </Button>
    </div>
  )
}
