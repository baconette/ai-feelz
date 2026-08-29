'use client'

import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'

export function FriendCodeForm({
  value,
  onChange,
  onSubmit,
  paragraphClassName = 'text-muted-foreground',
  description = "Enter the permalink code from a friend's shared results to see how you compare.",
  submitLabel = 'Compare',
  disabled = false,
}: {
  value: string
  onChange: (value: string) => void
  onSubmit: () => void
  paragraphClassName?: string
  description?: string
  submitLabel?: string
  disabled?: boolean
}) {
  return (
    <div className="space-y-2 text-left">
      <p className={`text-xs font-base ${paragraphClassName}`}>{description}</p>
      <div className="flex gap-2">
        <Input
          className="flex-1"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder="e.g. wmoqie"
        />
        <Button type="button" variant="neutral" disabled={disabled || !value.trim()} onClick={onSubmit}>
          {submitLabel}
        </Button>
      </div>
    </div>
  )
}
