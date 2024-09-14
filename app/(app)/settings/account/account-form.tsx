"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm, Controller } from "react-hook-form";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { countries } from "@/utils/countryNames";
import { useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { useRouter } from "next/navigation";
import { Icons } from "@/components/icons";
import { FullUserType } from "@/types";
import { months } from "@/utils/months";

// Zod schema for the form
const accountFormSchema = z.object({
  day: z.string().min(1, "Gün alanı doldurulması zorunlu"),
  month: z.string().min(1, "Ay alanı doldurulması zorunlu"),
  year: z.string().min(1, "Yıl alanı doldurulması zorunlu"),
  country: z.string().min(1, "Şehir alanı doldurulması zorunlu"),
});

// Types for form values
type AccountFormValues = z.infer<typeof accountFormSchema>;

// Default values for the form

interface AccountFormProps {
  user: FullUserType
}

export function AccountForm({ user } : AccountFormProps) {
  const [isLoading, setIsLoading] = useState(false);
  const router = useRouter();

  const defaultValues: Partial<AccountFormValues> = {
    day: user.dob && user?.dob?.getDate().toString() || "1",
    month: user.dob && (user.dob.getMonth() + 1).toString() || "Ocak",
    year: user.dob && user.dob.getFullYear().toString() || "2024",
    country: user?.country || ""
  };
  
  const form = useForm<AccountFormValues>({
    resolver: zodResolver(accountFormSchema),
    defaultValues,
  });

  // Function to handle form submission
  function onSubmit(data: AccountFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/settings/account", data)
        .then(() => {
          toast.success("Hesap bilgileri başarıyla güncellendi!");
        })
        .finally(() => {
          setIsLoading(false);
          router.refresh();
        });
    } catch (error) {
      toast.error("An error occurred");
      console.log(error);
    }
  }

  // Array of days, months, and years for the select options
  const days = Array.from({ length: 31 }, (_, i) => i + 1);

  const years = Array.from(
    { length: 100 },
    (_, i) => new Date().getFullYear() - i
  );

  return (
    <Form {...form}>
      <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-8">
        <div className="sm:flex gap-4">
          <FormField
            control={form.control}
            name="day"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Gün</FormLabel>
                <Controller
                  name="day"
                  disabled={isLoading}
                  control={form.control}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Day" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {days.map((day) => (
                            <SelectItem value={day.toString()} key={day}>
                              {day}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormDescription>Doğum tarihinizi giriniz</FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="month"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Ay</FormLabel>
                <Controller
                  name="month"
                  control={form.control}
                  disabled={isLoading}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Month" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {months.map((month, index) => (
                            <SelectItem
                              value={(index + 1).toString()}
                              key={month}
                            >
                              {month}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
          <FormField
            control={form.control}
            name="year"
            render={({ field }) => (
              <FormItem className="flex flex-col">
                <FormLabel>Yıl</FormLabel>
                <Controller
                  name="year"
                  control={form.control}
                  disabled={isLoading}
                  render={({ field: { onChange, value } }) => (
                    <Select
                      onValueChange={(value) => onChange(value)}
                      value={value}
                    >
                      <SelectTrigger className="w-40">
                        <SelectValue placeholder="Year" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectGroup>
                          {years.map((year) => (
                            <SelectItem value={year.toString()} key={year}>
                              {year}
                            </SelectItem>
                          ))}
                        </SelectGroup>
                      </SelectContent>
                    </Select>
                  )}
                />
                <FormMessage />
              </FormItem>
            )}
          />
        </div>
        <FormField
          control={form.control}
          name="day"
          render={({ field }) => (
            <FormItem className="flex flex-col">
              <FormLabel>Şehir</FormLabel>
              <Controller
                name="country"
                control={form.control}
                disabled={isLoading}
                render={({ field: { onChange, value } }) => (
                  <Select
                    onValueChange={(value) => onChange(value)}
                    value={value}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue placeholder="Şehir" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectGroup>
                        {countries.map((country) => (
                          <SelectItem value={country.toString()} key={country}>
                            {country}
                          </SelectItem>
                        ))}
                      </SelectGroup>
                    </SelectContent>
                  </Select>
                )}
              />
              <FormDescription>Yaşadığınız şehri seçiniz</FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        <Button type="submit" disabled={isLoading}>
          {isLoading && <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />}
          Güncelle
        </Button>
      </form>
    </Form>
  );
}
