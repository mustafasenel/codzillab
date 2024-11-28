'use client'

import { Button } from '@/components/ui/button'
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle } from '@/components/ui/dialog'
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { zodResolver } from '@hookform/resolvers/zod'
import React, { useEffect, useState } from 'react'
import { useForm } from 'react-hook-form'
import { z } from 'zod'

const formSchema = z.object({
    name: z.string().min(1, {
        message: 'Sunucu ismi gerekli'
    }),
    imageUrl: z.string().min(1, {
        message: 'Sunucu resmi gerekli'
    }),
})

const InitialModal = () => {

    const [isMounted, setIsMounted] = useState(false);

    useEffect(() => {
        setIsMounted(true)
    }, [])

    const form = useForm({
        resolver: zodResolver(formSchema),
        defaultValues: {
            name: '',
            imageUrl:''
        }
    });

    const isLoading = form.formState.isSubmitting;
    const onSubmit = async (values: z.infer<typeof formSchema>) => {
        console.log(values)
    }

    if (!isMounted) {
        return null
    }

  return (
    <Dialog open> 
      <DialogContent className='bg-white text-black p-0 overflow-hidden'>
        <DialogHeader className='pt-8 px-6'>
            <DialogTitle className='text-2xl text-center font-semibold'>
                Kendine ait sunucu oluştur
            </DialogTitle>
            <DialogDescription className='text-center text-zinc-500'>
                Sunucunuza bir kişilik kazandırmak için bir ad ve bir görsel ekleyin. Bunları her zaman daha sonra değiştirebilirsiniz.
            </DialogDescription>
        </DialogHeader>
        <Form {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)} className='space-y-8'>
                <div className='space-y-8 px-6'>
                    <div className='flex items-center justify-center text-center'>

                    </div>
                    <FormField
                        control={form.control}
                        name="name"
                        render={({field}) => (
                            <FormItem>
                                <FormLabel className='uppercase text-xs font-bold text-zinc-500 dark:text-secondary/70'>
                                    Sunucu Adı
                                </FormLabel>
                                <FormControl>
                                    <Input
                                        disabled={isLoading}
                                        className='bg-zinc-300/50 border-0 focus-visible:ring-0 text-black focus-visible:ring-offset-0'
                                        placeholder='Sunucu adını giriniz'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage/>
                            </FormItem>
                        )}
                    />
                </div>
                <DialogFooter className='px-6 py-4 flex items-center gap-2'>
                    <Button disabled={isLoading} variant='outline'>
                        Ana Sayfaya Dön
                    </Button>
                    <Button disabled={isLoading} variant='primary'>
                        Oluştur
                    </Button>
                </DialogFooter>
            </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}

export default InitialModal
