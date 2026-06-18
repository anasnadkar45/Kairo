"use client"
import { Button } from '@/components/ui/button';
import { BellIcon } from '@phosphor-icons/react'
import { usePathname } from 'next/navigation'

const Topbar = () => {
  const pathname = usePathname();
  console.log(pathname.split("/"))
  const title = pathname.split("/")[1]
  return (
    <div className='h-12 flex items-center justify-between px-4'>
      <h1 className='capitalize text-xl font-semibold'>{title}</h1>
      <Button  variant={"default"} size={"icon-lg"}>
        <BellIcon weight='duotone' />
      </Button>
    </div>
  )
}

export default Topbar