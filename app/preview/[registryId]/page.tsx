"use client";
import { useParams, useRouter } from 'next/navigation';
import RoomView from '../../components/RoomView';

export default function PreviewPage() {
  const { registryId } = useParams<{ registryId: string }>();
  const router = useRouter();

  return <RoomView registryId={registryId} onBack={() => router.push('/')} />;
}
