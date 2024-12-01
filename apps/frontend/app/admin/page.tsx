import Link from "next/link";

export default function AdminDashboardPage() {
  return (
    <div>
      This is the admin AdminDashboardPage
      <Link href="/admin/book-list">To book list</Link>
    </div>
  );
}
