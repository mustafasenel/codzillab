"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useForm } from "react-hook-form";
import { z } from "zod";

import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import toast from "react-hot-toast";
import axios from "axios";
import { useEffect, useState } from "react";
import { Icons } from "@/components/icons";
import { useRouter } from "next/navigation";
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from "@/components/ui/command";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Check, ChevronsUpDown, Gamepad2, X } from "lucide-react";
import Image from "next/image";
import { Label } from "@/components/ui/label";
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { useTheme } from "next-themes";
import { Separator } from "@/components/ui/separator";
import { Game, GameBody } from "@prisma/client";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { useEdgeStore } from "@/lib/edgestore";
import { ScrollArea } from "@/components/ui/scroll-area";
import { FaXTwitter } from "react-icons/fa6";
import { FaFacebook, FaGithub, FaInstagram, FaLinkedin } from "react-icons/fa";
import { IoIosLink } from "react-icons/io";
import { SingleImageDropzone } from "@/components/SıngleImageDropzone";

const OrganizationFormSchema = z.object({
  name: z
    .string()
    .max(30, { message: "Organizasyon adı çok uzun." })
    .min(2, { message: "Organizasyon adı çok kısa" }),
  contactEmail: z
    .string({
      required_error: "Lütfen e-mail giriniz.",
    })
    .email(),
  description: z
    .string()
    .max(260, { message: "Açıklama metni çok uzun." })
    .min(20, { message: "Açıklama metni çok kısa" }),
  logo: z.string().optional(),
  links: z
    .array(
      z.object({
        value: z
          .string()
          .optional()
          .refine(
            (val) =>
              !val ||
              val.trim() === "" ||
              z.string().url().safeParse(val).success,
            {
              message: "Lütfen geçerli URL giriniz.",
            }
          ),
      })
    )
    .optional(),
});

type OrganizationFormValues = z.infer<typeof OrganizationFormSchema>;

interface CreateOrganizationProps {
  isOpen: boolean;
  onClose: () => void;
}

export function CreateOrganization({
  isOpen,
  onClose,
}: CreateOrganizationProps) {
  const defaultValues: Partial<OrganizationFormValues> = {};

  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState<File>();
  const [isSubbitted, setIsSubmitting] = useState(false);
  const [imageFile, setImageFile] = useState<string>("");

  const router = useRouter();
  const { edgestore } = useEdgeStore();

  const form = useForm<OrganizationFormValues>({
    resolver: zodResolver(OrganizationFormSchema),
    defaultValues,
    mode: "onChange",
  });

  const { control, setValue, getValues, watch, setError, clearErrors } = form;
  const onChange = async (file?: File) => {
    if (file) {
      setIsSubmitting(true);
      setFile(file);
      const res = await edgestore.publicFiles.upload({
        file,
      });
      setValue("logo", res.url)
      setImageFile(res.url)
      setIsSubmitting(false);
    }
  };

  const handleDeleteFile = async (file: string) => {
    if (file) {
      await edgestore.publicFiles.delete({
        url: file,
      });
      setValue("logo", "");
      setFile(undefined);
      setImageFile("")
    }
  }

  const imageUrlResponse = watch("logo");
  function onSubmit(data: OrganizationFormValues) {
    try {
      setIsLoading(true);
      axios
        .post("/api/organization/create", data)
        .then(() => {
          toast.success("Organizasyon oluşturuldu!");
          form.reset();
          setFile(undefined);
          setImageFile("");
          router.refresh();
          onClose();
        })
        .catch((error) => {
          const errorMessage = error.response?.data?.message || "Bir hata oluştu";
          toast.error(errorMessage);
        })
        .finally(() => {
          setIsLoading(false);

        });
    } catch (error) {
      toast.error("Bir hata oluştu");
      console.log(error);
    }
  }
  
  function getIconForUrl(url: string) {
    if (url) {
      if (url.includes("twitter.com") || url.includes("x.com")) {
        return <FaXTwitter />;
      } else if (url.includes("github.com")) {
        return <FaGithub />;
      } else if (url.includes("facebook.com")) {
        return <FaFacebook />;
      } else if (url.includes("linkedin.com")) {
        return <FaLinkedin />;
      } else if (url.includes("instagram.com")) {
        return <FaInstagram />;
      } else {
        return <IoIosLink />;
      }
    } else {
      return <IoIosLink />;
    }
  }

  const urls = [0, 1, 2, 3];

  const username = watch("name");
  useEffect(() => {
    if (username) {
      const checkUsername = async () => {
        try {
          const response = await axios.get(
            `/api/organization/check-name?username=${username}`
          );
          if (!response.data.isAvailable) {
            setError("name", {
              type: "manual",
              message: "İsim kullanılıyor",
            });
          } else {
            clearErrors("name");
          }
        } catch (error) {
          toast.error("Error checking username availability");
        }
      };

      // Bir debounce etkisi yaratmak için kullanıcı yazmayı bitirene kadar kısa bir bekleme süresi
      const timeoutId = setTimeout(checkUsername, 500);
      return () => clearTimeout(timeoutId); // Her kullanıcı girişi olduğunda önceki timeout'u iptal ediyoruz
    }
  }, [username, setError, clearErrors]);
  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="sm:max-w-5xl max-h-screen ">
        <DialogHeader>
          <DialogTitle>Organizasyon Oluştur</DialogTitle>
          <DialogDescription>
            Organizasyon oluşturun ve daha fazla kişiye erişi ayrıcalıklardan
            yararlanın.
          </DialogDescription>
        </DialogHeader>
        <Separator />
        <Form {...form}>
          <form className="space-y-6 flex">
            <div className="flex flex-col sm:flex-row gap-10 w-full">
              <div className="space-y-4 flex-1">
                <FormField
                  control={form.control}
                  name="name"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Ad</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Organizasyon adını giriniz"
                          {...field}
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
  

                <FormField
                  control={form.control}
                  name="description"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>Hakkında</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Organizasyonunuzu tanıtan kısa açıklama giriniz."
                          {...field}
                          rows={2}
                          className="resize-none"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                                <FormField
                  control={form.control}
                  name="contactEmail"
                  render={({ field }: { field: any }) => (
                    <FormItem className="space-y-4">
                      <FormLabel>E-mail</FormLabel>
                      <FormControl>
                        <Input
                          placeholder="Organizasyonun email adresini giriniz"
                          {...field}
                          type="email"
                        />
                      </FormControl>
                      <FormMessage className="text-red-500" />
                    </FormItem>
                  )}
                />
                <div>
                  {urls.map((index) => (
                    <FormField
                      control={form.control}
                      key={index}
                      name={`links.${index}.value`}
                      render={({ field }: { field: any }) => (
                        <FormItem>
                          <FormLabel className={cn(index !== 0 && "sr-only")}>
                            URLs
                          </FormLabel>
                          <FormDescription
                            className={cn(index !== 0 && "sr-only")}
                          >
                            Web sitenize, blogunuza veya sosyal medya
                            profillerinize bağlantılar ekleyin.
                          </FormDescription>
                          <FormControl>
                            <div className="flex items-center gap-3">
                              <div className="flex items-center justify-center text-lg">
                                {getIconForUrl(field.value)}
                              </div>
                              <Input
                                {...field}
                                placeholder="Sosyal profilinize bağlantı ekleyin."
                                className="py-0.5 text-xs"
                                disabled={isLoading}
                              />
                            </div>
                          </FormControl>
                          <FormMessage />
                        </FormItem>
                      )}
                    />
                  ))}
                </div>
              </div>
              <div className="min-w-80">
                <div className="flex flex-col justify-center space-y-4">
                  <Label>Organizasyon Logosu</Label>
                  <div className="flex group items-center justify-center w-full rounded-lg border-none relative">
                    {
                      file && (
                          <div
                            className="group absolute right-0 top-0 -translate-y-1/4 translate-x-1/4 transform z-50 cursor-pointer"
                            onClick={() => handleDeleteFile(imageUrlResponse!)}
                          >
                            <div className="flex h-5 w-5 items-center justify-center rounded-md border border-solid border-gray-500 bg-white transition-all duration-300 hover:h-6 hover:w-6 dark:border-gray-400 dark:bg-black">
                              <X
                                className="text-gray-500 dark:text-gray-400"
                                width={16}
                                height={16}
                              />
                            </div>
                          </div>
                      )
                    }
                    <SingleImageDropzone
                      className="w-full outline-none relative"
                      disabled={isSubbitted}
                      value={file}
                      onChange={onChange}
                    />
                  </div>
                </div>
              </div>
            </div>
          </form>
        </Form>
        <DialogFooter className="sm:justify-end gap-4">
          <DialogClose asChild>
            <Button type="button" variant="secondary">
              Kapat
            </Button>
          </DialogClose>
          <Button
            type="submit"
            disabled={isLoading}
            onClick={form.handleSubmit(onSubmit)}
          >
            {isLoading && (
              <Icons.spinner className="mr-2 h-4 w-4 animate-spin" />
            )}
            Oluştur
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
