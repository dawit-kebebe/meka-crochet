"use client";

import { Dropdown, DropdownItem, TextInput } from 'flowbite-react';
import Link from 'next/link';
import React, { useState } from 'react'

const SearchForm = () => {
    const [selectedItem, setSelectedItem] = useState("All");

    return (
        <>

            <form className="max-w-2xl mx-auto">
                <div className="flex items-center shadow-xs rounded-base w-full">
                    <Dropdown label={selectedItem} className='bg-creamy-bg-darker! px-4! py-2.5! border border-creamy-bg-darker! rounded-e-none! h-auto! focus:outline-none! focus:ring-0!'>
                        <DropdownItem className="hover:bg-dark-creamy-bg!" onClick={()=>setSelectedItem('All')}>All</DropdownItem>
                        <DropdownItem className="hover:bg-dark-creamy-bg!" onClick={()=>setSelectedItem('Bag')}>Bag</DropdownItem>
                        <DropdownItem className="hover:bg-dark-creamy-bg!" onClick={()=>setSelectedItem('Kids')}>Kids</DropdownItem>
                        <DropdownItem className="hover:bg-dark-creamy-bg!" onClick={()=>setSelectedItem('Men')}>Men</DropdownItem>
                    </Dropdown>
                    <input type="search" className="px-3 py-2.5 border border-creamy-bg-darker text-heading text-sm focus:ring-primary-600 focus:border-primary-600 outline-none! block w-full" placeholder="Search for products" required />
                    <button type="button" className="inline-flex items-center  text-white bg-brand hover:bg-brand-strong box-border border border-transparent focus:ring-4 focus:ring-brand-medium shadow-xs font-medium leading-5 rounded-e-lg text-sm px-4 py-2.5 focus:outline-none">
                        <svg className="w-4 h-4 me-1.5" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeLinecap="round" strokeWidth="2" d="m21 21-3.5-3.5M17 10a7 7 0 1 1-14 0 7 7 0 0 1 14 0Z" /></svg>
                        Search
                    </button>
                </div>
            </form>

        </>
    )
}

export default SearchForm