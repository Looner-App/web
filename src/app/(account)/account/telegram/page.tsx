'use client';

import { useEffect, useState } from 'react';
import { useSearchParams } from 'next/navigation';
import { useQuery } from '@tanstack/react-query';
import { useConnect } from 'thirdweb/react';
import { useRouter } from 'next/navigation';
import { walletInApp } from '@/libs/web3/thirdweb/wallets';
import { useWalletName } from '@/libs/web3/thirdweb/hooks/useWalletName';
import { Card } from '@/components/card';

function TelegramLoginContent() {
  const { client } = useWalletName();

  const searchParams = useSearchParams();
  const { connect } = useConnect();
  const router = useRouter();
  const [params, setParams] = useState({ signature: ``, message: `` });

  useEffect(() => {
    const signature = searchParams.get(`signature`) || ``;
    const message = searchParams.get(`message`) || ``;
    setParams({ signature, message });
    console.log(`SearchParams:`, { signature, message });
  }, [searchParams]);

  useQuery({
    queryKey: [`telegram-login`, params.signature, params.message],
    queryFn: async () => {
      if (!params.signature || !params.message) {
        console.error(`Missing signature or message`);
        return false;
      }
      try {
        await connect(async () => {
          await walletInApp.connect({
            client,
            strategy: `auth_endpoint`,
            payload: JSON.stringify({
              signature: params.signature,
              message: params.message,
            }),
            encryptionKey: `AUTH_PHRASE`,
          });
          return walletInApp;
        });
        router.replace(`/`);
        return true;
      } catch (error) {
        console.error(`Connection error:`, error);
        return false;
      }
    },
    enabled: !!params.signature && !!params.message,
  });

  return (
    <div className="w-screen h-screen flex flex-col gap-2 items-center justify-center">
      Generating wallet...
    </div>
  );
}

export default async function Account() {
  return (
    <Card cardVariant={`secondary`} className="bg-zinc-900">
      <TelegramLoginContent />
    </Card>
  );
}
