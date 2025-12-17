import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';

import { MoreHorizontalIcon } from "lucide-react"

export const ConfigBlock: React.FC<{ source: string }> = async ({ source }) => {
  return (
    <div className='flex w-full max-w-[100%] flex-col gap-y-3  xl:max-w-[440px]'>
      <Card>
        <CardContent>
          <div className='flex items-center justify-between'>
            <p>Config Block - source: {source}</p>
            <div>
              <DropdownMenu modal={false}>
                <DropdownMenuTrigger asChild>
                  <Button
                    variant='outline'
                    aria-label='Open menu'
                    size='icon-sm'
                  >
                    {' '}
                    <MoreHorizontalIcon />{' '}
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuLabel>My Account</DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem>Profile</DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
          <div className='grid grid-cols-[28px_1fr] items-center gap-x-3'></div>
          <div>
            <p className='font-normal font-sans txt-compact-small text-ui-fg-subtle'>
              Available in
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
