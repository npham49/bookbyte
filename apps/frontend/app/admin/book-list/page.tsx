import Link from "next/link";

export default function AdminBookListPage() {
  return (
    <div>
      This is the admin AdminBookListPage{" "}
      <Link href={"/admin/book-list/new"}>New Book</Link>
    </div>
  );
}
