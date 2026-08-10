import type { NextConfig } from "next";
import { withPayload } from '@payloadcms/next/withPayload'
import withFlowbiteReact from "flowbite-react/plugin/nextjs";

const nextConfig: NextConfig = {
  /* config options here */
};

export default withFlowbiteReact(withPayload(nextConfig));