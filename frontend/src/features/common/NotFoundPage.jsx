import Link from 'next/link';
import { Compass } from 'lucide-react';
import { EmptyState, Button } from '@/components/common';

export default function NotFoundPage() {
  return (
    <div className="card mx-auto mt-10 max-w-xl">
      <EmptyState
        icon={Compass}
        title="Page not found"
        description="The page you are looking for does not exist or has moved."
        action={<Link href="/"><Button>Back to dashboard</Button></Link>}
      />
    </div>
  );
}


