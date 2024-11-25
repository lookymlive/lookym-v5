import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar"

export function RecentSales() {
  return (
    <div className="space-y-8">
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/01.png" alt="Avatar" />
          <AvatarFallback>JD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">John Doe</p>
          <p className="text-sm text-muted-foreground">john@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$249.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/02.png" alt="Avatar" />
          <AvatarFallback>JC</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Jane Cooper</p>
          <p className="text-sm text-muted-foreground">jane@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$399.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/03.png" alt="Avatar" />
          <AvatarFallback>RK</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Robert King</p>
          <p className="text-sm text-muted-foreground">robert@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$149.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/04.png" alt="Avatar" />
          <AvatarFallback>SD</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Sarah Davis</p>
          <p className="text-sm text-muted-foreground">sarah@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$299.00</div>
      </div>
      <div className="flex items-center">
        <Avatar className="h-9 w-9">
          <AvatarImage src="/avatars/05.png" alt="Avatar" />
          <AvatarFallback>MM</AvatarFallback>
        </Avatar>
        <div className="ml-4 space-y-1">
          <p className="text-sm font-medium leading-none">Michael Miller</p>
          <p className="text-sm text-muted-foreground">michael@example.com</p>
        </div>
        <div className="ml-auto font-medium">+$199.00</div>
      </div>
    </div>
  )
}
