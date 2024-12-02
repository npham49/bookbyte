import { getAllBooksAction } from "@/data-access/actions/book.actions";
import Link from "next/link";
import AdminBookList from "./book-list";
import { Button } from "@/components/ui/button";

export default async function AdminBookListPage() {
  const data = await getAllBooksAction();

  return (
    <div>
      <div className="flex justify-between my-4">
        <h1>List of books and their current statuses</h1>
        <Link href={"/admin/book-list/new"}>
          <Button>New Book</Button>
        </Link>
      </div>
      <AdminBookList initialData={data.data} />
    </div>
  );
}
