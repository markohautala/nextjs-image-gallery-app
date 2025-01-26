import { redirect } from 'next/navigation';

// HomePage is a server-side component that redirects users to the gallery page.
export default function HomePage() {
  redirect('/gallery'); // Redirect users to the "/gallery" route immediately
}
