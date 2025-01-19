import { redirect } from 'next/navigation';

export default function HomePage() {
  redirect('/gallery'); // Redirect immediately on the server
}
