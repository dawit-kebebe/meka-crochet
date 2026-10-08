"use client";

import React, { useState } from 'react';

export interface TabItem {
  title: string;
  content: React.ReactNode;
}

interface ProductDetailTabsProps {
  tabs: TabItem[];
}

const ProductDetailTabs: React.FC<ProductDetailTabsProps> = ({ tabs }) => {
  const [activeTab, setActiveTab] = useState(0);

  if (!tabs || tabs.length === 0) return null;

  return (
    <div className="w-full">
      <div className="border-b border-creamy-bg-darker/40 w-full">
        <div className="flex flex-nowrap -mb-px w-full gap-4">
          {tabs.map((tab, index) => {
            const isActive = index === activeTab;
            return (
              <button
                type="button"
                key={tab.title}
                onClick={() => setActiveTab(index)}
                className={`py-3 px-1 text-center font-bold text-base sm:text-lg border-b-2 transition-colors cursor-pointer ${
                  isActive
                    ? 'border-primary-800 text-primary-800'
                    : 'border-transparent text-primary-800/60 hover:text-primary-800'
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>
      <div className="w-full pt-4">
        {tabs.map((tab, index) => (
          <div
            key={tab.title}
            className={index === activeTab ? 'block' : 'hidden'}
          >
            {tab.content}
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductDetailTabs;