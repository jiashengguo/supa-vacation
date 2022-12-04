import { NextApiRequest, NextApiResponse } from 'next';
import {
    type RequestHandlerOptions,
    requestHandler,
} from '@zenstackhq/runtime/server';
import { authOptions } from '../auth/[...nextauth]';
import { NextAuthOptions, unstable_getServerSession } from 'next-auth';
import service from '@zenstackhq/runtime/server';

const options: RequestHandlerOptions = {
    async getServerUser(req: NextApiRequest, res: NextApiResponse) {
      const session = await unstable_getServerSession(req, res, authOptions as NextAuthOptions);
      return session?.user;
    },
};
export default requestHandler(service, options);