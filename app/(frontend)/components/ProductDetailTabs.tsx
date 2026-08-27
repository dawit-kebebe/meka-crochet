"use client";
import React from 'react';

import Link from 'next/link';
import { useParams } from 'next/navigation';

interface TabsProps {
  tabs: {
    title: string,
    content: React.ReactNode | React.ReactNode[]
  }[],
}

const ProductDetailTabs = ({ tabs }: TabsProps) => {
  const [selectedTab, setSelectedTab] = React.useState(tabs[0].title.toLowerCase().replace(" ", "-"));
  const params = useParams();
  console.log(params)

  return (
    <div className="max-w-7xl mx-auto">
      <div className="border-b border-gray-400 w-full">
        <ul className="flex flex-nowrap -mb-px w-full font-medium text-center text-body">
          {tabs.map((tab, index) => (
            <li className="me-2 w-full" key={index}>
              <Link onClick={() => setSelectedTab(tab.title.toLowerCase().replace(" ", "-"))} href={`#${tab.title.toLowerCase().replace(" ", "-")}`} className={`${tab.title.toLowerCase().replace(" ", "-") === selectedTab ? "border-primary-800 text-primary-800 font-semibold" : "text-primary-800 border-transparent"} w-full inline-flex items-center justify-center p-4 border-b rounded-t-base group`}>
                {tab.title}
              </Link>
            </li>
          ))}
        </ul>
      </div>
      <div className="w-full p-4">
        {tabs.map((tab, index) => (
          <div id={`${tab.title.toLowerCase().replace(" ", "-")}`} key={index} className={`${tab.title.toLowerCase().replace(" ", "-") === selectedTab ? "block" : "hidden"}`}>
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  )
}

export default ProductDetailTabs