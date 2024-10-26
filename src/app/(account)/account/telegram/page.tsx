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
  const [params, setParams] = useState({ jwt: `` });

  useEffect(() => {
    const jwt = searchParams.get(`jwt`) || ``;
    setParams({ jwt });
    console.log(`SearchParams:`, { jwt });
  }, [searchParams]);

  useQuery({
    queryKey: [`telegram-login`, params.jwt],
    queryFn: async () => {
      if (!params.jwt) {
        console.error(`Missing jwt`);
        return false;
      }
      try {
        await connect(async () => {
          await walletInApp.connect({
            client,
            strategy: `jwt`,
            jwt: params.jwt,
            /// @todo: public key to env.variable
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
    enabled: !!params.jwt,
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
