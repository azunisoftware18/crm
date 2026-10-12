'use client'

import Link from 'next/link';
import { Lock } from 'lucide-react';
import { EmptyState, Button } from '@/components/common';
import { useAuth } from '@/context/AuthContext';
import { ROLE_META } from '@/config/roles';

export default function ForbiddenPage() {
  const { role } = useAuth();
  return (
    <div className="card mx-auto mt-10 max-w-xl">
      <EmptyState
        icon={Lock}
        title="You don't have access to this screen"
        description={`Your role (${ROLE_META[role].label}) does not include this module. Ask the Manager if you need access.`}
        action={<Link href="/"><Button variant="secondary">Back to dashboard</Button></Link>}
      />
    </div>
  );
}


