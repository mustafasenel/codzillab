import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { FullPostType } from "@/types";
import { User } from "@prisma/client";
import { Send } from "lucide-react";
import Link from "next/link";
import React from "react";
import { FormProvider, useForm } from "react-hook-form";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import axios from "axios";
import { z } from "zod";
import { zodResolver } from "@hookform/resolvers/zod";
import { FormControl, FormField, FormItem } from "@/components/ui/form";

interface PostCommentProps {
  post: FullPostType;
  currentUser: User;
}

const CommentFormSchema = z.object({
  comment: z.string().min(1, "Yorum boş olamaz"),
  postId: z.string(),
});

// Types for form values
type CommentFormValues = z.infer<typeof CommentFormSchema>;

const PostComment: React.FC<PostCommentProps> = ({ post, currentUser }) => {
  const queryClient = useQueryClient();

  const form = useForm<CommentFormValues>({
    resolver: zodResolver(CommentFormSchema),
    defaultValues: { postId: post.id },
  });

  // Yorum gönderme mutasyonu
  const commentMutation = useMutation({
    mutationFn: async (data: CommentFormValues) => {
      const response = await axios.post("/api/post/comment/create", data);
      return response.data; // Yeni yorumu döndür
      form.reset(); // Formu sıfırla
    },
    onSuccess: () => {
      // Yeni yorum gönderildikten sonra yorum sorgusunu geçersiz kıl
      queryClient.invalidateQueries({ queryKey: ["comments", post.id] });
      form.reset(); // Formu sıfırla
    },
  });

  // Form gönderildiğinde çağrılacak fonksiyon
  const onSubmit = (data: CommentFormValues) => {
    commentMutation.mutate(data); // Burada artık `data` doğru tiplenmiş olmalı
  };

  return (
    <div className="w-full gap-4 flex">
      <Link
        href={
          post.user ? `/${post.user.username}` : `/${post?.organization?.slug}`
        }
        className="flex items-center space-x-4"
      >
        <Avatar>
          <AvatarImage
            src={
              currentUser?.image ||
              "https://images-wixmp-ed30a86b8c4ca887773594c2.wixmp.com/f/271deea8-e28c-41a3-aaf5-2913f5f48be6/de7834s-6515bd40-8b2c-4dc6-a843-5ac1a95a8b55.jpg"
            }
          />
          <AvatarFallback>CN</AvatarFallback>
        </Avatar>
      </Link>
      <FormProvider {...form}>
        <form className="flex w-full" onSubmit={form.handleSubmit(onSubmit)}>
          <FormField
            control={form.control}
            name="comment"
            render={({ field }) => (
              <FormItem className="w-full">
                <FormControl>
                  <Input
                    placeholder="Yorum yapın"
                    {...field}
                    disabled={commentMutation.isPending}
                  />
                </FormControl>
              </FormItem>
            )}
          />
          {/* <Button type="submit" disabled={commentMutation.isLoading}>
            <Send className="h-5 w-5" />
          </Button> */}
        </form>
      </FormProvider>
    </div>
  );
};

export default PostComment;
