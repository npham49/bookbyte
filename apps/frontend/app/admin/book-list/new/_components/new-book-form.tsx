"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import * as z from "zod";
import { useForm } from "react-hook-form";
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
import { Switch } from "@/components/ui/switch";
import { MultiSelect } from "@/components/multiselect";
import Dropzone from "./file-dropzone";
import { useState } from "react";
import { newBookSchema } from "@/lib/zod-schemas/book";
import { addNewBook } from "@/data-access/actions/book.actions";
import { redirect } from "next/navigation";

const categoryOptions = [
  { label: "Action", value: "Action" },
  { label: "Adventure", value: "Adventure" },
  { label: "Comedy", value: "Comedy" },
  { label: "Crime", value: "Crime" },
  { label: "Drama", value: "Drama" },
  { label: "Fantasy", value: "Fantasy" },
  { label: "Historical", value: "Historical" },
  { label: "Horror", value: "Horror" },
  { label: "Mystery", value: "Mystery" },
  { label: "Philosophical", value: "Philosophical" },
  { label: "Political", value: "Political" },
  { label: "Romance", value: "Romance" },
  { label: "Saga", value: "Saga" },
  { label: "Satire", value: "Satire" },
  { label: "Science fiction", value: "Science fiction" },
  { label: "Social", value: "Social" },
  { label: "Speculative", value: "Speculative" },
  { label: "Thriller", value: "Thriller" },
  { label: "Urban", value: "Urban" },
  { label: "Western", value: "Western" },
];
export function NewBookForm() {
  const [selectedFiles, setFiles] = useState<File[]>([]);
  const form = useForm<z.infer<typeof newBookSchema>>({
    resolver: zodResolver(newBookSchema),
    defaultValues: {
      name: "",
      author: "",
      chapterSeparator: "",
      category: [],
      publication: 0,
      publicDomain: false,
      copyrightReferencesRemoved: false,
    },
  });

  async function onSubmit(values: z.infer<typeof newBookSchema>) {
    console.log(values);
    const formData = new FormData();
    formData.append("file", selectedFiles[0]);
    formData.append("bookData", JSON.stringify(values));
    const response = await addNewBook(formData).catch((error) => {
      console.error(error);
      return;
    });
    if (response) {
      console.log("Book added successfully");
      form.reset();
      redirect("/admin/book-list");
    }
  }

  return (
    <Form {...form}>
      <form
        noValidate
        onSubmit={form.handleSubmit(onSubmit)}
        className="space-y-4"
      >
        <FormField
          control={form.control}
          name="name"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Name</FormLabel>
              <FormControl>
                <Input placeholder="The Republic" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="author"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Author</FormLabel>
              <FormControl>
                <Input placeholder="Plato" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="category"
          render={({}) => (
            <FormItem className="flex flex-col">
              <FormLabel>Category</FormLabel>
              <FormControl>
                <MultiSelect
                  options={categoryOptions}
                  onValueChange={(value) => {
                    form.setValue("category", value);
                  }}
                  placeholder="Select categories"
                  variant="inverted"
                  animation={2}
                  maxCount={3}
                  asChild={true}
                />
              </FormControl>
              <FormDescription>
                Categories the book falls under.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publication"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Publication Date</FormLabel>
              <FormControl>
                <Input type="number" placeholder="Pick a date" {...field} />
              </FormControl>
              <FormDescription>
                Date the book is published, this must be over 70 years of today.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="chapterSeparator"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Chapter Separator</FormLabel>
              <FormControl>
                <Input placeholder="Chapter" {...field} />
              </FormControl>
              <FormDescription>
                The separator used in the book to separate chapters. This can be
                &quot;Chapter&quot;, &quot;Section&quot;, &quot;Book&quot; etc.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />

        <FormField
          control={form.control}
          name="publicDomain"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">Public Domain</FormLabel>
                <FormDescription>
                  The book provided is within Public Domain in Canada, US and
                  Vietnam.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Dropzone
          name="Book File"
          required
          selectedFiles={selectedFiles}
          setFiles={setFiles}
        />
        <FormField
          control={form.control}
          name="copyrightReferencesRemoved"
          render={({ field }) => (
            <FormItem className="flex flex-row items-center justify-between rounded-lg border p-4">
              <div className="space-y-0.5">
                <FormLabel className="text-base">
                  References to provider removed
                </FormLabel>
                <FormDescription>
                  References to the source of the book have been removed. This
                  is to comply with public domain book providers requirements.
                </FormDescription>
              </div>
              <FormControl>
                <Switch
                  checked={field.value}
                  onCheckedChange={field.onChange}
                />
              </FormControl>
            </FormItem>
          )}
        />
        <Button type="submit">Submit</Button>
      </form>
    </Form>
  );
}
