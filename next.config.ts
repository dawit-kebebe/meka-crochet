import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
  allowedDevOrigins: ['9add-102-213-68-90.ngrok-free.app', 'localhost', '[IP_ADDRESS]'],
};

export default withFlowbiteReact(withPayload(nextConfig));