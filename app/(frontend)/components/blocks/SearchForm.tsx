"use client";

import { Dropdown, DropdownItem } from 'flowbite-react';
import React, { useEffect, useState } from 'react'
import { Category } from '@/payload-types';

interface CategoryOption {
    id: string;
    name: string;
    slug: string;
}

interface SearchFormProps {
    searchQuery?: string
    onSearchChange?: (query: string) => void
    selectedCategory?: string
    onCategoryChange?: (category: string) => void
}

const SearchForm: React.FC<SearchFormProps> = ({
    searchQuery = '',
    onSearchChange,
    selectedCategory = 'All',
    onCategoryChange,
}) => {
    const [localQuery, setLocalQuery] = useState(searchQuery);
    const [selectedItem, setSelectedItem] = useState(selectedCategory);
    const [categories, setCategories] = useState<CategoryOption[]>([]);

    useEffect(() => {
        const fetchCategories = async () => {
            try {
                const res = await fetch('/api/categories');
                const data = await res.json();
                if (data.docs) {
                    setCategories(data.docs.map((doc: Category) => ({
                        id: doc.id,
                        name: doc.name,
                        slug: doc.slug,
                    })));
                }
            } catch (err) {
                console.error('Failed to load search categories:', err);
            }
        };
        fetchCategories();
    }, []);

    const handleCategorySelect = (categoryVal: string, displayLabel: string) => {
        setSelectedItem(displayLabel);
        if (onCategoryChange) {
            onCategoryChange(categoryVal);
        }
    };

    const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const val = e.target.value;
        setLocalQuery(val);
        if (onSearchChange) {
            onSearchChange(val);
        }
    };

    return (
        <form className="max-w-2xl mx-auto" onSubmit={(e) => e.preventDefault()}>
            <div className="flex items-center shadow-xs rounded-base w-full">
                <Dropdown label={selectedItem} className='bg-creamy-bg-darker! px-4! py-2.5! border border-creamy-bg-darker! rounded-e-none! h-auto! focus:outline-none! focus:ring-0!'>
                    <DropdownItem className="hover:bg-dark-creamy-bg!" onClick={() => handleCategorySelect('All', 'All')}>All</DropdownItem>
                    {categories.map((cat) => (
                        <DropdownItem key={cat.id || cat.slug} className="hover:bg-dark-creamy-bg!" onClick={() => handleCategorySelect(cat.slug, cat.name)}>
                            {cat.name}
                        </DropdownItem>
                    ))}
                </Dropdown>
                <input
                    type="search"
                    value={localQuery}
                    onChange={handleInputChange}
                    className="px-3 py-2.5 border border-creamy-bg-darker text-heading text-sm focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full"
                    placeholder="Search for products"
                    required
                />
                <button type="submit" className="inline-flex items-center text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-e-lg text-sm px-4 py-2.5 focus:outline-none">
                    <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                    Search
                </button>
            </div>
        </form>
    )
}

export default SearchForm