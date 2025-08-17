import { ChevronDownIcon, Image as ImageIcon, Video as VideoIcon } from "lucide-react"

type Props = {
  mode: 'image' | 'video'
  onChange: (mode: 'image' | 'video') => void
}

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(' ')
}

export default function FileTypeTabs({ mode, onChange }: Props) {
  const tabs = [
    { key: 'image' as const, name: 'Image', icon: ImageIcon },
    { key: 'video' as const, name: 'Video', icon: VideoIcon },
  ]

  return (
    <div>
      <div className="grid grid-cols-1 sm:hidden">
        <select
          value={mode}
          onChange={(e) => onChange(e.target.value as 'image' | 'video')}
          aria-label="Select a file type"
          className="col-start-1 row-start-1 w-full appearance-none rounded-md py-2 pr-8 pl-3 text-sm border border-[var(--color-border)] bg-[var(--color-card)] text-[var(--color-foreground)] focus:outline-2 focus:-outline-offset-2 focus:outline-[var(--color-ring)]"
        >
          {tabs.map((tab) => (
            <option key={tab.key} value={tab.key}>{tab.name}</option>
          ))}
        </select>
        <ChevronDownIcon
          aria-hidden="true"
          className="pointer-events-none col-start-1 row-start-1 mr-2 size-5 self-center justify-self-end text-[var(--color-muted-foreground)]"
        />
      </div>
      <div className="hidden sm:block">
        <div className="border-b border-[var(--color-border)]">
          <nav aria-label="Tabs" className="-mb-px flex space-x-8">
            {tabs.map((tab) => {
              const isCurrent = mode === tab.key
              const Icon = tab.icon
              return (
                <a
                  key={tab.key}
                  href="#"
                  onClick={(e) => {
                    e.preventDefault()
                    if (!isCurrent) onChange(tab.key)
                  }}
                  aria-current={isCurrent ? 'page' : undefined}
                  className={
                    classNames(
                      isCurrent
                        ? 'border-[var(--color-primary)] text-[var(--color-primary)]'
                        : 'border-transparent text-[var(--color-muted-foreground)] hover:border-[var(--color-border)] hover:text-[var(--color-foreground)]',
                      'group inline-flex items-center border-b-2 px-1 py-3 text-sm font-medium'
                    )
                  }
                >
                  <Icon
                    aria-hidden="true"
                    className={classNames(
                      isCurrent
                        ? 'text-[var(--color-primary)]'
                        : 'text-[var(--color-muted-foreground)] group-hover:text-[var(--color-foreground)]',
                      'mr-2 -ml-0.5 size-5'
                    )}
                  />
                  <span>{tab.name}</span>
                </a>
              )
            })}
          </nav>
        </div>
      </div>
    </div>
  )
}
